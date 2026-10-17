import { useId } from 'react';
import { useIntl } from 'react-intl';

import type { BookSummary } from '../../api/types';
import { SHELVES, isShelf, removeBook, setShelf } from './store';
import { useShelf } from './useReadingList';

const NONE = 'none';

interface ShelfSelectProps {
  book: BookSummary;
  /** Show the "Reading list" label (book page) or only an accessible name (compact list cards). */
  showLabel?: boolean;
}

/** Picks the shelf for a book; "Not in list" removes it. */
export function ShelfSelect({ book, showLabel = false }: ShelfSelectProps) {
  const intl = useIntl();
  const id = useId();
  const shelf = useShelf(book.id);

  const select = (
    <select
      id={id}
      value={shelf ?? NONE}
      aria-label={showLabel ? undefined : intl.formatMessage({ id: 'shelf.selectLabel' }, { title: book.title })}
      onChange={(event) => {
        const value = event.target.value;
        if (isShelf(value)) setShelf(book, value);
        else removeBook(book.id);
      }}
      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900">
      <option value={NONE}>{intl.formatMessage({ id: 'shelf.none' })}</option>
      {SHELVES.map((value) => (
        <option key={value} value={value}>
          {intl.formatMessage({ id: `shelf.${value}` })}
        </option>
      ))}
    </select>
  );

  if (!showLabel) return select;

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {intl.formatMessage({ id: 'shelf.label' })}
      </label>
      <div className="w-48">{select}</div>
    </div>
  );
}
