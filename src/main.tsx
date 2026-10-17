import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { LocaleProvider } from './i18n/LocaleProvider';
import { createPersistOptions, createQueryClient } from './lib/queryClient';
import { initTheme } from './lib/theme';
import { basename, routes } from './routes';
import './index.css';

initTheme();

const router = createBrowserRouter(routes, { basename });
const queryClient = createQueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={createPersistOptions()}>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
);
