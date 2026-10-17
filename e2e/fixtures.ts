import AxeBuilder from '@axe-core/playwright';
import { test as base, expect, type Page } from '@playwright/test';

import author from '../src/test/fixtures/author.json' with { type: 'json' };
import authorBooks from '../src/test/fixtures/author-books.json' with { type: 'json' };
import authorSearch from '../src/test/fixtures/author-search.json' with { type: 'json' };
import ratings from '../src/test/fixtures/ratings.json' with { type: 'json' };
import search from '../src/test/fixtures/search.json' with { type: 'json' };
import work from '../src/test/fixtures/work.json' with { type: 'json' };

const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" fill="#6366f1"/></svg>`;

/** Serves Open Library from the unit-test fixtures so e2e runs are deterministic and offline. */
async function mockOpenLibrary(page: Page) {
  await page.route('https://openlibrary.org/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const json = (body: unknown) => route.fulfill({ json: body, headers: { 'access-control-allow-origin': '*' } });

    if (path === '/search.json') return json(url.searchParams.has('author') ? authorBooks : search);
    if (path === '/search/authors.json') return json(authorSearch);
    if (/^\/works\/OL\d+W\/ratings\.json$/.test(path)) return json(ratings);
    if (/^\/works\/OL\d+W\.json$/.test(path)) return json(work);
    if (/^\/authors\/OL\d+A\.json$/.test(path)) return json(author);
    return route.fulfill({ status: 404, headers: { 'access-control-allow-origin': '*' } });
  });
  await page.route('https://covers.openlibrary.org/**', (route) =>
    route.fulfill({ body: coverSvg, contentType: 'image/svg+xml' }),
  );
}

export const test = base.extend<{ checkA11y: () => Promise<void> }>({
  page: async ({ page }, use) => {
    await mockOpenLibrary(page);
    await use(page);
  },
  checkA11y: async ({ page }, use) => {
    await use(async () => {
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(
        violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`),
      ).toEqual([]);
    });
  },
});

export { expect };
