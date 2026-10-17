import { http, HttpResponse } from 'msw';

import authorSearch from '../test/fixtures/author-search.json';
import author from '../test/fixtures/author.json';
import ratings from '../test/fixtures/ratings.json';
import work from '../test/fixtures/work.json';
import { server } from '../test/server';
import {
  ApiError,
  EDITIONS_PAGE_SIZE,
  OPEN_LIBRARY_ORIGIN,
  PAGE_SIZE,
  authorPhotoUrl,
  authorPhotoUrlById,
  coverUrl,
  getAuthor,
  getAuthorBooks,
  getBook,
  getEditions,
  isNotFound,
  searchAuthors,
  searchBooks,
} from './openLibrary';

const captureSearchParams = () => {
  const captured: { params?: URLSearchParams } = {};
  server.use(
    http.get(`${OPEN_LIBRARY_ORIGIN}/search.json`, ({ request }) => {
      captured.params = new URL(request.url).searchParams;
      return HttpResponse.json({ numFound: 0, start: 0, docs: [] });
    }),
  );
  return captured;
};

describe('searchBooks', () => {
  it('maps search docs to book summaries', async () => {
    const result = await searchBooks({ query: 'the hobbit' });

    expect(result.total).toBe(461);
    expect(result.page).toBe(1);
    expect(result.hasMore).toBe(true);
    expect(result.books[0]).toEqual({
      id: 'OL27482W',
      title: 'The Hobbit',
      authors: [{ id: 'OL26320A', name: 'J.R.R. Tolkien' }],
      coverId: 14627509,
      firstPublishYear: 1937,
      editionCount: 482,
      rating: { average: 4.29, count: 500 },
    });
    expect(result.books[1]?.authors).toHaveLength(3);
  });

  it('sends the trimmed query, page, page size and field list', async () => {
    const captured = captureSearchParams();

    await searchBooks({ query: '  dune  ' }, 3);

    expect(captured.params?.get('q')).toBe('dune');
    expect(captured.params?.get('page')).toBe('3');
    expect(captured.params?.get('limit')).toBe(String(PAGE_SIZE));
    expect(captured.params?.get('fields')).toContain('cover_i');
  });

  it('handles docs with missing optional fields', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/search.json`, () =>
        HttpResponse.json({ numFound: 1, start: 0, docs: [{ key: '/works/OL1W', title: 'Bare', cover_i: -1 }] }),
      ),
    );

    const { books, hasMore } = await searchBooks({ query: 'bare' });

    expect(books[0]).toEqual({ id: 'OL1W', title: 'Bare', authors: [] });
    expect(hasMore).toBe(false);
  });

  it('passes the abort signal through to fetch', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(searchBooks({ query: 'x' }, 1, controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('throws ApiError on HTTP errors', async () => {
    server.use(http.get(`${OPEN_LIBRARY_ORIGIN}/search.json`, () => new HttpResponse(null, { status: 503 })));

    await expect(searchBooks({ query: 'x' })).rejects.toMatchObject({ name: 'ApiError', status: 503 });
  });

  it('throws ApiError when the response does not match the schema', async () => {
    server.use(http.get(`${OPEN_LIBRARY_ORIGIN}/search.json`, () => HttpResponse.json({ docs: 'nope' })));

    await expect(searchBooks({ query: 'x' })).rejects.toMatchObject({ status: 502 });
  });
});

describe('searchBooks filters', () => {
  it('sends subject as its own parameter and omits q when there is no query', async () => {
    const captured = captureSearchParams();

    await searchBooks({ subject: ' Fantasy ' });

    expect(captured.params?.get('subject')).toBe('Fantasy');
    expect(captured.params?.has('q')).toBe(false);
    expect(captured.params?.has('sort')).toBe(false);
  });

  it('sends the sort order', async () => {
    const captured = captureSearchParams();

    await searchBooks({ query: 'dune', sort: 'rating' });

    expect(captured.params?.get('q')).toBe('dune');
    expect(captured.params?.get('sort')).toBe('rating');
  });

  it('adds the year range to q, since Open Library rejects it as a parameter', async () => {
    const captured = captureSearchParams();

    await searchBooks({ query: 'dune', yearFrom: 1960, yearTo: 1970 });
    expect(captured.params?.get('q')).toBe('dune first_publish_year:[1960 TO 1970]');
    expect(captured.params?.has('first_publish_year')).toBe(false);

    await searchBooks({ query: 'dune', yearFrom: 2000 });
    expect(captured.params?.get('q')).toBe('dune first_publish_year:[2000 TO *]');

    await searchBooks({ subject: 'Fantasy', yearTo: 1950 });
    expect(captured.params?.get('q')).toBe('first_publish_year:[* TO 1950]');
  });
});

describe('searchAuthors', () => {
  it('maps author search results, most prolific first', async () => {
    const captured: { params?: URLSearchParams } = {};
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/search/authors.json`, ({ request }) => {
        captured.params = new URL(request.url).searchParams;
        return HttpResponse.json(authorSearch);
      }),
    );

    const result = await searchAuthors('  tolkien ', 2);

    expect(captured.params?.get('q')).toBe('tolkien');
    expect(captured.params?.get('sort')).toBe('work_count desc');
    expect(captured.params?.get('page')).toBe('2');
    expect(result.total).toBe(29);
    expect(result.hasMore).toBe(true);
    expect(result.authors[0]).toEqual({
      id: 'OL26320A',
      name: 'J.R.R. Tolkien',
      birthDate: '3 January 1892',
      deathDate: '2 September 1973',
      topWork: 'The Hobbit',
      workCount: 346,
    });
    expect(result.authors[2]).toEqual({ id: 'OL14431239A', name: 'F. Tolkien', topWork: 'Thug Life', workCount: 21 });
  });

  it('accepts /authors/ keys and drops malformed ones', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/search/authors.json`, () =>
        HttpResponse.json({ numFound: 2, start: 0, docs: [{ key: '/authors/OL1A', name: 'A' }, { key: 'nope' }] }),
      ),
    );

    const { authors } = await searchAuthors('a');

    expect(authors).toEqual([{ id: 'OL1A', name: 'A' }]);
  });
});

describe('getAuthorBooks', () => {
  it('searches by author sorted by edition count', async () => {
    const captured = captureSearchParams();

    await getAuthorBooks('OL26320A');

    expect(captured.params?.get('author')).toBe('OL26320A');
    expect(captured.params?.get('sort')).toBe('editions');
    expect(captured.params?.has('q')).toBe(false);
  });

  it('returns the author fixture books', async () => {
    const { books } = await getAuthorBooks('OL26320A');

    expect(books.map((book) => book.title)).toEqual(['The Hobbit', 'The Fellowship of the Ring', 'The Two Towers']);
  });
});

describe('getBook', () => {
  it('combines work, ratings and author names', async () => {
    const book = await getBook('OL27482W');

    expect(book).toMatchObject({
      id: 'OL27482W',
      title: 'The Hobbit',
      authors: [{ id: 'OL26320A', name: 'J.R.R. Tolkien' }],
      coverId: 14627509,
      firstPublishDate: 'January 1938',
      openLibraryUrl: 'https://openlibrary.org/works/OL27482W',
    });
    expect(book.rating?.count).toBe(501);
    expect(book.rating?.average).toBeCloseTo(4.29, 2);
    expect(book.ratingCounts).toEqual([16, 18, 41, 155, 271]);
    expect(book.description).toMatch(/^The Hobbit is a tale of high adventure/);
    expect(book.description).not.toContain('\r');
    expect(book.subjects).toContain('Fantasy');
    expect(book.links[0]?.url).toMatch(/^https?:\/\//);
  });

  it('accepts { type, value } descriptions', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id.json`, () =>
        HttpResponse.json({ key: '/works/OL2W', title: 'T', description: { type: '/type/text', value: ' Hi ' } }),
      ),
    );

    const book = await getBook('OL2W');

    expect(book.description).toBe('Hi');
    expect(book.authors).toEqual([]);
    expect(book.subjects).toEqual([]);
  });

  it('still returns the book when ratings and author lookups fail', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/ratings.json`, () => new HttpResponse(null, { status: 500 })),
      http.get(`${OPEN_LIBRARY_ORIGIN}/authors/:id.json`, () => new HttpResponse(null, { status: 500 })),
    );

    const book = await getBook('OL27482W');

    expect(book.rating).toBeUndefined();
    expect(book.authors).toEqual([{ id: 'OL26320A', name: undefined }]);
  });

  it('omits the rating when nobody has rated the work', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/ratings.json`, () =>
        HttpResponse.json({ summary: { average: null, count: 0 }, counts: {} }),
      ),
    );

    const book = await getBook('OL27482W');
    expect(book.rating).toBeUndefined();
    expect(book.ratingCounts).toBeUndefined();
  });

  it('fills missing star counts with zero', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/ratings.json`, () =>
        HttpResponse.json({ summary: { average: 5, count: 2 }, counts: { '5': 2 } }),
      ),
    );

    expect((await getBook('OL27482W')).ratingCounts).toEqual([0, 0, 0, 0, 2]);
  });

  it('reports a missing work as not found', async () => {
    server.use(http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id.json`, () => new HttpResponse(null, { status: 404 })));

    const error: unknown = await getBook('OL999W').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(isNotFound(error)).toBe(true);
  });

  it('rejects malformed ids without making a request', async () => {
    await expect(getBook('../authors/OL1A')).rejects.toSatisfy(isNotFound);
    await expect(getBook('OL1A')).rejects.toSatisfy(isNotFound);
  });
});

describe('merged and deleted records', () => {
  const redirect = (location: string) => HttpResponse.json({ key: 'x', type: { key: '/type/redirect' }, location });

  it('follows work redirects and refetches ratings for the canonical work', async () => {
    const ratingRequests: string[] = [];
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id.json`, ({ params }) =>
        params.id === 'OL1W' ? redirect('/works/OL27482W') : HttpResponse.json(work),
      ),
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/ratings.json`, ({ params }) => {
        ratingRequests.push(String(params.id));
        return HttpResponse.json(
          params.id === 'OL27482W' ? ratings : { summary: { average: null, count: 0 }, counts: {} },
        );
      }),
    );

    const book = await getBook('OL1W');

    expect(book.id).toBe('OL27482W');
    expect(book.title).toBe('The Hobbit');
    expect(book.openLibraryUrl).toBe('https://openlibrary.org/works/OL27482W');
    expect(book.rating?.count).toBe(501);
    expect(ratingRequests.sort()).toEqual(['OL1W', 'OL27482W']);
  });

  it('follows author redirects and reports the canonical id', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/authors/:id.json`, ({ params }) =>
        params.id === 'OL9A' ? redirect('/authors/OL26320A') : HttpResponse.json(author),
      ),
    );

    expect(await getAuthor('OL9A')).toMatchObject({ id: 'OL26320A', name: 'J.R.R. Tolkien' });
  });

  it('treats deleted records as not found', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id.json`, () =>
        HttpResponse.json({ key: '/works/OL1W', type: { key: '/type/delete' } }),
      ),
    );

    await expect(getBook('OL1W')).rejects.toSatisfy(isNotFound);
  });

  it('gives up on redirect loops', async () => {
    server.use(http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id.json`, () => redirect('/works/OL1W')));

    await expect(getBook('OL1W')).rejects.toMatchObject({ status: 502 });
  });

  it('refuses redirects to unexpected locations', async () => {
    server.use(http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id.json`, () => redirect('/../../evil')));

    await expect(getBook('OL1W')).rejects.toMatchObject({ status: 502 });
  });
});

describe('getEditions', () => {
  it('maps editions', async () => {
    const page = await getEditions('OL27482W');

    expect(page).toMatchObject({ total: 482, page: 1, hasMore: true });
    expect(page.editions[0]).toEqual({
      id: 'OL62623719M',
      title: 'Hobit ali Tja in spet nazaj',
      subtitle: undefined,
      publishers: ['Mladinska knjiga'],
      publishDate: '2011',
      pages: 380,
      format: 'paperback',
      isbn: '9788611171982',
      languages: ['slv'],
      coverId: 15261276,
      openLibraryUrl: 'https://openlibrary.org/books/OL62623719M',
    });
    // Falls back to ISBN-10 when there is no ISBN-13.
    expect(page.editions[3]?.isbn).toBe('9027400431');
  });

  it('pages with limit and offset', async () => {
    let params: URLSearchParams | undefined;
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/editions.json`, ({ request }) => {
        params = new URL(request.url).searchParams;
        return HttpResponse.json({ size: 21, entries: [{ key: '/books/OL1M' }] });
      }),
    );

    const page = await getEditions('OL27482W', 3);

    expect(params?.get('limit')).toBe(String(EDITIONS_PAGE_SIZE));
    expect(params?.get('offset')).toBe(String(2 * EDITIONS_PAGE_SIZE));
    expect(page.hasMore).toBe(false);
    expect(page.editions[0]).toMatchObject({ id: 'OL1M', publishers: [], languages: [] });
  });

  it('drops malformed edition keys and rejects malformed work ids', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/editions.json`, () =>
        HttpResponse.json({ size: 2, entries: [{ key: '/books/OL1M' }, { key: '/books/../x' }] }),
      ),
    );

    expect((await getEditions('OL27482W')).editions.map((edition) => edition.id)).toEqual(['OL1M']);
    await expect(getEditions('OL1A')).rejects.toSatisfy(isNotFound);
  });
});

describe('getAuthor', () => {
  it('maps author details', async () => {
    const author = await getAuthor('OL26320A');

    expect(author).toMatchObject({
      id: 'OL26320A',
      name: 'J.R.R. Tolkien',
      birthDate: '3 January 1892',
      deathDate: '2 September 1973',
      photoId: 6155606,
      openLibraryUrl: 'https://openlibrary.org/authors/OL26320A',
    });
    expect(author.bio).toMatch(/^John Ronald Reuel Tolkien/);
  });

  it('falls back to personal_name and skips placeholder photo ids', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_ORIGIN}/authors/:id.json`, () =>
        HttpResponse.json({ key: '/authors/OL5A', personal_name: 'Someone', photos: [-1, 42] }),
      ),
    );

    const author = await getAuthor('OL5A');

    expect(author.name).toBe('Someone');
    expect(author.photoId).toBe(42);
    expect(author.bio).toBeUndefined();
    expect(author.links).toEqual([]);
  });

  it('rejects malformed ids', async () => {
    await expect(getAuthor('OL1W')).rejects.toSatisfy(isNotFound);
  });
});

describe('image urls', () => {
  it('builds cover and author photo urls', () => {
    expect(authorPhotoUrlById('OL26320A')).toBe('https://covers.openlibrary.org/a/olid/OL26320A-M.jpg?default=false');
    expect(coverUrl(14627509)).toBe('https://covers.openlibrary.org/b/id/14627509-M.jpg');
    expect(coverUrl(1, 'L')).toBe('https://covers.openlibrary.org/b/id/1-L.jpg');
    expect(authorPhotoUrl(6155606, 'S')).toBe('https://covers.openlibrary.org/a/id/6155606-S.jpg');
  });
});
