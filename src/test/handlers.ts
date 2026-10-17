import { http, HttpResponse } from 'msw';

import { OPEN_LIBRARY_ORIGIN } from '../api/openLibrary';
import author from './fixtures/author.json';
import authorBooks from './fixtures/author-books.json';
import authorSearch from './fixtures/author-search.json';
import ratings from './fixtures/ratings.json';
import search from './fixtures/search.json';
import work from './fixtures/work.json';

// Default happy-path handlers backed by trimmed real responses for
// "The Hobbit" (OL27482W) and J.R.R. Tolkien (OL26320A).
// Tests override individual routes with `server.use(...)`.
export const handlers = [
  http.get(`${OPEN_LIBRARY_ORIGIN}/search/authors.json`, () => HttpResponse.json(authorSearch)),
  http.get(`${OPEN_LIBRARY_ORIGIN}/search.json`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(url.searchParams.has('author') ? authorBooks : search);
  }),
  http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id.json`, () => HttpResponse.json(work)),
  http.get(`${OPEN_LIBRARY_ORIGIN}/works/:id/ratings.json`, () => HttpResponse.json(ratings)),
  http.get(`${OPEN_LIBRARY_ORIGIN}/authors/:id.json`, () => HttpResponse.json(author)),
];
