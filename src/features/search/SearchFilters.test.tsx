import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { OPEN_LIBRARY_ORIGIN } from '../../api/openLibrary';
import authorSearch from '../../test/fixtures/author-search.json';
import search from '../../test/fixtures/search.json';
import { renderApp } from '../../test/render';
import { server } from '../../test/server';

/** Records the params of every book search request, answering with the Hobbit fixture. */
function recordBookSearches() {
  const requests: URLSearchParams[] = [];
  server.use(
    http.get(`${OPEN_LIBRARY_ORIGIN}/search.json`, ({ request }) => {
      requests.push(new URL(request.url).searchParams);
      return HttpResponse.json(search);
    }),
  );
  return requests;
}

const lastRequest = (requests: URLSearchParams[]) => requests[requests.length - 1];

describe('search tabs', () => {
  it('switches to author search, keeping the query', async () => {
    const authorRequests: URLSearchParams[] = [];
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/search/authors.json`, ({ request }) => {
        authorRequests.push(new URL(request.url).searchParams);
        return HttpResponse.json(authorSearch);
      }),
    );
    const user = userEvent.setup();
    const { router } = renderApp('/?q=tolkien');

    const tabs = within(await screen.findByRole('navigation', { name: 'Search for' }));
    expect(tabs.getByRole('link', { name: 'Books' })).toHaveAttribute('aria-current', 'page');
    await user.click(tabs.getByRole('link', { name: 'Authors' }));

    expect(router.state.location.search).toBe('?q=tolkien&type=authors');
    expect(await screen.findByText('29 authors for “tolkien”')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search authors by name' })).toHaveValue('tolkien');
    expect(authorRequests.map((params) => params.get('q'))).toEqual(['tolkien']);

    const [first] = screen.getAllByRole('article');
    if (!first) throw new Error('no author results');
    const card = within(first);
    expect(card.getByRole('link', { name: 'J.R.R. Tolkien' })).toHaveAttribute('href', '/author/OL26320A');
    expect(card.getByText('3 January 1892 – 2 September 1973')).toBeInTheDocument();
    expect(card.getByText('Best known for The Hobbit')).toBeInTheDocument();
    expect(card.getByText('346 works')).toBeInTheDocument();
    expect(card.getByRole('img', { name: 'Photo of J.R.R. Tolkien' })).toHaveAttribute(
      'src',
      'https://covers.openlibrary.org/a/olid/OL26320A-M.jpg?default=false',
    );
    // Book-only filters aren't shown for authors.
    expect(screen.queryByRole('combobox', { name: 'Sort by' })).not.toBeInTheDocument();
  });

  it('shows an empty state for authors', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/search/authors.json`, () =>
        HttpResponse.json({ numFound: 0, start: 0, docs: [] }),
      ),
    );
    renderApp('/?q=zzqq&type=authors');

    expect(await screen.findByRole('heading', { name: 'No authors found' })).toBeInTheDocument();
  });

  it('drops book filters when switching to authors', async () => {
    recordBookSearches();
    const user = userEvent.setup();
    const { router } = renderApp('/?q=dune&sort=rating&from=1960');

    await user.click(await screen.findByRole('link', { name: 'Authors' }));

    expect(router.state.location.search).toBe('?q=dune&type=authors');
  });

  it('suggests authors on the empty authors tab', async () => {
    renderApp('/?type=authors');

    expect(await screen.findByRole('link', { name: 'Ursula K. Le Guin' })).toHaveAttribute(
      'href',
      '/?q=Ursula+K.+Le+Guin&type=authors',
    );
  });
});

describe('subject search', () => {
  it('searches a subject without a query, and the chip removes it', async () => {
    const requests = recordBookSearches();
    const user = userEvent.setup();
    const { router } = renderApp('/?subject=Fantasy');

    expect(await screen.findByText('461 books about “Fantasy”')).toBeInTheDocument();
    expect(lastRequest(requests)?.get('subject')).toBe('Fantasy');
    expect(lastRequest(requests)?.has('q')).toBe(false);
    expect(screen.getByText('Subject: Fantasy')).toBeInTheDocument();
    await waitFor(() => {
      expect(document.title).toBe('Fantasy · Read Books');
    });

    await user.click(screen.getByRole('button', { name: 'Remove subject filter “Fantasy”' }));

    expect(router.state.location.search).toBe('');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dune' })).toBeInTheDocument();
  });

  it('combines a subject with a query', async () => {
    const requests = recordBookSearches();
    renderApp('/?q=dragons&subject=Fantasy');

    expect(await screen.findByText('461 results for “dragons”')).toBeInTheDocument();
    expect(lastRequest(requests)?.get('q')).toBe('dragons');
    expect(lastRequest(requests)?.get('subject')).toBe('Fantasy');
  });
});

describe('sort and year filters', () => {
  it('sorts results and keeps the choice in the URL', async () => {
    const requests = recordBookSearches();
    const user = userEvent.setup();
    const { router } = renderApp('/?q=dune');
    await screen.findAllByRole('article');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'rating');

    expect(router.state.location.search).toBe('?q=dune&sort=rating');
    await waitFor(() => {
      expect(lastRequest(requests)?.get('sort')).toBe('rating');
    });

    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'relevance');
    expect(router.state.location.search).toBe('?q=dune');
  });

  it('filters by first-published year once a full year is typed', async () => {
    const requests = recordBookSearches();
    const user = userEvent.setup();
    const { router } = renderApp('/?q=dune');
    await screen.findAllByRole('article');
    const from = screen.getByRole('textbox', { name: 'Published from (year)' });

    await user.type(from, '19');
    expect(router.state.location.search).toBe('?q=dune');

    await user.type(from, '6x0');
    expect(from).toHaveValue('1960');
    expect(router.state.location.search).toBe('?q=dune&from=1960');
    await user.type(screen.getByRole('textbox', { name: 'Published until (year)' }), '1970');
    expect(router.state.location.search).toBe('?q=dune&from=1960&to=1970');
    await waitFor(() => {
      expect(lastRequest(requests)?.get('q')).toBe('dune first_publish_year:[1960 TO 1970]');
    });

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(router.state.location.search).toBe('?q=dune');
    expect(from).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });

  it('commits short years on blur', async () => {
    recordBookSearches();
    const user = userEvent.setup();
    const { router } = renderApp('/?q=beowulf');
    await screen.findAllByRole('article');

    await user.type(screen.getByRole('textbox', { name: 'Published until (year)' }), '800');
    expect(router.state.location.search).toBe('?q=beowulf');
    await user.tab();

    expect(router.state.location.search).toBe('?q=beowulf&to=800');
  });

  it('restores filters from history', async () => {
    recordBookSearches();
    const user = userEvent.setup();
    const { router } = renderApp('/?q=dune');
    await screen.findAllByRole('article');

    await user.type(screen.getByRole('textbox', { name: 'Published from (year)' }), '1965');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'old');
    expect(router.state.location.search).toBe('?q=dune&sort=old&from=1965');

    await act(() => router.navigate(-1));
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveValue('relevance');
    await act(() => router.navigate(-1));
    expect(screen.getByRole('textbox', { name: 'Published from (year)' })).toHaveValue('');
  });
});
