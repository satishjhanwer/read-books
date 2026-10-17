import { X } from 'lucide-react';
import { useId, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { BOOK_SORTS, type BookSort } from '../../api/openLibrary';
import { hasBookFilters, parseYear, type SearchState } from './searchState';

const RELEVANCE = 'relevance';
const controlClass =
  'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900';

interface SearchFiltersProps {
  state: SearchState;
  onChange: (patch: Partial<SearchState>) => void;
}

/** Book-only filters. Every change goes straight to the URL through `onChange`. */
export function SearchFilters({ state, onChange }: SearchFiltersProps) {
  const intl = useIntl();
  const sortId = useId();

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
      {state.subject && (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 py-1 pr-1 pl-3 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <FormattedMessage id="search.subject" values={{ subject: state.subject }} />
          <button
            type="button"
            onClick={() => {
              onChange({ subject: undefined });
            }}
            aria-label={intl.formatMessage({ id: 'search.subject.remove' }, { subject: state.subject })}
            className="rounded-full p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900">
            <X aria-hidden className="size-3.5" />
          </button>
        </span>
      )}

      <span className="flex items-center gap-2">
        <label htmlFor={sortId} className="text-slate-600 dark:text-slate-400">
          <FormattedMessage id="search.sort.label" />
        </label>
        <select
          id={sortId}
          value={state.sort ?? RELEVANCE}
          onChange={(event) => {
            const value = event.target.value;
            onChange({ sort: BOOK_SORTS.find((sort): sort is BookSort => sort === value) });
          }}
          className={controlClass}>
          <option value={RELEVANCE}>{intl.formatMessage({ id: 'search.sort.relevance' })}</option>
          {BOOK_SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {intl.formatMessage({ id: `search.sort.${sort}` })}
            </option>
          ))}
        </select>
      </span>

      <span className="flex items-center gap-1">
        <YearInput
          value={state.yearFrom}
          label={intl.formatMessage({ id: 'search.year.from' })}
          placeholder={intl.formatMessage({ id: 'search.year.fromPlaceholder' })}
          onCommit={(yearFrom) => {
            onChange({ yearFrom });
          }}
        />
        <span aria-hidden className="text-slate-500 dark:text-slate-400">
          –
        </span>
        <YearInput
          value={state.yearTo}
          label={intl.formatMessage({ id: 'search.year.to' })}
          placeholder={intl.formatMessage({ id: 'search.year.toPlaceholder' })}
          onCommit={(yearTo) => {
            onChange({ yearTo });
          }}
        />
      </span>

      {hasBookFilters(state) && (
        <button
          type="button"
          onClick={() => {
            onChange({ sort: undefined, yearFrom: undefined, yearTo: undefined });
          }}
          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          <FormattedMessage id="search.filters.clear" />
        </button>
      )}
    </div>
  );
}

interface YearInputProps {
  value?: number;
  label: string;
  placeholder: string;
  onCommit: (year: number | undefined) => void;
}

/**
 * Commits once a full 4-digit year is typed (or the field is cleared), so partial input like "19"
 * never triggers a search. Shorter years (e.g. 800) commit on blur.
 */
function YearInput({ value, label, placeholder, onCommit }: YearInputProps) {
  const text = value === undefined ? '' : String(value);
  const [draft, setDraft] = useState(text);
  const [synced, setSynced] = useState(text);
  if (text !== synced) {
    setSynced(text);
    setDraft(text);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={4}
      value={draft}
      aria-label={label}
      placeholder={placeholder}
      onChange={(event) => {
        const next = event.target.value.replace(/\D/g, '');
        setDraft(next);
        if (next === '') onCommit(undefined);
        else if (next.length === 4) onCommit(Number(next));
      }}
      onBlur={() => {
        const year = parseYear(draft);
        if (year !== value) onCommit(year);
      }}
      className={`${controlClass} w-20 text-center`}
    />
  );
}
