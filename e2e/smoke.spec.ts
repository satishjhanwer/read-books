import { expect, test } from './fixtures';

test('search, open a book, then its author, and come back', async ({ page, checkA11y }) => {
  await page.goto('');
  await expect(page.getByRole('heading', { level: 1, name: 'Search books' })).toBeVisible();
  await checkA11y();

  await page.getByRole('searchbox').fill('the hobbit');
  await expect(page.getByText('461 results for “the hobbit”')).toBeVisible();
  await expect(page).toHaveURL(/\?q=the\+hobbit$/);
  await checkA11y();

  await page.getByRole('link', { name: 'The Hobbit' }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'The Hobbit' })).toBeVisible();
  await expect(page).toHaveURL(/\/read-books\/book\/OL27482W$/);
  await expect(page).toHaveTitle('The Hobbit · Read Books');
  await checkA11y();

  await page.getByRole('main').getByRole('link', { name: 'J.R.R. Tolkien' }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'J.R.R. Tolkien' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Books by J.R.R. Tolkien' })).toBeVisible();
  await checkA11y();

  await page.goBack();
  await page.goBack();
  await expect(page.getByRole('searchbox')).toHaveValue('the hobbit');
  await expect(page.getByText('461 results for “the hobbit”')).toBeVisible();
});

test('deep links load directly', async ({ page }) => {
  // GitHub Pages answers unknown paths with 404.html (a copy of the app shell) and status 404;
  // the router then renders the right page.
  const response = await page.goto('book/OL27482W');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'The Hobbit' })).toBeVisible();

  await page.goto('author/OL26320A');
  await expect(page.getByRole('heading', { level: 1, name: 'J.R.R. Tolkien' })).toBeVisible();
});

test('unknown paths show the 404 page', async ({ page, checkA11y }) => {
  await page.goto('no/such/page');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await checkA11y();

  await page.getByRole('link', { name: 'Back to search' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Search books' })).toBeVisible();
});

test('the language choice survives a reload', async ({ page }) => {
  await page.goto('');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('de');
  await expect(page.getByRole('heading', { level: 1, name: 'Bücher suchen' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Bücher suchen' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('save books to the reading list and manage them', async ({ page, checkA11y }) => {
  await page.goto('?q=the+hobbit');
  const firstCard = page.getByRole('article').first();
  await firstCard.getByRole('button', { name: 'Save “The Hobbit” to your reading list' }).click();
  await expect(page.getByRole('link', { name: /^My list/ })).toContainText('1');

  await page.goto('book/OL27482W');
  const shelf = page.getByRole('combobox', { name: 'Reading list' });
  await expect(shelf).toHaveValue('want');
  await shelf.selectOption('reading');

  await page.getByRole('link', { name: /^My list/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'My reading list' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Reading 1' })).toBeVisible();
  await checkA11y();

  // The list survives a reload (localStorage).
  await page.reload();
  await expect(page.getByRole('heading', { level: 3, name: 'The Hobbit' })).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export' }).click();
  expect((await download).suggestedFilename()).toMatch(/^read-books-list-\d{4}-\d{2}-\d{2}\.json$/);
});

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('passes accessibility checks on every page', async ({ page, checkA11y }) => {
    // One saved book, so saved bookmarks and the populated list page are checked too.
    await page.addInitScript(() => {
      const now = new Date().toISOString();
      const book = { id: 'OL27482W', title: 'The Hobbit', authors: [{ id: 'OL26320A', name: 'J.R.R. Tolkien' }] };
      localStorage.setItem(
        'read-books:list:v1',
        JSON.stringify([{ book, shelf: 'reading', addedAt: now, updatedAt: now }]),
      );
    });
    for (const path of ['?q=the+hobbit', 'book/OL27482W', 'author/OL26320A', 'list']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByTestId(/skeleton/)).toHaveCount(0);
      await checkA11y();
    }
  });
});
