import { FormattedMessage, useIntl } from 'react-intl';
import { Link, Navigate, useParams } from 'react-router';

import { isNotFound } from '../../api/openLibrary';
import { AuthorLinks } from '../../components/AuthorLinks';
import { Cover } from '../../components/Cover';
import { DetailLayout, DetailSkeleton, sectionHeadingClass } from '../../components/DetailLayout';
import { ExternalLinks } from '../../components/ExternalLinks';
import { LoadError } from '../../components/LoadError';
import { Markdown } from '../../components/Markdown';
import NotFoundPage from '../../components/NotFoundPage';
import { PageTitle } from '../../components/PageTitle';
import { RatingStars } from '../../components/RatingStars';
import { useBook } from './useBook';

const MAX_SUBJECTS = 15;

export default function BookPage() {
  const { workId = '' } = useParams();
  const intl = useIntl();
  const { data: book, isPending, isError, error, refetch } = useBook(workId);

  if (isPending) {
    return (
      <>
        <PageTitle title={intl.formatMessage({ id: 'book.title' })} />
        <DetailSkeleton />
      </>
    );
  }

  if (isError) {
    return isNotFound(error) ? (
      <NotFoundPage titleId="book.notFound.title" bodyId="book.notFound.body" />
    ) : (
      <div className="mx-auto max-w-md">
        <LoadError onRetry={() => void refetch()} />
      </div>
    );
  }

  if (book.id !== workId) return <Navigate to={`/book/${book.id}`} replace />;

  const subjects = book.subjects.slice(0, MAX_SUBJECTS);

  return (
    <article>
      <PageTitle title={book.title} />
      <DetailLayout
        aside={
          <Cover
            imageId={book.coverId}
            alt={intl.formatMessage({ id: 'cover.alt' }, { title: book.title })}
            size="L"
            className="aspect-[2/3] w-full shadow-md"
          />
        }>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{book.title}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          <FormattedMessage id="book.byline" values={{ authors: <AuthorLinks authors={book.authors} /> }} />
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          {book.rating && <RatingStars rating={book.rating} />}
          {book.firstPublishDate && (
            <span>
              <FormattedMessage id="book.firstPublished" values={{ date: book.firstPublishDate }} />
            </span>
          )}
        </div>

        <section className="mt-8 max-w-prose">
          {book.description ? (
            <Markdown>{book.description}</Markdown>
          ) : (
            <p className="text-slate-500 italic">
              <FormattedMessage id="book.noDescription" />
            </p>
          )}
        </section>

        {subjects.length > 0 && (
          <section className="mt-8">
            <h2 className={sectionHeadingClass}>
              <FormattedMessage id="book.subjects" />
            </h2>
            <ul className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <li key={subject}>
                  <Link
                    to={{ pathname: '/', search: `?q=${encodeURIComponent(subject)}` }}
                    className="block rounded-full border border-slate-300 px-3 py-1 text-sm hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:hover:text-indigo-400">
                    {subject}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ExternalLinks links={book.links} openLibraryUrl={book.openLibraryUrl} />
      </DetailLayout>
    </article>
  );
}
