import { FormattedMessage, useIntl } from 'react-intl';

import type { BookDetails } from '../../api/types';
import { sectionHeadingClass } from '../../components/DetailLayout';

/** Horizontal 5-to-1 star histogram. */
export function RatingBreakdown({ counts }: { counts: NonNullable<BookDetails['ratingCounts']> }) {
  const intl = useIntl();
  const total = counts.reduce((sum, count) => sum + count, 0);

  return (
    <section className="mt-8 max-w-md" aria-labelledby="rating-breakdown-heading">
      <h2 id="rating-breakdown-heading" className={sectionHeadingClass}>
        <FormattedMessage id="book.ratings" />
      </h2>
      <ul className="space-y-1.5 text-sm">
        {([5, 4, 3, 2, 1] as const).map((stars) => {
          const count = counts[stars - 1] ?? 0;
          const share = total > 0 ? count / total : 0;
          return (
            <li key={stars} className="grid grid-cols-[4.5rem_1fr_6.5rem] items-center gap-3">
              <span className="whitespace-nowrap">
                <FormattedMessage id="book.ratings.stars" values={{ stars }} />
              </span>
              <span aria-hidden className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <span className="block h-full rounded-full bg-amber-400" style={{ width: `${String(share * 100)}%` }} />
              </span>
              <span className="text-right whitespace-nowrap text-slate-500 tabular-nums dark:text-slate-400">
                {intl.formatNumber(count)} ({intl.formatNumber(share, { style: 'percent' })})
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
