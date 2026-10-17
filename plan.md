# Roadmap

Future work for Read Books. v3 (Vite + React + TypeScript on the Open Library API) is live at
<https://satishjhanwer.dev/read-books/>. It was merged in #44 and is deployed by `deploy.yml` on every push to `master`.
The original rewrite plan is in git history, and the current architecture is in [CLAUDE.md](CLAUDE.md).

## 1. Housekeeping

- [ ] **Repo About section:** the description still reads "React Application using Good Reads API" and the website field is empty. Set the description to something like "Search books and authors from the Open Library catalog" and the website to <https://satishjhanwer.dev/read-books/>.
- [ ] **Delete merged and stale branches:** `revamp/v3` (merged in #44) and `feat/update-to-open-library-api` (a January 2025 attempt that targets the removed v2 code).

## 2. Maintenance

- [ ] **Add `.github/dependabot.yml`:** Dependabot security updates already run, but there are no regular version updates. Add weekly updates for `npm` (it handles Yarn 4) and `github-actions`. Group minor and patch updates to keep the PR count low. Yarn's age quarantine (`YN0016`) may block brand-new versions; that's expected.
- [ ] **TypeScript 7:** it's pinned to `~6.0` because typescript-eslint supports only `<6.1`. Upgrade both once typescript-eslint supports TS 7.
- [ ] **MSW 3:** the tests use MSW 2.x. Check the migration guide before upgrading. The handlers are in `src/test/handlers.ts` and in the tests that call `server.use`.
- [ ] **Coverage gate:** `yarn test:coverage` exists but CI doesn't enforce it. Add thresholds in `vite.config.ts` (`test.coverage.thresholds`) and run it in the `check` job.

## 3. Feature backlog

Roughly in priority order. Each item lists the Open Library endpoint and where it would live in the code.

### Reading list

Let users save books to "Want to read", "Reading" or "Read", stored in localStorage on their device.

- Add a `useReadingList` hook in `src/features/reading-list/` with a versioned storage key such as `read-books:list:v1`, keeping each book's `BookSummary`.
- Add a toggle button on `BookCard` and on the book page, a `/list` route, and a header link.
- Add an export/import as JSON, since localStorage is per browser.

### Better search

- **Subject links:** use `subject:"…"` queries or `/subjects/{slug}.json` instead of plain-text search.
- **Author search:** add an "Authors" tab backed by `/search/authors.json?q=`.
- **Sort and filters:** sort by `sort=new` / `sort=rating`, and filter by `first_publish_year`. Keep all of it in the URL, as `?q=` already is.

### Richer book page

- **Ratings breakdown:** the `counts` field in `ratings.json` gives a 1–5 star histogram.
- **Editions:** list them from `/works/{id}/editions.json` (ISBN, publisher, pages, language), with "Load more".
- **More by this author:** reuse `getAuthorBooks` and exclude the current work.

### Google Books fallback

- Use it for books Open Library describes poorly (missing description or cover): `https://www.googleapis.com/books/v1/volumes?q=isbn:…`. It works without a key at low volume.
- Keep `src/api` as the boundary: add a provider module and merge its data in `getBook`, so components don't change.

### PWA / offline

- Add a web manifest and a service worker (for example `vite-plugin-pwa`). Cache the app shell and recently viewed covers and API responses, together with a persisted TanStack Query cache.

### More languages

- Add a locale by creating `src/i18n/<code>.json` and listing the code in `LOCALES` and `LOCALE_NAMES` in `messages.ts`. The type check and the key-parity test make sure the catalog is complete.

## 4. Known limitations

- **Deep links return HTTP 404 on GitHub Pages.** This is confirmed on the live site: `/read-books/book/OL471940W` returns 404 with the app shell. The page renders correctly, but crawlers and link-preview bots see a 404, and every page shares the same `<meta>` tags.
  - Fix options: move to a host with rewrite rules (Netlify, or Cloudflare Pages, which suits the custom domain), or prerender popular pages.
  - Moving to a host that runs a server would also make Next.js, or React Router framework mode with SSR, worth reconsidering for SEO.
- **No identifying User-Agent.** Browsers can't set one, and Open Library asks heavy users to identify themselves. Current usage (debounced search, 5-minute cache) is light. If traffic grows, contact Open Library or add a small proxy that sets the header.
- **Open Library data quality varies:** missing covers or descriptions, odd subjects, and duplicate works. The app handles missing data and merged records but doesn't try to correct the data.
