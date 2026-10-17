import type { BookSummary } from '../api/types';
import { BookCard } from './BookCard';

const gridClass = 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';

export function BookGrid({ books }: { books: BookSummary[] }) {
  return (
    <ul className={gridClass}>
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}

export function BookGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <ul className={gridClass} aria-hidden data-testid="book-grid-skeleton">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="animate-pulse space-y-2">
          <div className="aspect-[2/3] rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-3/5 rounded bg-slate-200 dark:bg-slate-800" />
        </li>
      ))}
    </ul>
  );
}
