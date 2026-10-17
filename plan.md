# Roadmap

Future work for Read Books. The v3 rewrite (Vite + React + TypeScript on the Open Library API) is complete. Its plan is
in git history (`plan.md` before this rewrite) and the resulting architecture is in [CLAUDE.md](CLAUDE.md).

## 1. Go live

- [ ] Push `revamp/v3` and open a PR into `master`. This is the first real run of the CI workflow and of the shared setup action, so check that both the `check` and `e2e` jobs pass.
- [ ] Repo Settings → Pages → Source: **GitHub Actions**. Pages needs a public repo on a free plan.
- [ ] Merge, then confirm that `deploy.yml` publishes to <https://satishjhanwer.github.io/read-books/>. Test a deep link, such as `/read-books/book/OL27482W`, on the live site.
- [ ] Update the repo's About section (description and website URL). The old Heroku link is dead.

## 2. Maintenance

- [ ] **Clean up stale branches.** Close the open dependabot PRs and delete `feat/update-to-open-library-api` (January 2025). All of them target the removed v2 code.
- [ ] **Add `.github/dependabot.yml`** with weekly updates for `npm` (it handles Yarn 4) and `github-actions`. Group minor and patch updates to keep the PR count low. Yarn's age quarantine (`YN0016`) may block brand-new versions; that's expected.
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

- **Deep links return HTTP 404 on GitHub Pages.** The page renders correctly from `404.html`, but crawlers and link-preview bots see a 404, and every page shares the same `<meta>` tags.
  - Fix options: move to a host with rewrite rules (Netlify or Cloudflare Pages), or prerender popular pages.
  - Moving to a host that runs a server would also make Next.js, or React Router framework mode with SSR, worth reconsidering for SEO.
- **No identifying User-Agent.** Browsers can't set one, and Open Library asks heavy users to identify themselves. Current usage (debounced search, 5-minute cache) is light. If traffic grows, contact Open Library or add a small proxy that sets the header.
- **Open Library data quality varies:** missing covers or descriptions, odd subjects, and duplicate works. The app handles missing data and merged records but doesn't try to correct the data.
