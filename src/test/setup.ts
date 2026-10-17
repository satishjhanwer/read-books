import '@testing-library/jest-dom/vitest';

import { server } from './server';

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
