import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

import { getBook, getEditions } from '../../api/openLibrary';

export function useBook(workId: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['book', workId],
    queryFn: async ({ signal }) => {
      const book = await getBook(workId, signal);
      // Merged work: seed the canonical id so the page can redirect without refetching.
      if (book.id !== workId) queryClient.setQueryData(['book', book.id], book);
      return book;
    },
  });
}

export function useEditions(workId: string) {
  return useInfiniteQuery({
    queryKey: ['book', workId, 'editions'],
    queryFn: ({ pageParam, signal }) => getEditions(workId, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  });
}
