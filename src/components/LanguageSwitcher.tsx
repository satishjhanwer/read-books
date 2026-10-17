import { Languages } from 'lucide-react';
import { useId } from 'react';
import { FormattedMessage } from 'react-intl';

import { useLocale } from '../i18n/LocaleContext';
import { LOCALES, LOCALE_NAMES, isLocale } from '../i18n/messages';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="flex items-center text-slate-500 dark:text-slate-400">
        <Languages aria-hidden className="size-4" />
        <span className="sr-only">
          <FormattedMessage id="language.label" />
        </span>
      </label>
      <select
        id={id}
        value={locale}
        onChange={(event) => {
          if (isLocale(event.target.value)) setLocale(event.target.value);
        }}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900">
        {LOCALES.map((code) => (
          <option key={code} value={code} lang={code}>
            {LOCALE_NAMES[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
