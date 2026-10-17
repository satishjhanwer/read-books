# Revamp Plan: read-books

## Why

- The Goodreads API was shut down in 2020, so all three backend routes (`/api/search`, `/api/book/:id`, `/api/author/:id`) are dead.
- The stack is react-boilerplate from around 2019: webpack 5 configured by hand, Babel, redux + redux-saga + reselect, an Express dev server, reactstrap/Bootstrap 4 CSS checked into the repo, and Travis CI.
- A half-finished move to Redux Toolkit left the app broken (missing imports, sagas never started, `match.params` on React Router v6). Patching it in place costs more than rebuilding.

## Goals

1. Feature parity: search books, book details page, author details page, 404 page.
2. A free, keyless book API that works from the browser.
3. A current, small stack with fast dev builds, typed code, and real tests.
4. Deploy as a static site with no server to run.

Out of scope for v1: user accounts, a server-side database, SSR/SEO.

## API choice: Open Library (primary)

[Open Library](https://openlibrary.org/developers/api) is free, needs no API key, and allows CORS, so the browser can call it directly and the Express proxy is no longer needed.

| Need                | Endpoint                                                                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search books        | `GET https://openlibrary.org/search.json?q=<term>&page=<n>&fields=key,title,author_name,author_key,cover_i,first_publish_year,ratings_average,ratings_count,edition_count` |
| Book (work) details | `GET https://openlibrary.org/works/{OLxxxW}.json`                                                                                                                          |
| Book ratings        | `GET https://openlibrary.org/works/{OLxxxW}/ratings.json`                                                                                                                  |
| Author details      | `GET https://openlibrary.org/authors/{OLxxxA}.json`                                                                                                                        |
| Author's books      | `GET https://openlibrary.org/search.json?author=<OLxxxA>&sort=editions` (the `/authors/{id}/works.json` endpoint lists obscure items first and has no covers)              |
| Covers              | `https://covers.openlibrary.org/b/id/{cover_i}-{S\|M\|L}.jpg`, author photos at `/a/id/{photo_id}-M.jpg`                                                                   |

Open Library quirks the code must handle:

- `description` and `bio` come back either as a string or as `{ type, value }`. Normalize both to a string.
- Many fields are optional: no cover, no birth date, no ratings. The UI must handle missing data.
- Text can contain Markdown or HTML. Render it as sanitized Markdown, never with `dangerouslySetInnerHTML` on raw input.
- Rate limits are generous but not unlimited. Debounce search and cache responses (TanStack Query handles caching).

**Optional fallback: Google Books API** (`https://www.googleapis.com/books/v1/volumes?q=`). It works without a key at low volume and has better descriptions and ratings. Hide each provider behind a small `BookProvider` interface so the app can switch or combine them later. This is not part of v1.

## Target stack

| Concern         | Old                                                         | New                                                                                                       |
| --------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Build/dev       | webpack 5 + Babel + Express HMR                             | **Vite**                                                                                                  |
| Language        | JavaScript + PropTypes                                      | **TypeScript** (strict)                                                                                   |
| UI              | React 19, reactstrap, Bootstrap 4 CSS checked into the repo | React 19, **Tailwind CSS v4**, icons from **lucide-react**                                                |
| Routing         | react-router-dom v6 + redux-first-history                   | **React Router v7** (library/SPA mode)                                                                    |
| Server state    | redux + redux-saga + reselect + redux-persist               | **TanStack Query** (caching, loading and error states)                                                    |
| Client state    | redux                                                       | Search term kept in the URL (`?q=`); `localStorage` only for small preferences                            |
| API validation  | none                                                        | **Zod** schemas for API responses                                                                         |
| i18n            | react-intl (en, de)                                         | Keep **react-intl**, move existing en/de strings across                                                   |
| Testing         | Jest + snapshots                                            | **Vitest** + Testing Library + **MSW** for mocking the API; **Playwright** for one or two smoke e2e tests |
| Lint/format     | ESLint 9 (FlatCompat) + Prettier                            | ESLint 9 flat config with typescript-eslint + Prettier (keep the current `.prettierrc` settings)          |
| Package manager | Yarn 1                                                      | **Yarn 4** (via Corepack, `nodeLinker: node-modules`)                                                     |
| CI              | Travis (broken)                                             | **GitHub Actions**: lint, typecheck, test, build                                                          |
| Hosting         | Heroku (dead)                                               | **GitHub Pages**, deployed by a GitHub Actions workflow on push to `master`                               |
| Node            | 22/26                                                       | Current LTS, pinned in `.nvmrc` and `engines`                                                             |

Install the latest stable version of each package at implementation time and pin them through the lockfile.

### GitHub Pages specifics

- The site is served from a subpath (`https://satishjhanwer.github.io/read-books/`), so set Vite `base: '/read-books/'` and give the router a matching `basename`.
- Pages has no SPA fallback, so a deep link like `/read-books/book/OL45804W` would return a 404. Fix: the build copies `index.html` to `404.html`, so Pages serves the app for any path and React Router takes over. (The alternative, a hash router with `/#/book/...`, gives uglier URLs.)
- Deployment uses the official `actions/upload-pages-artifact` + `actions/deploy-pages` workflow. One-time setup: in repo Settings → Pages, set Source to "GitHub Actions".

### Why Vite, not Next.js

Next.js would work, but on GitHub Pages it can only run as a static export (`output: 'export'`). That rules out a server, API routes and on-demand rendering. Book and author pages are dynamic (`/book/[id]`), and a static export would need every Open Library ID known at build time, which isn't possible. Those pages would end up fetching data in the browser anyway, so Next.js would add complexity without its benefits (SSR, SEO). Reconsider only if the app moves to a host that runs a server (such as Vercel) and SEO for book pages becomes a goal.

## Target structure

```text
src/
  main.tsx               # providers: QueryClient, IntlProvider, RouterProvider
  routes.tsx             # /, /book/:workId, /author/:authorId, *
  api/
    openLibrary.ts       # fetch wrappers + Zod schemas + normalizers
    types.ts             # Book, BookDetails, Author (app-level models)
  features/
    search/              # SearchPage, SearchBar, BookCard, useBookSearch
    book/                # BookPage, useBook
    author/              # AuthorPage, useAuthor
  components/            # Layout, Header, Cover, Rating, Spinner, ErrorState, EmptyState
  i18n/                  # en.json, de.json, locale provider
  lib/                   # text normalization, markdown sanitizing
  test/                  # MSW handlers, fixtures, setup
public/                  # favicon, manifest
```

Pages talk to the API only through `src/api` and turn raw responses into app-level types there, so UI components never see Open Library's response shapes.

## Features (v1)

- **Search page**: debounced input bound to `?q=`, results grid (cover, title, authors, year, rating), "Load more" pagination, loading skeletons, and empty and error states.
- **Book page**: cover, title, description, subjects, first publish year, ratings, author links, and a link to the Open Library page.
- **Author page**: photo, name, birth and death dates, bio, and a grid of the author's works linking to book pages.
- **404 page**, document titles per page (React 19 `<title>` support replaces react-helmet), a language switcher (en/de), and dark mode that follows the system setting.

Possible v1.1 extras (not committed): a "My reading list" saved in localStorage, the Google Books fallback, PWA/offline support.

## Implementation phases

Work on a branch (`revamp/v3`) and replace the app in place, so git history is kept.

1. **Scaffold**: remove the old app, server, webpack, Babel, Jest and Travis files. Create a Vite React-TS app with Yarn 4, ESLint, Prettier, Tailwind, Vitest, and the GitHub Actions CI workflow. Lint, typecheck, test and build all pass on an empty shell.
2. **API layer**: `openLibrary.ts` with Zod schemas, normalizers and unit tests against recorded fixtures (MSW).
3. **Layout & routing**: header, layout, routes, 404 page, i18n provider with the migrated en/de messages.
4. **Search**: search page with URL state, TanStack Query, pagination, and loading, empty and error states, plus tests.
5. **Book & author pages**: details pages with tests.
6. **Polish**: accessibility check, responsive layout, dark mode, cover image fallbacks, Playwright smoke test.
7. **Docs & deploy**: GitHub Pages deploy workflow, `base` path, `404.html` fallback; rewrite README and CLAUDE.md; bump `version` to 3.0.0.

Each phase ends with lint, typecheck, test and build all passing, and is committed separately.

## Decisions

- Hosting: **GitHub Pages**.
- Package manager: **Yarn** (upgrading from Yarn 1 to Yarn 4).
- Google Books fallback: **later** (v1.1).
- Framework: **Vite** (Next.js not needed; see above).
- i18n (en/de): **keep** (default; still open to dropping it).
