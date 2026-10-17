import { CircleAlert, RotateCw } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { buttonClass } from './StatusPage';

/** Inline error for failed data loads, with a retry action. */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/60 dark:bg-red-950/30">
      <CircleAlert aria-hidden className="size-8 text-red-500" />
      <h2 className="font-semibold">
        <FormattedMessage id="loadError.title" />
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        <FormattedMessage id="loadError.body" />
      </p>
      <button type="button" onClick={onRetry} className={buttonClass}>
        <RotateCw aria-hidden className="size-4" />
        <FormattedMessage id="loadError.retry" />
      </button>
    </div>
  );
}
