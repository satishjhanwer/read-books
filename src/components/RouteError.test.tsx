import { render, screen } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { LocaleProvider } from '../i18n/LocaleProvider';
import { RouteError } from './RouteError';

function renderThrowing(error: unknown) {
  const router = createMemoryRouter([
    {
      path: '/',
      errorElement: <RouteError />,
      loader: () => {
        throw error;
      },
      element: null,
    },
  ]);
  render(
    <LocaleProvider>
      <RouterProvider router={router} />
    </LocaleProvider>,
  );
}

describe('RouteError', () => {
  it('shows a generic error page inside the layout', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    renderThrowing(new Error('boom'));

    expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read Books' })).toBeInTheDocument();
  });

  it('shows the not-found page for 404 responses', async () => {
    renderThrowing(new Response(null, { status: 404 }));

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
