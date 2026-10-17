import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import { LocaleContext } from './LocaleContext';
import { DEFAULT_LOCALE, MESSAGES, isLocale, type Locale } from './messages';

export const LOCALE_STORAGE_KEY = 'read-books:locale';

function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall through.
  }
  const browser = navigator.language.slice(0, 2);
  return isLocale(browser) ? browser : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (next: Locale) => {
        setLocaleState(next);
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, next);
        } catch {
          // Preference just won't persist.
        }
      },
    }),
    [locale],
  );

  return (
    <LocaleContext value={value}>
      <IntlProvider locale={locale} defaultLocale={DEFAULT_LOCALE} messages={MESSAGES[locale]}>
        {children}
      </IntlProvider>
    </LocaleContext>
  );
}
