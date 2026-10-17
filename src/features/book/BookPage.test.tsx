import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { OPEN_LIBRARY_ORIGIN } from '../../api/openLibrary';
import editions from '../../test/fixtures/editions.json';
import { renderApp } from '../../test/render';
import { server } from '../../test/server';

const WORK_URL = `${OPEN_LIBRARY_ORIGIN}/works/:id.json`;

const serveWork = (work: Record<string, unknown>) => {
  server.use(http.get(WORK_URL, () => HttpResponse.json({ key: '/works/OL1W', title: 'Untitled', ...work })));
};

describe('BookPage', () => {
  it('shows the book details', async () => {
    renderApp('/book/OL27482W');

    expect(await screen.findByTestId('detail-skeleton')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: 'The Hobbit' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'J.R.R. Tolkien' })).toHaveAttribute('href', '/author/OL26320A');
    expect(screen.getByText(/^by/)).toHaveTextContent('by J.R.R. Tolkien');
    expect(screen.getByRole('img', { name: 'Rated 4.3 out of 5 from 501 ratings' })).toBeInTheDocument();
    expect(screen.getByText('First published January 1938')).toBeInTheDocument();
    expect(screen.getByText(/^The Hobbit is a tale of high adventure/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Cover of The Hobbit' })).toHaveAttribute(
      'src',
      'https://covers.openlibrary.org/b/id/14627509-L.jpg',
    );
    await waitFor(() => {
      expect(document.title).toBe('The Hobbit · Read Books');
    });
  });

  it('links subjects to a search', async () => {
    renderApp('/book/OL27482W');

    const subjects = within(
      (await screen.findByRole('heading', { name: 'Subjects' })).closest('section') ?? document.body,
    );
    expect(subjects.getByRole('link', { name: 'Fantasy' })).toHaveAttribute('href', '/?subject=Fantasy');
    expect(subjects.getByRole('link', { name: 'Battle of Five Armies' })).toHaveAttribute(
      'href',
      '/?subject=Battle+of+Five+Armies',
    );
  });

  it('shows the rating breakdown', async () => {
    renderApp('/book/OL27482W');

    const ratings = within(
      (await screen.findByRole('heading', { name: 'Ratings' })).closest('section') ?? document.body,
    );
    const rows = ratings.getAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual([
      '5 stars271 (54%)',
      '4 stars155 (31%)',
      '3 stars41 (8%)',
      '2 stars18 (4%)',
      '1 star16 (3%)',
    ]);
  });

  it('shows other books by the author, without the current one', async () => {
    renderApp('/book/OL27482W');

    const more = within(
      (await screen.findByRole('heading', { name: 'More by J.R.R. Tolkien' })).closest('section') ?? document.body,
    );
    expect(await more.findByRole('link', { name: /The Fellowship of the Ring/ })).toBeInTheDocument();
    expect(more.queryByRole('link', { name: /The Hobbit/ })).not.toBeInTheDocument();
    expect(more.getByRole('link', { name: 'All books' })).toHaveAttribute('href', '/author/OL26320A');
  });

  it('hides "More by" when the author has no other books', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/search.json`, () =>
        HttpResponse.json({
          numFound: 1,
          start: 0,
          docs: [{ key: '/works/OL27482W', title: 'The Hobbit', author_key: ['OL26320A'] }],
        }),
      ),
    );
    renderApp('/book/OL27482W');

    expect(await screen.findByRole('heading', { name: 'Editions' })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('book-grid-skeleton')).not.toBeInTheDocument();
    });
    expect(screen.queryByRole('heading', { name: /^More by/ })).not.toBeInTheDocument();
  });

  it('lists editions and loads more', async () => {
    const offsets: (string | null)[] = [];
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/editions.json`, ({ request }) => {
        const offset = new URL(request.url).searchParams.get('offset');
        offsets.push(offset);
        return HttpResponse.json(
          offset === '0'
            ? editions
            : {
                size: 482,
                entries: [{ key: '/books/OL9M', title: 'The Hobbit', languages: [{ key: '/languages/eng' }] }],
              },
        );
      }),
    );
    const user = userEvent.setup();
    renderApp('/book/OL27482W');

    const section = within(
      (await screen.findByRole('heading', { name: 'Editions' })).closest('section') ?? document.body,
    );
    const edition = await section.findByRole('link', { name: 'Hobit ali Tja in spet nazaj' });
    expect(edition).toHaveAttribute('href', 'https://openlibrary.org/books/OL62623719M');
    expect(section.getByText('482 editions')).toBeInTheDocument();
    expect(section.getByText('Mladinska knjiga · 2011 · 380 pages · paperback · Slovenian')).toBeInTheDocument();
    expect(section.getByText('ISBN 9788611171982')).toBeInTheDocument();

    await user.click(section.getByRole('button', { name: 'Load more' }));

    expect(await section.findByText('English')).toBeInTheDocument();
    expect(offsets).toEqual(['0', '10']);
  });

  it('shows edition language names in the UI language', async () => {
    localStorage.setItem('read-books:locale', 'de');
    renderApp('/book/OL27482W');

    expect(
      await screen.findByText(/Mladinska knjiga · 2011 · 380 Seiten · paperback · Slowenisch/),
    ).toBeInTheDocument();
  });

  it('lists the Open Library page and only http(s) external links', async () => {
    serveWork({
      links: [
        { title: 'Official site', url: 'https://example.com/book' },
        { title: 'Sneaky', url: 'javascript:alert(1)' },
      ],
    });
    renderApp('/book/OL1W');

    const links = within((await screen.findByRole('heading', { name: 'Links' })).closest('section') ?? document.body);
    expect(links.getByRole('link', { name: 'View on Open Library' })).toHaveAttribute(
      'href',
      'https://openlibrary.org/works/OL1W',
    );
    expect(links.getByRole('link', { name: 'Official site' })).toHaveAttribute('target', '_blank');
    expect(links.queryByText('Sneaky')).not.toBeInTheDocument();
  });

  it('renders Markdown descriptions safely', async () => {
    serveWork({
      description:
        'A **bold** start with [a link](https://example.com).\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))',
    });
    const { container } = renderApp('/book/OL1W');

    expect(await screen.findByText('bold')).toContainHTML('bold');
    expect(screen.getByRole('link', { name: 'a link' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByRole('link', { name: 'a link' })).toHaveAttribute('rel', 'noreferrer');
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('bad').closest('a')?.getAttribute('href') ?? '').not.toMatch(/javascript/i);
  });

  it('handles a work with no description, cover, subjects or authors', async () => {
    serveWork({});
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/ratings.json`, () =>
        HttpResponse.json({ summary: { average: null, count: 0 } }),
      ),
    );
    renderApp('/book/OL1W');

    expect(await screen.findByText('No description available.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Cover of Untitled' }).tagName).toBe('DIV');
    expect(screen.getByText('Unknown author').closest('p')).toHaveTextContent('by Unknown author');
    expect(screen.queryByRole('heading', { name: 'Subjects' })).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /^Rated/ })).not.toBeInTheDocument();
  });

  it('replaces the URL with the canonical id for merged works', async () => {
    server.use(
      http.get(WORK_URL, ({ params }) =>
        params.id === 'OL1W'
          ? HttpResponse.json({ key: '/works/OL1W', type: { key: '/type/redirect' }, location: '/works/OL27482W' })
          : HttpResponse.json({ key: '/works/OL27482W', title: 'The Hobbit' }),
      ),
    );
    const { router } = renderApp('/book/OL1W');

    expect(await screen.findByRole('heading', { level: 1, name: 'The Hobbit' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/book/OL27482W');
    expect(router.state.historyAction).toBe('REPLACE');
  });

  it('shows "Book not found" for a missing work', async () => {
    server.use(http.get(WORK_URL, () => new HttpResponse(null, { status: 404 })));
    renderApp('/book/OL999W');

    expect(await screen.findByRole('heading', { name: 'Book not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to search' })).toBeInTheDocument();
  });

  it('shows "Book not found" for a malformed id without calling the API', async () => {
    const calls: string[] = [];
    server.use(
      http.get(WORK_URL, ({ request }) => {
        calls.push(request.url);
        return HttpResponse.json({});
      }),
    );
    renderApp('/book/not-an-id');

    expect(await screen.findByRole('heading', { name: 'Book not found' })).toBeInTheDocument();
    expect(calls).toHaveLength(0);
  });

  it('shows a retryable error when loading fails', async () => {
    let calls = 0;
    server.use(
      http.get(WORK_URL, () => {
        calls += 1;
        return calls === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json({ key: '/works/OL1W', title: 'Recovered' });
      }),
    );
    const user = userEvent.setup();
    renderApp('/book/OL1W');

    await user.click(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Recovered' })).toBeInTheDocument();
  });
});
