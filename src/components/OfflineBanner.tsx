import { WifiOff } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { FormattedMessage } from 'react-intl';

// navigator.onLine rather than TanStack's onlineManager, which assumes "online" until an event says otherwise
// and so misses a page that was loaded (from the service worker) while already offline.
const isOnline = () => navigator.onLine;
const subscribe = (listener: () => void) => {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
};

/** Explains why new pages don't load while offline, and that recently viewed ones still work. */
export function OfflineBanner() {
  const online = useSyncExternalStore(subscribe, isOnline, () => true);

  return (
    <div role="status">
      {!online && (
        <p className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-center text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <WifiOff aria-hidden className="size-4 shrink-0" />
          <FormattedMessage id="offline.banner" />
        </p>
      )}
    </div>
  );
}
