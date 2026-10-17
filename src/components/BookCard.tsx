import { useIntl } from 'react-intl';
import { Link } from 'react-router';

import type { BookSummary } from '../api/types';
import { AuthorLinks } from './AuthorLinks';
import { Cover } from './Cover';
import { RatingStars } from './RatingStars';

export function BookCard({ book }: { book: BookSummary }) {
  const intl = useIntl();

  return (
    <article className="group flex flex-col gap-2">
      {/* The title link below is the accessible name; this one just enlarges the click target. */}
      <Link to={`/book/${book.id}`} tabIndex={-1} aria-hidden className="block rounded-md">
        <Cover
          imageId={book.coverId}
          alt={intl.formatMessage({ id: 'cover.alt' }, { title: book.title })}
          className="aspect-[2/3] w-full shadow-sm transition group-hover:shadow-md"
        />
      </Link>
      <div className="min-w-0 space-y-1">
        <h3 className="line-clamp-2 leading-snug font-medium">
          <Link to={`/book/${book.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            {book.title}
          </Link>
        </h3>
        <p className="line-clamp-1 text-sm text-slate-600 dark:text-slate-400">
          <AuthorLinks authors={book.authors} max={2} />
        </p>
        {book.firstPublishYear !== undefined && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{book.firstPublishYear}</p>
        )}
        {book.rating && <RatingStars rating={book.rating} />}
      </div>
    </article>
  );
}
