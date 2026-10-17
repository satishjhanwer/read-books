import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

import { resetForTests as resetReadingList } from '../features/reading-list/store';
import { resetForTests as resetTheme } from '../lib/theme';
import { server } from './server';

// Lazy route chunks are transformed on first import, which can take several seconds on a cold, busy run.
configure({ asyncUtilTimeout: 10_000 });

// jsdom doesn't implement scrolling; <ScrollRestoration> calls it on every navigation.
window.scrollTo = () => undefined;

// jsdom has no matchMedia; report a light OS theme. Tests can replace it with vi.spyOn(window, 'matchMedia').
window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }) satisfies MediaQueryList;

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  resetReadingList();
  resetTheme();
  vi.restoreAllMocks();
});
afterAll(() => {
  server.close();
});
