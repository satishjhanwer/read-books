import { useInfiniteQuery } from '@tanstack/react-query';

import { searchBooks } from '../../api/openLibrary';

export const MIN_QUERY_LENGTH = 2;

export const isSearchable = (query: string) => query.trim().length >= MIN_QUERY_LENGTH;

export function useBookSearch(query: string) {
  const q = query.trim();
  return useInfiniteQuery({
    queryKey: ['search', q.toLowerCase()],
    queryFn: ({ pageParam, signal }) => searchBooks(q, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: isSearchable(q),
  });
}
