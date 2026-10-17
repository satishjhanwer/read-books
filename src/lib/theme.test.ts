import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { renderApp } from '../test/render';
import { THEME_STORAGE_KEY, initTheme, resetForTests, setTheme } from './theme';

const html = document.documentElement;

/** Fakes the OS colour scheme and returns a function that flips it, firing `change` listeners. */
function mockSystemTheme(initialDark: boolean) {
  let dark = initialDark;
  const listeners = new Set<() => void>();
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (media) =>
      ({
        get matches() {
          return dark;
        },
        media,
        onchange: null,
        addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );
  return (nextDark: boolean) => {
    dark = nextDark;
    for (const listener of listeners) listener();
  };
}

describe('theme', () => {
  it('follows the OS theme by default, including later changes', () => {
    const setSystemDark = mockSystemTheme(true);
    const cleanup = initTheme();

    expect(html).toHaveClass('dark');
    expect(html.style.colorScheme).toBe('dark');

    setSystemDark(false);
    expect(html).not.toHaveClass('dark');
    cleanup();
  });

  it('keeps an explicit choice when the OS theme changes', () => {
    const setSystemDark = mockSystemTheme(false);
    const cleanup = initTheme();

    setTheme('dark');
    setSystemDark(false);

    expect(html).toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    cleanup();
  });

  it('restores the stored theme and ignores invalid values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    resetForTests();
    initTheme()();
    expect(html).toHaveClass('dark');

    localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    resetForTests();
    initTheme()();
    expect(html).not.toHaveClass('dark');
  });

  it('syncs with other tabs', () => {
    const cleanup = initTheme();

    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY }));
    });

    expect(html).toHaveClass('dark');
    cleanup();
  });

  it('cycles system → light → dark → system from the header button', async () => {
    mockSystemTheme(true);
    const user = userEvent.setup();
    renderApp('/');

    await user.click(screen.getByRole('button', { name: 'Theme: System (switch to Light)' }));
    expect(html).not.toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

    await user.click(screen.getByRole('button', { name: 'Theme: Light (switch to Dark)' }));
    expect(html).toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Theme: Dark (switch to System)' }));
    expect(html).toHaveClass('dark'); // The mocked OS theme is dark.
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});
