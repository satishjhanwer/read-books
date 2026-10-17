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

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('passes accessibility checks on every page', async ({ page, checkA11y }) => {
    for (const path of ['?q=the+hobbit', 'book/OL27482W', 'author/OL26320A']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByTestId(/skeleton/)).toHaveCount(0);
      await checkA11y();
    }
  });
});
