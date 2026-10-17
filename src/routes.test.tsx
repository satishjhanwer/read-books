import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LOCALE_STORAGE_KEY } from './i18n/LocaleProvider';
import { renderApp } from './test/render';

describe('app shell', () => {
  it('renders the layout and search page at /', async () => {
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Search books' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read Books' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Open Library' })).toHaveAttribute('href', 'https://openlibrary.org');
    await waitFor(() => {
      expect(document.title).toBe('Read Books');
    });
  });

  it('lazy-loads the book and author routes', async () => {
    renderApp('/book/OL27482W');
    expect(await screen.findByRole('heading', { name: 'Book OL27482W' })).toBeInTheDocument();
    await waitFor(() => {
      expect(document.title).toBe('Book · Read Books');
    });
  });

  it('renders the author route', async () => {
    renderApp('/author/OL26320A');
    expect(await screen.findByRole('heading', { name: 'Author OL26320A' })).toBeInTheDocument();
  });

  it('shows the 404 page for unknown paths', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/no/such/page');

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Back to search' }));

    expect(router.state.location.pathname).toBe('/');
    expect(await screen.findByRole('heading', { name: 'Search books' })).toBeInTheDocument();
  });
});

describe('language switching', () => {
  it('switches to German, persists the choice and sets <html lang>', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.selectOptions(await screen.findByRole('combobox', { name: 'Language' }), 'de');

    expect(screen.getByRole('heading', { name: 'Bücher suchen' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Sprache' })).toHaveValue('de');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('de');
    expect(document.documentElement.lang).toBe('de');
  });

  it('starts in the stored locale', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'de');
    renderApp('/missing');

    expect(await screen.findByRole('heading', { name: 'Seite nicht gefunden' })).toBeInTheDocument();
  });

  it('ignores invalid stored values', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'xx');
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Search books' })).toBeInTheDocument();
  });
});
