import { keyToId, normalizeText } from './text';

describe('normalizeText', () => {
  it('accepts plain strings and { value } objects', () => {
    expect(normalizeText('Hello')).toBe('Hello');
    expect(normalizeText({ value: 'Hello' })).toBe('Hello');
  });

  it('trims and normalizes line endings', () => {
    expect(normalizeText('  a\r\n\r\nb  ')).toBe('a\n\nb');
  });

  it('returns undefined for missing or blank text', () => {
    expect(normalizeText(undefined)).toBeUndefined();
    expect(normalizeText('   ')).toBeUndefined();
    expect(normalizeText({ value: '' })).toBeUndefined();
  });
});

describe('keyToId', () => {
  it('strips the path prefix from Open Library keys', () => {
    expect(keyToId('/works/OL27482W')).toBe('OL27482W');
    expect(keyToId('/authors/OL26320A')).toBe('OL26320A');
    expect(keyToId('OL1W')).toBe('OL1W');
  });
});
