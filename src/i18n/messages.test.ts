import { IntlMessageFormat } from 'intl-messageformat';

import { LOCALES, LOCALE_NAMES, MESSAGES } from './messages';

const enKeys = Object.keys(MESSAGES.en).sort();

describe.each(LOCALES)('the %s catalog', (locale) => {
  const catalog = MESSAGES[locale];

  it('has exactly the same keys as en', () => {
    expect(Object.keys(catalog).sort()).toEqual(enKeys);
  });

  it('has no empty translations', () => {
    for (const value of Object.values(catalog)) expect(value.trim()).not.toBe('');
  });

  it('only contains valid ICU messages', () => {
    for (const [id, message] of Object.entries(catalog)) {
      expect(() => new IntlMessageFormat(message, locale), id).not.toThrow();
    }
  });

  it('has a display name', () => {
    expect(LOCALE_NAMES[locale]).toBeTruthy();
  });
});
