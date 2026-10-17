import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import { BookGrid, BookGridSkeleton } from '../../components/BookGrid';
import { uniqueBooks } from '../../lib/books';
import { useAuthorBooks } from '../author/useAuthor';

const MAX_BOOKS = 6;

/** The author's best-known other works; shares its cache with the author page. Hidden when there are none. */
export function MoreByAuthor({ authorId, name, bookId }: { authorId: string; name: string; bookId: string }) {
  const { data, isPending, isError } = useAuthorBooks(authorId);
  const books = useMemo(
    () =>
      uniqueBooks(data?.pages)
        .filter((book) => book.id !== bookId)
        .slice(0, MAX_BOOKS),
    [data, bookId],
  );

  if (isError || (!isPending && books.length === 0)) return null;

  return (
    <section className="mt-14" aria-labelledby="more-by-author-heading">
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 id="more-by-author-heading" className="text-xl font-semibold">
          <FormattedMessage id="book.moreBy" values={{ name }} />
        </h2>
        <Link
          to={`/author/${authorId}`}
          className="inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap text-indigo-600 hover:underline dark:text-indigo-400">
          <FormattedMessage id="book.moreBy.all" />
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>
      {isPending ? <BookGridSkeleton count={MAX_BOOKS} /> : <BookGrid books={books} />}
    </section>
  );
}
