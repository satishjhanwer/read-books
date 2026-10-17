# Read Books

Search books and authors from the [Open Library](https://openlibrary.org) catalog.

**Live:** <https://satishjhanwer.dev/read-books/>

- Search by title, author or keyword, with shareable `?q=` URLs and "Load more" pagination
- Book pages with cover, description, ratings, subjects and links
- Author pages with photo, bio, dates and a list of their books
- English and German, with light and dark mode following your system setting
- No backend and no API key: the browser talks to Open Library directly

## Tech stack

Vite · React 19 · TypeScript · React Router · TanStack Query · Zod · react-intl · Tailwind CSS ·
Vitest + Testing Library + MSW · Playwright + axe · GitHub Actions · GitHub Pages

## Getting started

Requires Node 24+ (see `.nvmrc`) and Corepack, which provides the pinned Yarn version.

```sh
npm install --global corepack   # Node 25+ no longer bundles it
corepack enable
yarn install
yarn dev                        # http://localhost:5173/read-books/
```

## Scripts

| Command            | What it does                                                          |
| ------------------ | --------------------------------------------------------------------- |
| `yarn dev`         | Dev server with hot reload                                            |
| `yarn build`       | Type-check and build to `dist/`                                       |
| `yarn preview`     | Serve the production build                                            |
| `yarn serve:pages` | Serve `dist/` the way GitHub Pages does (no SPA fallback)             |
| `yarn test`        | Unit and component tests (Vitest)                                     |
| `yarn test:e2e`    | End-to-end and accessibility tests (Playwright; builds the app first) |
| `yarn lint`        | ESLint                                                                |
| `yarn typecheck`   | TypeScript                                                            |
| `yarn format`      | Prettier                                                              |

First-time e2e setup: `yarn playwright install chromium`.

## Project structure

```text
src/
  api/          Open Library client: fetch, Zod validation, mapping to app types
  components/   Shared UI (layout, book cards, covers, ratings, error states)
  features/     search/, book/, author/ pages and their data hooks
  i18n/         en/de message catalogs and locale provider
  lib/          Query client and small helpers
  test/         MSW handlers, fixtures and render helpers
e2e/            Playwright tests (Open Library mocked from the same fixtures)
scripts/        Local GitHub Pages simulator used by e2e
```

All Open Library access goes through `src/api/openLibrary.ts`. It validates every response, follows merged-record
redirects, and returns typed app models, so components never handle raw API data.

## Testing

- **Unit/component:** Vitest in jsdom. Network calls are served by MSW from trimmed real Open Library responses in
  `src/test/fixtures`, and any request without a handler fails the test.
- **End-to-end:** Playwright runs on desktop and mobile Chrome against the production build, served like GitHub Pages.
  Every page is checked with axe for WCAG 2.1 AA in light and dark mode.

## Deployment

Each push to `master` runs `.github/workflows/deploy.yml`: lint, typecheck, tests, build, then publish `dist/` to
GitHub Pages. The build also writes `404.html` as a copy of `index.html`, so deep links like `/read-books/book/OL27482W`
work even though Pages has no SPA routing.

One-time setup: **Settings → Pages → Source: GitHub Actions**.

## History

v3 is a rewrite. v2 was a react-boilerplate app (Redux, redux-saga, webpack, Express) built on the Goodreads API, which
was shut down in 2020. It's still in the git history.

## License

[MIT](LICENSE). Book data and covers come from [Open Library](https://openlibrary.org/developers/licensing).
