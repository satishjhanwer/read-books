import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { removeOldestQuery, type PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

import { isNotFound } from '../api/openLibrary';

/** How long cached results survive, in memory and in localStorage, so recently viewed pages work offline. */
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Catalog data changes rarely; avoid refetching on every navigation.
        staleTime: 5 * 60 * 1000,
        // At least the persisted maxAge, or restored queries would be garbage-collected straight away.
        gcTime: CACHE_MAX_AGE,
        refetchOnWindowFocus: false,
        // Retry transient failures, but a 404 won't fix itself.
        retry: (failureCount, error) => !isNotFound(error) && failureCount < 2,
      },
    },
  });
}

function localStorageOrUndefined(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined; // Blocked storage: the cache just isn't persisted.
  }
}

/** Persists successful queries to localStorage (used by PersistQueryClientProvider in main.tsx). */
export function createPersistOptions(): Omit<PersistQueryClientOptions, 'queryClient'> {
  return {
    persister: createAsyncStoragePersister({
      storage: localStorageOrUndefined(),
      key: 'read-books:query-cache',
      throttleTime: 1000,
      // Over quota: drop the oldest queries until it fits.
      retry: removeOldestQuery,
    }),
    maxAge: CACHE_MAX_AGE,
    // Bump when the shapes in src/api/types.ts change, so old cached data is discarded.
    buster: 'api-v1',
  };
}
