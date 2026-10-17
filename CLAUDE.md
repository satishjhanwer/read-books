# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Read Books v3 is a single-page app for searching books and authors in the [Open Library](https://openlibrary.org) catalog. It's built with Vite, React 19, and TypeScript, deployed to GitHub Pages at <https://satishjhanwer.github.io/read-books/>. There is no backend: the browser calls Open Library directly. v3 is a rewrite of a react-boilerplate/Goodreads app that now exists only in git history. [plan.md](plan.md) is the roadmap: the go-live checklist, maintenance tasks, a prioritised feature backlog, and known limitations. Check it before starting new work, and tick off or remove items as they ship.

## Commands

Node from `.nvmrc`, Yarn 4 through Corepack. Node 25+ doesn't bundle Corepack, so the first time run `npm install --global corepack && corepack enable`.

```sh
yarn dev                     # dev server at http://localhost:5173/read-books/
yarn build                   # tsc -b && vite build -> dist/ (also writes dist/404.html)
yarn lint                    # ESLint, typescript-eslint strictTypeChecked
yarn typecheck               # tsc -b
yarn format                  # Prettier; CI runs format:check
yarn test                    # Vitest (jsdom)
yarn test src/features/search/SearchPage.test.tsx -t "debounces"   # one file / one test
yarn test:e2e                # Playwright; builds, then serves dist/ like GitHub Pages on :4173
yarn test:e2e e2e/smoke.spec.ts -g "deep links" --project=desktop  # one e2e test
yarn serve:pages             # serve an existing dist/ the way GitHub Pages does
```

Run `yarn playwright install chromium` once before the first e2e run.

CI (`.github/workflows/ci.yml`) has two jobs that must both pass: `check` (format:check, lint, typecheck, test, build) and `e2e` (Playwright).

## Code layout

```text
src/api/         Open Library client (openLibrary.ts), Zod schemas, app-level types
src/features/    search/, book/, author/: one page component plus its TanStack Query hooks each
src/components/  shared UI: Layout, BookCard/BookGrid, Cover, RatingStars, Markdown, LoadMore, error/404 pages
src/i18n/        en.json / de.json catalogs, LocaleProvider, typed message ids
src/lib/         queryClient, text helpers, uniqueBooks
src/test/        MSW server/handlers, JSON fixtures, renderApp helper
e2e/             Playwright specs + fixtures (mocked Open Library, axe checks)
scripts/         serve-pages.mjs (GitHub Pages simulator for e2e)
```

`main.tsx` nests the providers as `QueryClientProvider` → `LocaleProvider` → `RouterProvider`. `src/test/render.tsx` mirrors that order.

## Architecture

- **API boundary:** `src/api/openLibrary.ts` is the only module that calls Open Library.
  - It validates every response with the schemas in `schemas.ts` and maps it to the types in `types.ts`, so components never see raw API shapes.
  - Route IDs are checked against `OL\d+W` / `OL\d+A` before any request. Invalid IDs throw `ApiError` with status 404 (check with `isNotFound`).
  - An author's books come from `search.json?author=…&sort=editions`, not `/authors/{id}/works.json`, which lists obscure items first and has no covers.
- **Merged records:** Open Library merges duplicate works and authors and leaves a `/type/redirect` stub at the old ID.
  - `fetchRecord` follows these, up to 3 hops and only to valid `/works/…` or `/authors/…` paths, and treats `/type/delete` as 404.
  - `getBook` and `getAuthor` return the canonical `id`. `useBook` and `useAuthor` seed the query cache under that ID, and the page then does `<Navigate replace>` to it. So always compare `data.id` with the route param.
  - `getBook` re-fetches ratings for the canonical work, because the stub's ratings are empty.
- **Best-effort parts:** in `getBook`, a failed ratings or author-name request doesn't fail the book. An author's name may be undefined (`AuthorRef.name?`). The UI shows the translated `book.unknownAuthor`, so never put English fallback text in `src/api`.
- **Server state:** TanStack Query, configured in `src/lib/queryClient.ts`: 5-minute `staleTime`, no refetch on window focus, no retry on 404. Search and author books use `useInfiniteQuery` with a 1-based `page` param, flattened through `uniqueBooks` because Open Library pages can overlap.
- **Search page:** `?q=` decides what gets searched, and the text box is local state.
  - Typing is debounced by 400 ms. Enter commits immediately. Queries shorter than 2 characters never run.
  - The first search pushes a history entry; later edits replace it.
  - When the URL changes from outside (back/forward, a suggestion or subject link), the input resets to match. This uses a render-time state adjustment, not an effect.
- **Routing:** `src/routes.tsx` exports `routes` and `basename`. `Layout` is the root, with `errorElement: RouteError`. The book and author pages are `lazy` routes, which keeps react-markdown out of the first load. Vite `base` is `/read-books/`, and the router basename comes from `import.meta.env.BASE_URL`.
- **i18n:** react-intl with flat catalogs.
  - Message IDs are type-checked against `en.json` through the `FormatjsIntl` augmentation in `src/i18n/messages.ts`. `de.json` must have exactly the same keys, enforced by `satisfies` and a test, so add every new string to both files.
  - The locale is stored in localStorage (`read-books:locale`) and mirrored to `<html lang>`.
- **Untrusted text:** descriptions, bios, and links are user-edited on Open Library.
  - Render text through `components/Markdown.tsx` (react-markdown: no raw HTML, no images, safe URLs). Never use `dangerouslySetInnerHTML`.
  - `ExternalLinks` shows only `http(s)` URLs.
- **Page titles:** render `<PageTitle title=… />`. React 19 hoists `<title>` into the head.

## Testing

- **Unit:** Vitest config lives in `vite.config.ts` and only collects `src/**/*.test.{ts,tsx}`, so `*.spec.ts` files are Playwright's.
  - `src/test/setup.ts` starts MSW with `onUnhandledRequest: 'error'`, so a request without a handler fails the test.
  - Default handlers serve trimmed real fixtures: The Hobbit `OL27482W` and Tolkien `OL26320A`, for any ID. Override a route per test with `server.use(...)`.
  - The setup also stubs `window.scrollTo` and raises the async timeout to 3 s, because lazy route chunks are slow to transform on a cold run.
- **Page tests:** `renderApp(path)` renders the real route table in a memory router, with the app's own query client (retries off).
- **E2E:**
  - The `page` fixture in `e2e/fixtures.ts` serves Open Library from the same JSON fixtures and returns solid-colour SVGs for covers, so runs never hit the network.
  - `checkA11y()` runs axe (WCAG 2.1 AA) and fails on any violation.
  - Specs run on desktop and on mobile (Pixel 7), plus a dark-mode pass.
  - They run against `scripts/serve-pages.mjs`, so deep links return HTTP 404 with the app shell, exactly as on GitHub Pages.
- **Live check:** to test against the real API, write a temporary test that calls `server.use(http.all('*', () => passthrough()))`. Don't commit it.

## Deployment

- `.github/workflows/deploy.yml` runs on every push to `master`: lint, typecheck, test, build, then `actions/deploy-pages`. One-time setup: repo Settings → Pages → Source: "GitHub Actions".
- GitHub Pages has no SPA routing. The `spaFallback` plugin in `vite.config.ts` copies `dist/index.html` to `dist/404.html`, so unknown paths load the app and the router renders them.
- All workflow jobs share the composite action `.github/actions/setup`: Node, Corepack, Yarn cache, and `yarn install --immutable`.

## Conventions

- Prettier: single quotes, semicolons, 2 spaces, `printWidth` 120, trailing commas, `bracketSameLine`. `.gitattributes` enforces LF line endings.
- TypeScript is strict, with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`, so use `import type` for type-only imports. It's pinned to `~6.0` because typescript-eslint doesn't support TS 7 yet.
- Use `zod/mini` (the functional API: `z.optional(z.string())`) rather than `zod`. The classic chained API doesn't tree-shake.
- Bundle: `vite.config.ts` splits `react`, `router`, and an explicit `vendor` list (the libraries the first page needs) into long-lived chunks. Add a library to `vendor` only if the first page uses it. Lazy-only dependencies such as react-markdown would otherwise load on first paint.
- Dark mode: secondary text uses `text-slate-500 dark:text-slate-400`. Plain `slate-500` fails contrast on the dark background, and the e2e axe check catches it.
- ESLint turns off `react-hooks/rules-of-hooks` for `e2e/`, because Playwright fixtures call `use()`.
- Yarn quarantines very recent package releases (error `YN0016`). Use a looser range, such as `^1`, so Yarn picks an older version; don't disable the check.
