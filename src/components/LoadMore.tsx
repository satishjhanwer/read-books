import { FormattedMessage } from 'react-intl';

import { LoadError } from './LoadError';
import { buttonClass } from './StatusPage';

interface LoadMoreProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => unknown;
}

/** Footer for infinite lists: "Load more", a retryable error, or an end-of-results note. */
export function LoadMore({ hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage }: LoadMoreProps) {
  return (
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
  );
}
