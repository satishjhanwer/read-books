import de from './de.json';
import en from './en.json';

export type MessageId = keyof typeof en;

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Display names are written in their own language so users can always find theirs. */
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', de: 'Deutsch' };

// `satisfies` makes the build fail if de.json is missing a key from en.json.
export const MESSAGES: Record<Locale, Record<MessageId, string>> = {
  en,
  de: de satisfies Record<MessageId, string>,
};

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);

// Type-checks message ids passed to <FormattedMessage> and intl.formatMessage.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- react-intl's documented augmentation point
  namespace FormatjsIntl {
    interface Message {
      ids: MessageId;
    }
  }
}
