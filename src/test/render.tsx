import { render } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { LocaleProvider } from '../i18n/LocaleProvider';
import { routes } from '../routes';

/** Renders the full app (providers + real route table) at the given path. */
export function renderApp(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return {
    router,
    ...render(
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>,
    ),
  };
}
