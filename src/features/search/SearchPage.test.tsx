import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { OPEN_LIBRARY_ORIGIN } from '../../api/openLibrary';
import { renderApp } from '../../test/render';
import { server } from '../../test/server';

const SEARCH_URL = `${OPEN_LIBRARY_ORIGIN}/search.json`;

const doc = (n: number) => ({ key: `/works/OL${String(n)}W`, title: `Book ${String(n)}` });

/** Serves `total` numbered results, `pageSize` per page, and records each request's params. */
function paginatedSearch(total: number, pageSize = 2) {
  const requests: URLSearchParams[] = [];
  server.use(
    http.get(SEARCH_URL, ({ request }) => {
      const params = new URL(request.url).searchParams;
      requests.push(params);
      const page = Number(params.get('page'));
      const start = (page - 1) * pageSize;
      const docs = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, i) => doc(start + i + 1));
      return HttpResponse.json({ numFound: total, start, docs });
    }),
  );
  return requests;
}

const searchBox = () => screen.getByRole('searchbox', { name: 'Search by title, author or keyword' });

describe('SearchPage', () => {
  it('shows suggestions and makes no request without a query', async () => {
    const requests = paginatedSearch(0);
    renderApp('/');

    expect(await screen.findByRole('link', { name: 'Dune' })).toHaveAttribute('href', '/?q=Dune');
    expect(screen.queryByTestId('book-grid-skeleton')).not.toBeInTheDocument();
    expect(requests).toHaveLength(0);
  });

  it('loads results for ?q= with covers, authors and ratings', async () => {
    renderApp('/?q=the%20hobbit');

    expect(searchBox()).toHaveValue('the hobbit');
    expect(screen.getByTestId('book-grid-skeleton')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '461 results for “the hobbit”' })).toBeInTheDocument();

    const [first] = screen.getAllByRole('article');
    if (!first) throw new Error('no results');
    const card = within(first);
    expect(card.getByRole('link', { name: 'The Hobbit' })).toHaveAttribute('href', '/book/OL27482W');
    expect(card.getByRole('link', { name: 'J.R.R. Tolkien' })).toHaveAttribute('href', '/author/OL26320A');
    expect(card.getByRole('img', { name: 'Rated 4.3 out of 5 from 500 ratings' })).toBeInTheDocument();
    expect(card.getByText('1937')).toBeInTheDocument();
    await waitFor(() => {
      expect(document.title).toBe('the hobbit · Read Books');
    });
  });

  it('truncates long author lists', async () => {
    renderApp('/?q=the%20hobbit');

    const second = (await screen.findAllByRole('article'))[1];
    if (!second) throw new Error('missing second result');
    expect(second).toHaveTextContent('Charles Dixon, Sean Deming +1');
  });

  it('debounces typing into a single URL update and request', async () => {
    const requests = paginatedSearch(1);
    const user = userEvent.setup();
    const { router } = renderApp('/');

    await user.type(await screen.findByRole('searchbox'), 'dune');

    expect(await screen.findByText('Book 1')).toBeInTheDocument();
    expect(router.state.location.search).toBe('?q=dune');
    expect(requests.map((params) => params.get('q'))).toEqual(['dune']);
  });

  it('searches immediately on submit', async () => {
    const requests = paginatedSearch(1);
    const user = userEvent.setup();
    const { router } = renderApp('/');

    await user.type(await screen.findByRole('searchbox'), 'emma{Enter}');

    expect(router.state.location.search).toBe('?q=emma');
    await screen.findByText('Book 1');
    expect(requests).toHaveLength(1);
  });

  it('asks for more characters instead of searching one-letter queries', async () => {
    const requests = paginatedSearch(1);
    const user = userEvent.setup();
    const { router } = renderApp('/');

    await user.type(await screen.findByRole('searchbox'), 'a{Enter}');

    expect(screen.getByText('Type at least 2 characters.')).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(router.state.location.search).toBe('');
    expect(requests).toHaveLength(0);
  });

  it('clears the search', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/?q=the%20hobbit');
    await screen.findAllByRole('article');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(searchBox()).toHaveValue('');
    expect(router.state.location.search).toBe('');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dune' })).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    paginatedSearch(0);
    renderApp('/?q=zzqqxx');

    expect(await screen.findByRole('heading', { name: 'No books found' })).toBeInTheDocument();
    expect(
      screen.getByText('Nothing matched “zzqqxx”. Check the spelling or try a different search.'),
    ).toBeInTheDocument();
  });

  it('shows an error with a working retry', async () => {
    let calls = 0;
    server.use(
      http.get(SEARCH_URL, () => {
        calls += 1;
        return calls === 1
          ? new HttpResponse(null, { status: 503 })
          : HttpResponse.json({ numFound: 1, start: 0, docs: [doc(7)] });
      }),
    );
    const user = userEvent.setup();
    renderApp('/?q=dune');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Couldn’t load results');
    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Book 7')).toBeInTheDocument();
  });

  it('loads more pages until the end', async () => {
    const requests = paginatedSearch(5);
    const user = userEvent.setup();
    renderApp('/?q=dune');

    expect(await screen.findAllByRole('article')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Load more' }));
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await user.click(screen.getByRole('button', { name: 'Load more' }));

    expect(await screen.findByText('You’ve reached the end of the results.')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(requests.map((params) => params.get('page'))).toEqual(['1', '2', '3']);
  });

  it('syncs the input when the URL changes from outside', async () => {
    paginatedSearch(1);
    const { router } = renderApp('/?q=dune');
    await screen.findByText('Book 1');

    await act(() => router.navigate('/?q=emma'));
    expect(searchBox()).toHaveValue('emma');

    await act(() => router.navigate(-1));
    expect(searchBox()).toHaveValue('dune');
  });

  it('caches results when returning to a previous search', async () => {
    const requests = paginatedSearch(1);
    const { router } = renderApp('/?q=dune');
    await screen.findByText('Book 1');

    await act(() => router.navigate('/book/OL1W'));
    await act(() => router.navigate(-1));

    expect(await screen.findByText('Book 1')).toBeInTheDocument();
    expect(requests).toHaveLength(1);
  });
});
