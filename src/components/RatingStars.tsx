import { Star } from 'lucide-react';
import { useIntl } from 'react-intl';

import type { Rating } from '../api/types';

export function RatingStars({ rating, className = '' }: { rating: Rating; className?: string }) {
  const intl = useIntl();
  const average = intl.formatNumber(rating.average, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const label = intl.formatMessage({ id: 'rating.label' }, { average, count: rating.count });
  const filled = Math.round(rating.average);

  return (
    <span role="img" aria-label={label} title={label} className={`inline-flex items-center gap-1 ${className}`}>
      <span aria-hidden className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`size-3.5 ${n <= filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
          />
        ))}
      </span>
      <span aria-hidden className="text-xs text-slate-500 dark:text-slate-400">
        {average} ({intl.formatNumber(rating.count, { notation: 'compact' })})
      </span>
    </span>
  );
}
