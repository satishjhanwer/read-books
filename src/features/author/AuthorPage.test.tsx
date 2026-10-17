import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { OPEN_LIBRARY_ORIGIN } from '../../api/openLibrary';
import { renderApp } from '../../test/render';
import { server } from '../../test/server';

const AUTHOR_URL = `${OPEN_LIBRARY_ORIGIN}/authors/:id.json`;
const SEARCH_URL = `${OPEN_LIBRARY_ORIGIN}/search.json`;

const booksSection = async () =>
  within((await screen.findByRole('heading', { name: /^Books by/ })).closest('section') ?? document.body);

describe('AuthorPage', () => {
  it('shows the author details', async () => {
    renderApp('/author/OL26320A');

    expect(await screen.findByTestId('detail-skeleton')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: 'J.R.R. Tolkien' })).toBeInTheDocument();

    expect(screen.getByText('Born 3 January 1892')).toBeInTheDocument();
    expect(screen.getByText('Died 2 September 1973')).toBeInTheDocument();
    expect(screen.getByText(/^John Ronald Reuel Tolkien/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Photo of J.R.R. Tolkien' })).toHaveAttribute(
      'src',
      'https://covers.openlibrary.org/a/id/6155606-L.jpg',
    );
    expect(screen.getByRole('link', { name: 'View on Open Library' })).toHaveAttribute(
      'href',
      'https://openlibrary.org/authors/OL26320A',
    );
    await waitFor(() => {
      expect(document.title).toBe('J.R.R. Tolkien · Read Books');
    });
  });

  it("lists the author's books with a total", async () => {
    renderApp('/author/OL26320A');

    const books = await booksSection();
    expect(books.getByRole('heading', { name: 'Books by J.R.R. Tolkien' })).toBeInTheDocument();
    expect(await books.findByText('350 books')).toBeInTheDocument();
    expect(books.getAllByRole('article')).toHaveLength(3);
    expect(books.getByRole('link', { name: 'The Fellowship of the Ring' })).toHaveAttribute('href', '/book/OL27513W');
    expect(books.getByRole('button', { name: 'Load more' })).toBeInTheDocument();
  });

  it('says so when no books are listed', async () => {
    server.use(http.get(SEARCH_URL, () => HttpResponse.json({ numFound: 0, start: 0, docs: [] })));
    renderApp('/author/OL26320A');

    const books = await booksSection();
    expect(await books.findByText('No books are listed for this author.')).toBeInTheDocument();
  });

  it('keeps the author visible when only the book list fails', async () => {
    server.use(http.get(SEARCH_URL, () => new HttpResponse(null, { status: 503 })));
    renderApp('/author/OL26320A');

    expect(await screen.findByRole('heading', { level: 1, name: 'J.R.R. Tolkien' })).toBeInTheDocument();
    const books = await booksSection();
    expect(await books.findByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('falls back when name, dates, bio and photo are missing', async () => {
    server.use(http.get(AUTHOR_URL, () => HttpResponse.json({ key: '/authors/OL5A' })));
    renderApp('/author/OL5A');

    expect(await screen.findByRole('heading', { level: 1, name: 'Unknown author' })).toBeInTheDocument();
    expect(screen.getByText('No biography available.')).toBeInTheDocument();
    expect(screen.queryByText(/^Born/)).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Photo of Unknown author' }).tagName).toBe('DIV');
  });

  it('replaces the URL with the canonical id for merged authors', async () => {
    server.use(
      http.get(AUTHOR_URL, ({ params }) =>
        params.id === 'OL9A'
          ? HttpResponse.json({ key: '/authors/OL9A', type: { key: '/type/redirect' }, location: '/authors/OL26320A' })
          : HttpResponse.json({ key: '/authors/OL26320A', name: 'J.R.R. Tolkien' }),
      ),
    );
    const { router } = renderApp('/author/OL9A');

    expect(await screen.findByRole('heading', { level: 1, name: 'J.R.R. Tolkien' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/author/OL26320A');
  });

  it('shows "Author not found" for a missing author', async () => {
    server.use(http.get(AUTHOR_URL, () => new HttpResponse(null, { status: 404 })));
    renderApp('/author/OL999A');

    expect(await screen.findByRole('heading', { name: 'Author not found' })).toBeInTheDocument();
  });

  it('shows "Author not found" for a malformed id', async () => {
    renderApp('/author/OL27482W');

    expect(await screen.findByRole('heading', { name: 'Author not found' })).toBeInTheDocument();
  });
});
