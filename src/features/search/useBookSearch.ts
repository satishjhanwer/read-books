import { useInfiniteQuery } from '@tanstack/react-query';

import { searchAuthors, searchBooks, type BookSearchParams } from '../../api/openLibrary';
import { isActive, type SearchState } from './searchState';

export function useBookSearch(state: SearchState) {
  const params: BookSearchParams = {
    query: state.query,
    subject: state.subject,
    sort: state.sort,
    yearFrom: state.yearFrom,
    yearTo: state.yearTo,
  };
  return useInfiniteQuery({
    queryKey: ['search', 'books', { ...params, query: state.query.toLowerCase() }],
    queryFn: ({ pageParam, signal }) => searchBooks(params, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: state.type === 'books' && isActive(state),
  });
}

export function useAuthorSearch(state: SearchState) {
  return useInfiniteQuery({
    queryKey: ['search', 'authors', state.query.toLowerCase()],
    queryFn: ({ pageParam, signal }) => searchAuthors(state.query, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: state.type === 'authors' && isActive(state),
  });
}
