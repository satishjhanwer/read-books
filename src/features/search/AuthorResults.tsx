import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router';

import { authorPhotoUrlById } from '../../api/openLibrary';
import type { AuthorSummary } from '../../api/types';
import { Cover } from '../../components/Cover';
import { LoadError } from '../../components/LoadError';
import { LoadMore } from '../../components/LoadMore';
import type { SearchState } from './searchState';
import { useAuthorSearch } from './useBookSearch';

const gridClass = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';

export function AuthorResults({ state }: { state: SearchState }) {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useAuthorSearch(state);
  // Pages can overlap, like book search pages.
  const authors = useMemo(() => {
    const seen = new Set<string>();
    return (data?.pages ?? [])
      .flatMap((page) => page.authors)
      .filter((author) => !seen.has(author.id) && Boolean(seen.add(author.id)));
  }, [data]);

  if (isPending) {
    return (
      <ul aria-hidden data-testid="author-grid-skeleton" className={`mt-10 ${gridClass}`}>
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="flex animate-pulse items-center gap-4 rounded-lg p-3">
            <div className="size-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </li>
        ))}
      </ul>
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
          <FormattedMessage id="search.authors.empty.title" />
        </h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          <FormattedMessage id="search.authors.empty.body" values={{ query: state.query }} />
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10" aria-labelledby="author-results-heading">
      <h2 id="author-results-heading" className="mb-6 text-sm font-medium text-slate-600 dark:text-slate-400">
        <span role="status">
          <FormattedMessage id="search.authors.results" values={{ count: total, query: state.query }} />
        </span>
      </h2>
      <ul className={gridClass}>
        {authors.map((author) => (
          <li key={author.id}>
            <AuthorCard author={author} />
          </li>
        ))}
      </ul>
      <LoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={isFetchNextPageError}
        fetchNextPage={fetchNextPage}
      />
    </section>
  );
}

function AuthorCard({ author }: { author: AuthorSummary }) {
  const intl = useIntl();
  const name = author.name ?? intl.formatMessage({ id: 'book.unknownAuthor' });
  const lifespan =
    author.birthDate && author.deathDate
      ? intl.formatMessage({ id: 'author.lifespan' }, { born: author.birthDate, died: author.deathDate })
      : author.birthDate
        ? intl.formatMessage({ id: 'author.born' }, { date: author.birthDate })
        : author.deathDate
          ? intl.formatMessage({ id: 'author.died' }, { date: author.deathDate })
          : undefined;

  return (
    <article className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700">
      <div className="size-16 shrink-0 overflow-hidden rounded-full">
        <Cover
          kind="author"
          src={authorPhotoUrlById(author.id, 'M')}
          alt={intl.formatMessage({ id: 'details.photoAlt' }, { name })}
          className="size-full"
        />
      </div>
      <div className="min-w-0 space-y-0.5">
        <h3 className="truncate font-medium">
          <Link to={`/author/${author.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            {name}
          </Link>
        </h3>
        {lifespan && <p className="truncate text-sm text-slate-600 dark:text-slate-400">{lifespan}</p>}
        {author.topWork && (
          <p className="truncate text-sm text-slate-600 dark:text-slate-400">
            <FormattedMessage id="author.topWork" values={{ title: author.topWork }} />
          </p>
        )}
        {author.workCount !== undefined && author.workCount > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <FormattedMessage id="author.works" values={{ count: author.workCount }} />
          </p>
        )}
      </div>
    </article>
  );
}
