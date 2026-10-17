import { expect, test } from './fixtures';

test.use({ serviceWorkers: 'allow' });

test('is installable', async ({ page }) => {
  await page.goto('');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBe('/read-books/manifest.webmanifest');

  const manifest = (await (await page.request.get(href ?? '')).json()) as Record<string, unknown>;
  expect(manifest).toMatchObject({ name: 'Read Books', start_url: '/read-books/', display: 'standalone' });
});

test('recently viewed pages work offline', async ({ page, context }) => {
  await page.goto('');
  // Wait until the service worker controls the page, so later navigations go through it.
  // (A string, because the e2e tsconfig has no DOM types.)
  await page.waitForFunction('navigator.serviceWorker.controller !== null');

  await page.goto('book/OL27482W');
  await expect(page.getByRole('heading', { level: 1, name: 'The Hobbit' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Hobit ali Tja in spet nazaj' })).toBeVisible();
  // The query cache is saved to localStorage, throttled to once a second.
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('read-books:query-cache') ?? ''))
    .toContain('Hobit ali Tja in spet nazaj');

  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole('heading', { level: 1, name: 'The Hobbit' })).toBeVisible();
  await expect(page.getByText(/You’re offline/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Hobit ali Tja in spet nazaj' })).toBeVisible();
});
