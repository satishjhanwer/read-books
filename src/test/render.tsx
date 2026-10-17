import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { LocaleProvider } from '../i18n/LocaleProvider';
import { createQueryClient } from '../lib/queryClient';
import { routes } from '../routes';

/** Renders the full app (providers + real route table) at the given path, with a fresh query cache. */
export function renderApp(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  // Same cache settings as the app, minus retries so error states show immediately.
  const queryClient = createQueryClient();
  queryClient.setDefaultOptions({ queries: { ...queryClient.getDefaultOptions().queries, retry: false } });
  return {
    router,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <RouterProvider router={router} />
        </LocaleProvider>
      </QueryClientProvider>,
    ),
  };
}
