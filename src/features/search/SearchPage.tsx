import { Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useState, type SubmitEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useSearchParams } from 'react-router';

import { BookGrid, BookGridSkeleton } from '../../components/BookGrid';
import { LoadError } from '../../components/LoadError';
import { PageTitle } from '../../components/PageTitle';
import { buttonClass } from '../../components/StatusPage';
import { MIN_QUERY_LENGTH, isSearchable, useBookSearch } from './useBookSearch';

export const SEARCH_DEBOUNCE_MS = 400;
const SUGGESTIONS = ['The Hobbit', 'Jane Austen', 'Dune', 'Agatha Christie'];

export default function SearchPage() {
  const intl = useIntl();
  const inputId = useId();
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') ?? '').trim();

  // The input is local state so typing stays responsive; the URL (?q=) is the source of truth
  // for what is searched. When the URL changes from outside (back/forward, suggestion links),
  // reset the input to match.
  const [input, setInput] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setInput(query);
  }

  // The first search pushes a history entry (so Back returns to the empty page);
  // refinements replace it so Back doesn't step through every keystroke.
  const commit = (value: string) => {
    setParams(value ? { q: value } : {}, { replace: query !== '' });
  };

  useEffect(() => {
    const next = input.trim();
    if (next === query || (next !== '' && !isSearchable(next))) return;
    const timer = setTimeout(() => {
      setParams(next ? { q: next } : {}, { replace: query !== '' });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [input, query, setParams]);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = input.trim();
    if (next === '' || isSearchable(next)) commit(next);
  };

  return (
    <>
      <PageTitle title={query || undefined} />
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          <FormattedMessage id="search.title" />
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          <FormattedMessage id="search.subtitle" />
        </p>

        <form role="search" onSubmit={onSubmit} className="mt-6 flex gap-2">
          <label htmlFor={inputId} className="sr-only">
            <FormattedMessage id="search.label" />
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
              placeholder={intl.formatMessage({ id: 'search.placeholder' })}
              autoComplete="off"
              autoFocus
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-9 pl-9 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 [&::-webkit-search-cancel-button]:hidden"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput('');
                  commit('');
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
          <p className="mt-2 text-sm text-slate-500">
            <FormattedMessage id="search.tooShort" values={{ min: MIN_QUERY_LENGTH }} />
          </p>
        )}

        {query === '' && (
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <FormattedMessage id="search.suggestions" />
            {SUGGESTIONS.map((suggestion) => (
              <Link
                key={suggestion}
                to={{ search: `?q=${encodeURIComponent(suggestion)}` }}
                className="rounded-full border border-slate-300 px-3 py-1 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:hover:text-indigo-400">
                {suggestion}
              </Link>
            ))}
          </p>
        )}
      </section>

      {isSearchable(query) && <SearchResults query={query} />}
    </>
  );
}

function SearchResults({ query }: { query: string }) {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useBookSearch(query);

  // Open Library pages can overlap when the index shifts; keep the first occurrence of each work.
  const books = useMemo(() => {
    const seen = new Set<string>();
    return (data?.pages ?? []).flatMap((page) => page.books).filter((book) => !seen.has(book.id) && seen.add(book.id));
  }, [data]);

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
          <FormattedMessage id="search.empty.body" values={{ query }} />
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10" aria-labelledby="results-heading">
      <h2 id="results-heading" className="mb-6 text-sm font-medium text-slate-600 dark:text-slate-400">
        <span role="status">
          <FormattedMessage id="search.results" values={{ count: total, query }} />
        </span>
      </h2>
      <BookGrid books={books} />

      <div className="mt-10 flex justify-center">
        {isFetchNextPageError ? (
          <LoadError onRetry={() => void fetchNextPage()} />
        ) : hasNextPage ? (
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className={`${buttonClass} disabled:opacity-60`}>
            <FormattedMessage id={isFetchingNextPage ? 'search.loadingMore' : 'search.loadMore'} />
          </button>
        ) : (
          <p className="text-sm text-slate-500">
            <FormattedMessage id="search.end" />
          </p>
        )}
      </div>
    </section>
  );
}
