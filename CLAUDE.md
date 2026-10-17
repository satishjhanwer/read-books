# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

The project is being rebuilt from an old react-boilerplate/Goodreads app into a Vite + React + TypeScript SPA backed by the Open Library API, hosted on GitHub Pages. [plan.md](plan.md) holds the full plan, target stack, folder structure, and phase list. Work happens on the `revamp/v3` branch, one commit per phase. The old app is only in git history (before the `revamp/v3` branch). README.md is still the old one and gets rewritten in the final phase.

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
```

CI (`.github/workflows/ci.yml`) runs format:check, lint, typecheck, test, and build. All of them must pass.

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

## Conventions

- Prettier: single quotes, semicolons, 2 spaces, `printWidth` 120, trailing commas, `bracketSameLine`. LF line endings are enforced by `.gitattributes`.
- TypeScript is strict with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`, so use `import type` for type-only imports.
- TypeScript is pinned to `~6.0` because typescript-eslint doesn't support TS 7 yet.
- Yarn quarantines very recent package releases (error `YN0016`). Use a looser range (for example `^1`) so it resolves to an older version, rather than disabling the check.
