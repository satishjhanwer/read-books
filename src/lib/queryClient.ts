import { QueryClient } from '@tanstack/react-query';

import { isNotFound } from '../api/openLibrary';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Catalog data changes rarely; avoid refetching on every navigation.
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        // Retry transient failures, but a 404 won't fix itself.
        retry: (failureCount, error) => !isNotFound(error) && failureCount < 2,
      },
    },
  });
}
