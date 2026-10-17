import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getBook } from '../../api/openLibrary';

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
