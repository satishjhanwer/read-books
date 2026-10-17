import { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router';

import type { AuthorRef } from '../api/types';

/** Comma-separated author links, truncated to `max` with "+N". */
export function AuthorLinks({ authors, max = Infinity }: { authors: AuthorRef[]; max?: number }) {
  const intl = useIntl();
  const unknown = intl.formatMessage({ id: 'book.unknownAuthor' });
  if (authors.length === 0) return <span>{unknown}</span>;

  const shown = authors.slice(0, max);
  const hidden = authors.length - shown.length;

  return (
    <span>
      {shown.map((author, i) => (
        <Fragment key={author.id}>
          {i > 0 && ', '}
          <Link
            to={`/author/${author.id}`}
            className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
            {author.name ?? unknown}
          </Link>
        </Fragment>
      ))}
      {hidden > 0 && ` +${String(hidden)}`}
    </span>
  );
}
