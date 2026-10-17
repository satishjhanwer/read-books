# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

v3 is a rewrite of an old react-boilerplate/Goodreads app as a Vite + React + TypeScript SPA backed by the Open Library API, deployed to GitHub Pages (<https://satishjhanwer.github.io/read-books/>). [plan.md](plan.md) records the rewrite plan, decisions, and the v1.1 ideas (reading list, Google Books fallback, PWA). The old app is only in git history.

## Commands

Yarn 4 via Corepack (`corepack enable`), Node from `.nvmrc`.

```sh
yarn dev             # Vite dev server at http://localhost:5173/read-books/
yarn build           # tsc -b && vite build -> dist/
yarn preview         # serve dist/
yarn lint            # ESLint (typescript-eslint strictTypeChecked)
yarn typecheck       # tsc -b
yarn test            # Vitest (jsdom, globals)
yarn test src/App.test.tsx   # single file; add -t "<name>" for one test
yarn format          # Prettier; CI runs format:check
yarn test:e2e        # Playwright against the production build, served like GitHub Pages on :4173; first run: yarn playwright install chromium
yarn test:e2e e2e/smoke.spec.ts -g "deep links" --project=desktop   # single e2e test
```

CI (`.github/workflows/ci.yml`) has two jobs. `check` runs format:check, lint, typecheck, test, and build. `e2e` runs Playwright. Both must pass.

## Architecture notes

- Vite `base` is `/read-books/` (GitHub Pages project site). Router basename and asset URLs must respect it.
- The app calls Open Library straight from the browser. There is no backend.
- `src/api/openLibrary.ts` is the only code that talks to Open Library. It validates responses with the Zod schemas in `schemas.ts` and maps them to the app types in `types.ts`, so components never see raw API shapes. IDs are checked against `OL\d+W` / `OL\d+A` before any request; invalid IDs throw `ApiError` 404 (`isNotFound`). Author books come from `search.json?author=…&sort=editions`, not `/authors/{id}/works.json`.
- Merged records: work and author IDs can return a `/type/redirect` stub. `fetchRecord` follows these (up to 3 hops, only to valid `/works/…` or `/authors/…` paths) and treats `/type/delete` as 404. `getBook` and `getAuthor` return the canonical `id`. `useBook` and `useAuthor` seed the cache under that ID, and the page `<Navigate replace>`s to it, so always compare `data.id` with the route param.
- Descriptions and bios are user-edited Markdown, rendered with react-markdown (`components/Markdown.tsx`: no raw HTML, no images, external links open in a new tab). Never use `dangerouslySetInnerHTML` for API text.
- Routing: `src/routes.tsx` exports the route table (`Layout` with `errorElement: RouteError`; book and author pages are lazy chunks) and `basename`. `main.tsx` wraps `RouterProvider` in `LocaleProvider`.
- i18n: react-intl with flat catalogs in `src/i18n/{en,de}.json`. Message IDs are type-checked against `en.json` through the `FormatjsIntl` augmentation in `messages.ts`, and `de.json` must have the same keys (checked by `satisfies` and a test). Add every new string to both files. The chosen locale is stored in localStorage (`read-books:locale`).
- Page titles: render `<PageTitle title=… />`. React 19 hoists `<title>`, so react-helmet isn't needed.
- Server state uses TanStack Query (`src/lib/queryClient.ts`: 5-minute `staleTime`, no retry on 404). Search uses `useInfiniteQuery`, with `page` as the page param.
- Search page: `?q=` in the URL decides what gets searched. The input box is local state, debounced by 400 ms. The first search pushes a history entry and later edits replace it. When the URL changes from outside (back/forward, a suggestion link), the input resets to match. Queries shorter than 2 characters never run.
- Author names are optional in the API types (`AuthorRef.name?`). Components fall back to the translated `book.unknownAuthor`, so never hardcode English fallbacks in `src/api`.

## Testing

- Vitest config lives inside `vite.config.ts`. Setup (`src/test/setup.ts`) starts an MSW server with `onUnhandledRequest: 'error'`, so any request without a handler fails the test. Default handlers in `src/test/handlers.ts` serve trimmed real fixtures (The Hobbit `OL27482W`, Tolkien `OL26320A`). Override a route per test with `server.use(...)`.
- `renderApp(path)` in `src/test/render.tsx` renders the real route table in a memory router with the providers. Use it for page-level tests.
- E2E (`e2e/`): the `page` fixture in `e2e/fixtures.ts` serves Open Library from the same JSON fixtures and returns solid-colour SVGs for covers, so runs never hit the network. `checkA11y()` runs axe (WCAG 2.1 AA) and fails on any violation, including dark-mode contrast. It runs on desktop and on mobile (Pixel 7). Vitest only picks up `src/**/*.test.{ts,tsx}`, so `*.spec.ts` files belong to Playwright.

## Deployment

- `.github/workflows/deploy.yml` runs on push to `master`: lint, typecheck, test, build, then deploy `dist/` with `actions/deploy-pages`. Repo Settings → Pages → Source must be "GitHub Actions".
- The `spaFallback` plugin in `vite.config.ts` copies `dist/index.html` to `dist/404.html`, because Pages has no SPA routing. Deep links get HTTP 404 with the app shell, and the router renders the page.
- `scripts/serve-pages.mjs` (`yarn serve:pages`) mimics Pages: no fallback, `404.html` for unknown paths. Playwright runs against it, so e2e tests catch deep-link regressions that `vite preview` would hide.
- CI setup lives in the composite action `.github/actions/setup`. Node 25+ doesn't bundle Corepack, so it installs Corepack globally before `corepack enable`.

## Conventions

- Bundle: `vite.config.ts` splits `react`, `router`, and an explicit `vendor` list (the libraries the first page needs) into long-lived chunks. Keep lazy-only dependencies such as react-markdown out of `vendor`, or they load on first paint. Use `zod/mini` (functional API) rather than `zod`, because the classic API doesn't tree-shake.
- Dark mode: secondary text uses `text-slate-500 dark:text-slate-400`. Plain `slate-500` fails contrast on the dark background, and the e2e axe check will catch it.

- Prettier: single quotes, semicolons, 2 spaces, `printWidth` 120, trailing commas, `bracketSameLine`. LF line endings are enforced by `.gitattributes`.
- TypeScript is strict with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`, so use `import type` for type-only imports.
- TypeScript is pinned to `~6.0` because typescript-eslint doesn't support TS 7 yet.
- Yarn quarantines very recent package releases (error `YN0016`). Use a looser range (for example `^1`) so it resolves to an older version, rather than disabling the check.
