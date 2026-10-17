import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAuthor, getAuthorBooks } from '../../api/openLibrary';

export function useAuthor(authorId: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['author', authorId],
    queryFn: async ({ signal }) => {
      const author = await getAuthor(authorId, signal);
      // Merged author: seed the canonical id so the page can redirect without refetching.
      if (author.id !== authorId) queryClient.setQueryData(['author', author.id], author);
      return author;
    },
  });
}

export function useAuthorBooks(authorId: string) {
  return useInfiniteQuery({
    queryKey: ['author', authorId, 'books'],
    queryFn: ({ pageParam, signal }) => getAuthorBooks(authorId, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  });
}
