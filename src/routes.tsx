import type { RouteObject } from 'react-router';

import { Layout } from './components/Layout';
import NotFoundPage from './components/NotFoundPage';
import { RouteError } from './components/RouteError';
import SearchPage from './features/search/SearchPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <SearchPage /> },
      // Detail pages are split into their own chunks.
      {
        path: 'book/:workId',
        lazy: async () => ({ Component: (await import('./features/book/BookPage')).default }),
      },
      {
        path: 'author/:authorId',
        lazy: async () => ({ Component: (await import('./features/author/AuthorPage')).default }),
      },
      {
        path: 'list',
        lazy: async () => ({ Component: (await import('./features/reading-list/ReadingListPage')).default }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

/** Vite's BASE_URL ('/read-books/') without the trailing slash, as the router expects. */
export const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
