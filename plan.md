# Roadmap

Future work for Read Books. v3 (Vite + React + TypeScript on the Open Library API) is live at
<https://satishjhanwer.dev/read-books/>. It was merged in #44 and is deployed by `deploy.yml` on every push to `master`.
The original rewrite plan is in git history, and the current architecture is in [CLAUDE.md](CLAUDE.md).
Shipped since launch: the reading list (`/list`); better search (subject filters, author search, sort and year filters);
a richer book page (ratings breakdown, editions, more by the author); PWA/offline support; a light/dark theme switch;
and Spanish and French.

## 1. Maintenance

- [ ] **Add `.github/dependabot.yml`:** Dependabot security updates already run, but there are no regular version updates. Add weekly updates for `npm` (it handles Yarn 4) and `github-actions`. Group minor and patch updates to keep the PR count low. Yarn's age quarantine (`YN0016`) may block brand-new versions; that's expected.
- [ ] **TypeScript 7:** it's pinned to `~6.0` because typescript-eslint supports only `<6.1`. Upgrade both once typescript-eslint supports TS 7.
- [ ] **MSW 3:** the tests use MSW 2.x. Check the migration guide before upgrading. The handlers are in `src/test/handlers.ts` and in the tests that call `server.use`.
- [ ] **Coverage gate:** `yarn test:coverage` exists but CI doesn't enforce it. Add thresholds in `vite.config.ts` (`test.coverage.thresholds`) and run it in the `check` job.

## 2. Feature backlog

Roughly in priority order. Each item lists the Open Library endpoint and where it would live in the code.

### Google Books fallback

- Use it for books Open Library describes poorly (missing description or cover): `https://www.googleapis.com/books/v1/volumes?q=isbn:…`. It works without a key at low volume.
- Keep `src/api` as the boundary: add a provider module and merge its data in `getBook`, so components don't change.

### Offline polish

- Show a "new version available" prompt instead of updating silently (`registerType: 'prompt'` plus `virtual:pwa-register/react`).
- Offline, a page that was never cached shows a skeleton (the query is paused) or a load error (when the app started offline, since TanStack's `onlineManager` assumes "online"). Show a dedicated "not available offline" state instead.

### More languages

- English, German, Spanish and French ship today. To add one, see the i18n notes in CLAUDE.md. Native-speaker review of the es/fr catalogs would help.
- Load catalogs on demand (dynamic `import()`) once there are enough of them to matter for the first load.
- Edition formats (`paperback`, `ebook`) come from Open Library in English. Translate the common ones.

## 3. Known limitations

- **Deep links return HTTP 404 on GitHub Pages.** This is confirmed on the live site: `/read-books/book/OL471940W` returns 404 with the app shell. The page renders correctly, but crawlers and link-preview bots see a 404, and every page shares the same `<meta>` tags.
  - Fix options: move to a host with rewrite rules (Netlify, or Cloudflare Pages, which suits the custom domain), or prerender popular pages.
  - Moving to a host that runs a server would also make Next.js, or React Router framework mode with SSR, worth reconsidering for SEO.
- **No identifying User-Agent.** Browsers can't set one, and Open Library asks heavy users to identify themselves. Current usage (debounced search, 5-minute cache) is light. If traffic grows, contact Open Library or add a small proxy that sets the header.
- **Open Library data quality varies:** missing covers or descriptions, odd subjects, and duplicate works. The app handles missing data and merged records but doesn't try to correct the data.
