import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Navigate, useParams } from 'react-router';

import { isNotFound } from '../../api/openLibrary';
import { BookGrid, BookGridSkeleton } from '../../components/BookGrid';
import { Cover } from '../../components/Cover';
import { DetailLayout, DetailSkeleton } from '../../components/DetailLayout';
import { ExternalLinks } from '../../components/ExternalLinks';
import { LoadError } from '../../components/LoadError';
import { LoadMore } from '../../components/LoadMore';
import { Markdown } from '../../components/Markdown';
import NotFoundPage from '../../components/NotFoundPage';
import { PageTitle } from '../../components/PageTitle';
import { uniqueBooks } from '../../lib/books';
import { useAuthor, useAuthorBooks } from './useAuthor';

export default function AuthorPage() {
  const { authorId = '' } = useParams();
  const intl = useIntl();
  const { data: author, isPending, isError, error, refetch } = useAuthor(authorId);
  // Started alongside the author request rather than after it.
  const books = useAuthorBooks(authorId);

  if (isPending) {
    return (
      <>
        <PageTitle title={intl.formatMessage({ id: 'author.title' })} />
        <DetailSkeleton />
      </>
    );
  }

  if (isError) {
    return isNotFound(error) ? (
      <NotFoundPage titleId="author.notFound.title" bodyId="author.notFound.body" />
    ) : (
      <div className="mx-auto max-w-md">
        <LoadError onRetry={() => void refetch()} />
      </div>
    );
  }

  if (author.id !== authorId) return <Navigate to={`/author/${author.id}`} replace />;

  const name = author.name ?? intl.formatMessage({ id: 'book.unknownAuthor' });

  return (
    <>
      <PageTitle title={name} />
      <article>
        <DetailLayout
          aside={
            <Cover
              kind="author"
              imageId={author.photoId}
              alt={intl.formatMessage({ id: 'details.photoAlt' }, { name })}
              size="L"
              className="aspect-[3/4] w-full shadow-md"
            />
          }>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{name}</h1>
          {(author.birthDate ?? author.deathDate) && (
            <p className="mt-2 flex flex-wrap gap-x-4 text-slate-600 dark:text-slate-400">
              {author.birthDate && (
                <span>
                  <FormattedMessage id="author.born" values={{ date: author.birthDate }} />
                </span>
              )}
              {author.deathDate && (
                <span>
                  <FormattedMessage id="author.died" values={{ date: author.deathDate }} />
                </span>
              )}
            </p>
          )}

          <section className="mt-8 max-w-prose">
            {author.bio ? (
              <Markdown>{author.bio}</Markdown>
            ) : (
              <p className="text-slate-500 italic">
                <FormattedMessage id="author.noBio" />
              </p>
            )}
          </section>

          <ExternalLinks links={author.links} openLibraryUrl={author.openLibraryUrl} />
        </DetailLayout>
      </article>

      <AuthorBooks name={name} query={books} />
    </>
  );
}

function AuthorBooks({ name, query }: { name: string; query: ReturnType<typeof useAuthorBooks> }) {
  const { data, isPending, isError, isFetchNextPageError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    query;
  const books = useMemo(() => uniqueBooks(data?.pages), [data]);
  const total = data?.pages[0]?.total;

  return (
    <section className="mt-14" aria-labelledby="author-books-heading">
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 id="author-books-heading" className="text-xl font-semibold">
          <FormattedMessage id="author.books" values={{ name }} />
        </h2>
        {total !== undefined && total > 0 && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            <FormattedMessage id="author.bookCount" values={{ count: total }} />
          </span>
        )}
      </div>

      {isPending ? (
        <BookGridSkeleton count={6} />
      ) : isError && !isFetchNextPageError ? (
        <div className="mx-auto max-w-md">
          <LoadError onRetry={() => void refetch()} />
        </div>
      ) : books.length === 0 ? (
        <p className="text-slate-500 italic">
          <FormattedMessage id="author.noBooks" />
        </p>
      ) : (
        <>
          <BookGrid books={books} />
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
