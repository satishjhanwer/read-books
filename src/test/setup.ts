import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

import { server } from './server';

// Lazy route chunks are transformed on first import, which can exceed the 1 s default on a cold run.
configure({ asyncUtilTimeout: 3000 });

// jsdom doesn't implement scrolling; <ScrollRestoration> calls it on every navigation.
window.scrollTo = () => undefined;

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  vi.restoreAllMocks();
});
afterAll(() => {
  server.close();
});
