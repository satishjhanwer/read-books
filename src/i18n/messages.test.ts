import de from './de.json';
import en from './en.json';

describe('message catalogs', () => {
  it('de has exactly the same keys as en', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
  });

  it('has no empty translations', () => {
    for (const catalog of [en, de]) {
      for (const value of Object.values(catalog)) expect(value.trim()).not.toBe('');
    }
  });
});
