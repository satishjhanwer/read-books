import { useSyncExternalStore } from 'react';

import type { BookDetails, BookSummary } from '../../api/types';
import { getSnapshot, subscribe, type ReadingList, type Shelf } from './store';

export function useReadingList(): ReadingList {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useShelf(bookId: string): Shelf | undefined {
  return useReadingList()[bookId]?.shelf;
}

/** The book page has full details; the list stores the same summary that search results use. */
export function toBookSummary(book: BookDetails): BookSummary {
  const year = /\b(\d{4})\b/.exec(book.firstPublishDate ?? '')?.[1];
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverId: book.coverId,
    firstPublishYear: year === undefined ? undefined : Number(year),
    rating: book.rating,
  };
}
