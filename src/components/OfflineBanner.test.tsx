import { act, screen } from '@testing-library/react';

import { renderApp } from '../test/render';

function setOnline(online: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online);
  window.dispatchEvent(new Event(online ? 'online' : 'offline'));
}

describe('OfflineBanner', () => {
  it('appears while offline and disappears when back online', async () => {
    renderApp('/');
    expect(await screen.findByRole('heading', { name: 'Search books' })).toBeInTheDocument();
    expect(screen.queryByText(/You’re offline/)).not.toBeInTheDocument();

    act(() => {
      setOnline(false);
    });
    expect(screen.getByText(/You’re offline/)).toBeInTheDocument();

    act(() => {
      setOnline(true);
    });
    expect(screen.queryByText(/You’re offline/)).not.toBeInTheDocument();
  });

  it('shows when the app starts offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    renderApp('/');

    expect(await screen.findByText(/You’re offline/)).toBeInTheDocument();
  });
});
