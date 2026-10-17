import { Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useState, type SubmitEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useSearchParams } from 'react-router';

import { BookGrid, BookGridSkeleton } from '../../components/BookGrid';
import { LoadError } from '../../components/LoadError';
import { LoadMore } from '../../components/LoadMore';
import { PageTitle } from '../../components/PageTitle';
import { buttonClass } from '../../components/StatusPage';
import { uniqueBooks } from '../../lib/books';
import { AuthorResults } from './AuthorResults';
import { SearchFilters } from './SearchFilters';
import {
  MIN_QUERY_LENGTH,
  isActive,
  isSearchable,
  parseSearchParams,
  toSearchParams,
  type SearchState,
  type SearchType,
} from './searchState';
import { useBookSearch } from './useBookSearch';

export const SEARCH_DEBOUNCE_MS = 400;
const SUGGESTIONS: Record<SearchType, string[]> = {
  books: ['The Hobbit', 'Jane Austen', 'Dune', 'Agatha Christie'],
  authors: ['Tolkien', 'Ursula K. Le Guin', 'Toni Morrison', 'Haruki Murakami'],
};

export default function SearchPage() {
  const intl = useIntl();
  const inputId = useId();
  const [params, setParams] = useSearchParams();
  // The URL is the source of truth for what is searched (see searchState.ts).
  const state = useMemo(() => parseSearchParams(params), [params]);
  const { query, type } = state;

  // The input is local state so typing stays responsive. When the URL changes from outside
  // (back/forward, suggestion or subject links), reset the input to match.
  const [input, setInput] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setInput(query);
  }

  // Typing: the first search pushes a history entry (so Back returns to the empty page);
  // refinements replace it so Back doesn't step through every keystroke.
  useEffect(() => {
    const next = input.trim();
    if (next === query || (next !== '' && !isSearchable(next))) return;
    const timer = setTimeout(() => {
      setParams(toSearchParams({ ...state, query: next }), { replace: query !== '' });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [input, query, state, setParams]);

  // Discrete changes (submit, tabs, filters) are their own history entries.
  const update = (patch: Partial<SearchState>) => {
    setParams(toSearchParams({ ...state, ...patch }));
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = input.trim();
    if (next !== query && (next === '' || isSearchable(next))) update({ query: next });
  };

  const tabs: { type: SearchType; to: string }[] = [
    { type: 'books', to: `?${toSearchParams({ query, type: 'books' }).toString()}` },
    { type: 'authors', to: `?${toSearchParams({ query, type: 'authors' }).toString()}` },
  ];
  const active = isActive(state);

  return (
    <>
      <PageTitle title={query || state.subject || undefined} />
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          <FormattedMessage id="search.title" />
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          <FormattedMessage id="search.subtitle" />
        </p>

        <nav
          aria-label={intl.formatMessage({ id: 'search.type.label' })}
          className="mt-6 inline-flex rounded-lg bg-slate-200/70 p-1 dark:bg-slate-800">
          {tabs.map((tab) => (
            <Link
              key={tab.type}
              to={tab.to}
              aria-current={tab.type === type ? 'page' : undefined}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                tab.type === type
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}>
              <FormattedMessage id={`search.type.${tab.type}`} />
            </Link>
          ))}
        </nav>

        <form role="search" onSubmit={onSubmit} className="mt-4 flex gap-2">
          <label htmlFor={inputId} className="sr-only">
            <FormattedMessage id={type === 'authors' ? 'search.label.authors' : 'search.label'} />
          </label>
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id={inputId}
              type="search"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              placeholder={intl.formatMessage({
                id: type === 'authors' ? 'search.placeholder.authors' : 'search.placeholder',
              })}
              autoComplete="off"
              autoFocus
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-9 pl-9 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 [&::-webkit-search-cancel-button]:hidden"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput('');
                  update({ query: '' });
                }}
                aria-label={intl.formatMessage({ id: 'search.clear' })}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
          <button type="submit" className={buttonClass}>
            <FormattedMessage id="search.submit" />
          </button>
        </form>

        {input.trim() !== '' && !isSearchable(input) && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            <FormattedMessage id="search.tooShort" values={{ min: MIN_QUERY_LENGTH }} />
          </p>
        )}

        {!active && query === '' && (
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <FormattedMessage id="search.suggestions" />
            {SUGGESTIONS[type].map((suggestion) => (
              <Link
                key={suggestion}
                to={{ search: `?${toSearchParams({ query: suggestion, type }).toString()}` }}
                className="rounded-full border border-slate-300 px-3 py-1 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:hover:text-indigo-400">
                {suggestion}
              </Link>
            ))}
          </p>
        )}
      </section>

      {type === 'books' && active && <SearchFilters state={state} onChange={update} />}
      {active && (type === 'authors' ? <AuthorResults state={state} /> : <BookResults state={state} />)}
    </>
  );
}

function BookResults({ state }: { state: SearchState }) {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useBookSearch(state);

  const books = useMemo(() => uniqueBooks(data?.pages), [data]);

  if (isPending) {
    return (
      <div className="mt-10">
        <BookGridSkeleton />
      </div>
    );
  }

  if (isError && !isFetchNextPageError) {
    return (
      <div className="mx-auto mt-10 max-w-md">
        <LoadError onRetry={() => void refetch()} />
      </div>
    );
  }

  const total = data.pages[0]?.total ?? 0;

  if (total === 0) {
    return (
      <div role="status" className="mt-12 text-center">
        <h2 className="text-lg font-semibold">
          <FormattedMessage id="search.empty.title" />
        </h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          <FormattedMessage id="search.empty.body" values={{ query: state.query || state.subject }} />
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10" aria-labelledby="results-heading">
      <h2 id="results-heading" className="mb-6 text-sm font-medium text-slate-600 dark:text-slate-400">
        <span role="status">
          {state.query ? (
            <FormattedMessage id="search.results" values={{ count: total, query: state.query }} />
          ) : (
            <FormattedMessage id="search.resultsSubject" values={{ count: total, subject: state.subject }} />
          )}
        </span>
      </h2>
      <BookGrid books={books} />
      <LoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={isFetchNextPageError}
        fetchNextPage={fetchNextPage}
      />
    </section>
  );
}
