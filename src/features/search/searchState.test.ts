import {
  hasBookFilters,
  isActive,
  parseSearchParams,
  parseYear,
  subjectSearchUrl,
  toSearchParams,
  type SearchState,
} from './searchState';

const parse = (search: string) => parseSearchParams(new URLSearchParams(search));

describe('search URL state', () => {
  it('parses an empty URL to the defaults', () => {
    expect(parse('')).toEqual({ query: '', type: 'books' });
  });

  it('parses book filters', () => {
    expect(parse('q=+dune+&subject=Science+fiction&sort=rating&from=1960&to=1970')).toEqual({
      query: 'dune',
      type: 'books',
      subject: 'Science fiction',
      sort: 'rating',
      yearFrom: 1960,
      yearTo: 1970,
    });
  });

  it('ignores invalid values', () => {
    expect(parse('type=movies&sort=random&from=19x0&to=12345&subject=+')).toEqual({ query: '', type: 'books' });
  });

  it('drops book-only filters on the authors tab', () => {
    expect(parse('q=tolkien&type=authors&sort=rating&subject=Fantasy&from=1900')).toEqual({
      query: 'tolkien',
      type: 'authors',
    });
  });

  it('round-trips through toSearchParams, leaving defaults out', () => {
    const state: SearchState = { query: 'dune', type: 'books', subject: 'Fantasy', sort: 'new', yearFrom: 1965 };
    const params = toSearchParams(state);
    expect(params.toString()).toBe('q=dune&subject=Fantasy&sort=new&from=1965');
    expect(parseSearchParams(params)).toEqual(state);

    expect(toSearchParams({ query: '', type: 'books' }).toString()).toBe('');
    expect(toSearchParams({ query: 'x', type: 'authors', sort: 'rating' }).toString()).toBe('q=x&type=authors');
  });

  it('parses years leniently but only whole 1–4 digit numbers', () => {
    expect(parseYear('1999')).toBe(1999);
    expect(parseYear(' 800 ')).toBe(800);
    expect(parseYear('')).toBeUndefined();
    expect(parseYear('19.5')).toBeUndefined();
    expect(parseYear(null)).toBeUndefined();
  });

  it('decides when to search', () => {
    expect(isActive({ query: 'a', type: 'books' })).toBe(false);
    expect(isActive({ query: 'ab', type: 'books' })).toBe(true);
    expect(isActive({ query: '', type: 'books', subject: 'Fantasy' })).toBe(true);
    expect(isActive({ query: '', type: 'authors' })).toBe(false);
    expect(hasBookFilters({ query: '', type: 'books', yearTo: 2000 })).toBe(true);
    expect(hasBookFilters({ query: '', type: 'books', subject: 'Fantasy' })).toBe(false);
  });

  it('builds subject links', () => {
    expect(subjectSearchUrl('Battle of Five Armies')).toBe('/?subject=Battle+of+Five+Armies');
  });
});
