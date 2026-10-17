import { Bookmark } from 'lucide-react';
import { useIntl } from 'react-intl';

import type { BookSummary } from '../../api/types';
import { removeBook, setShelf } from './store';
import { useShelf } from './useReadingList';

/** Bookmark toggle: saves to "Want to read", or removes the book whatever shelf it's on. */
export function SaveButton({ book, className = '' }: { book: BookSummary; className?: string }) {
  const intl = useIntl();
  const saved = useShelf(book.id) !== undefined;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={intl.formatMessage({ id: 'shelf.save' }, { title: book.title })}
      title={intl.formatMessage({ id: saved ? 'shelf.unsave' : 'shelf.save' }, { title: book.title })}
      onClick={() => {
        if (saved) removeBook(book.id);
        else setShelf(book, 'want');
      }}
      className={`rounded-full bg-white/90 p-1.5 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-indigo-600 dark:bg-slate-900/90 dark:hover:bg-slate-900 ${
        saved ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
      } ${className}`}>
      <Bookmark aria-hidden className={`size-4 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
