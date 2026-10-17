import type { BookPage, BookSummary } from '../api/types';

/** Flattens infinite-query pages. Open Library pages can overlap when its index shifts, so keep each work once. */
export function uniqueBooks(pages: BookPage[] | undefined): BookSummary[] {
  const seen = new Set<string>();
  return (pages ?? [])
    .flatMap((page) => page.books)
    .filter((book) => {
      if (seen.has(book.id)) return false;
      seen.add(book.id);
      return true;
    });
}
