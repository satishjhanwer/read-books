import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import type { Edition } from '../../api/types';
import { Cover } from '../../components/Cover';
import { LoadError } from '../../components/LoadError';
import { LoadMore } from '../../components/LoadMore';
import { useEditions } from './useBook';

export function Editions({ workId, bookTitle }: { workId: string; bookTitle: string }) {
  const { data, isPending, isError, isFetchNextPageError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useEditions(workId);
  const editions = useMemo(() => {
    // Offset pages can overlap when Open Library adds editions in between; keep each one once.
    const seen = new Set<string>();
    return (data?.pages ?? [])
      .flatMap((page) => page.editions)
      .filter((edition) => {
        if (seen.has(edition.id)) return false;
        seen.add(edition.id);
        return true;
      });
  }, [data]);
  const total = data?.pages[0]?.total;

  return (
    <section className="mt-14" aria-labelledby="editions-heading">
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 id="editions-heading" className="text-xl font-semibold">
          <FormattedMessage id="book.editions.title" />
        </h2>
        {total !== undefined && total > 0 && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            <FormattedMessage id="book.editions" values={{ count: total }} />
          </span>
        )}
      </div>

      {isPending ? (
        <ul aria-hidden data-testid="editions-skeleton" className="grid animate-pulse gap-x-8 gap-y-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="flex gap-4">
              <div className="aspect-[2/3] w-14 shrink-0 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </li>
          ))}
        </ul>
      ) : isError && !isFetchNextPageError ? (
        <div className="mx-auto max-w-md">
          <LoadError onRetry={() => void refetch()} />
        </div>
      ) : editions.length === 0 ? (
        <p className="text-slate-500 italic dark:text-slate-400">
          <FormattedMessage id="book.editions.empty" />
        </p>
      ) : (
        <>
          <ul className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            {editions.map((edition) => (
              <EditionItem key={edition.id} edition={edition} fallbackTitle={bookTitle} />
            ))}
          </ul>
          <LoadMore
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isFetchNextPageError={isFetchNextPageError}
            fetchNextPage={fetchNextPage}
          />
        </>
      )}
    </section>
  );
}

/** MARC codes (`eng`, `ger`) to names in the UI language; unknown codes are shown as-is. */
function languageNames(codes: string[], locale: string): string[] {
  const names = new Intl.DisplayNames([locale], { type: 'language', fallback: 'none' });
  return codes.map((code) => {
    try {
      return names.of(code) ?? code;
    } catch {
      return code; // Not a valid language subtag.
    }
  });
}

function EditionItem({ edition, fallbackTitle }: { edition: Edition; fallbackTitle: string }) {
  const intl = useIntl();
  const details = [
    edition.publishers.join(', '),
    edition.publishDate,
    edition.pages === undefined
      ? undefined
      : intl.formatMessage({ id: 'book.edition.pages' }, { count: edition.pages }),
    edition.format,
    intl.formatList(languageNames(edition.languages, intl.locale)),
  ].filter(Boolean);

  return (
    <li className="flex gap-4">
      {/* Decorative: the title next to it names the edition. */}
      <div aria-hidden className="w-14 shrink-0">
        <Cover imageId={edition.coverId} alt="" size="S" className="aspect-[2/3] w-full" />
      </div>
      <div className="min-w-0 text-sm">
        <a
          href={edition.openLibraryUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          <span className="break-words">
            {edition.title ?? fallbackTitle}
            {edition.subtitle && `: ${edition.subtitle}`}
          </span>
          <ExternalLink aria-hidden className="size-3.5 shrink-0" />
        </a>
        {details.length > 0 && <p className="mt-1 text-slate-600 dark:text-slate-400">{details.join(' · ')}</p>}
        {edition.isbn && (
          <p className="mt-0.5 text-slate-500 dark:text-slate-400">
            <FormattedMessage id="book.edition.isbn" values={{ isbn: edition.isbn }} />
          </p>
        )}
      </div>
    </li>
  );
}
