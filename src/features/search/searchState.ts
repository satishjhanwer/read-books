import { BOOK_SORTS, type BookSort } from '../../api/openLibrary';

// Everything the search page shows is driven by the URL, so searches can be shared and Back works.
// `?q=…&type=authors` / `?q=…&subject=…&sort=rating&from=1950&to=1999`. Defaults are left out.

export type SearchType = 'books' | 'authors';

export interface SearchState {
  query: string;
  type: SearchType;
  /** Book-only filters; dropped from the URL on the authors tab. */
  subject?: string;
  sort?: BookSort;
  yearFrom?: number;
  yearTo?: number;
}

export const MIN_QUERY_LENGTH = 2;

export const isSearchable = (query: string) => query.trim().length >= MIN_QUERY_LENGTH;

const isBookSort = (value: string | null): value is BookSort => BOOK_SORTS.some((sort) => sort === value);

/** A 1–4 digit year, or undefined for anything else (including partially typed input). */
export function parseYear(value: string | null | undefined): number | undefined {
  return value && /^\d{1,4}$/.test(value.trim()) ? Number(value.trim()) : undefined;
}

export function parseSearchParams(params: URLSearchParams): SearchState {
  const type: SearchType = params.get('type') === 'authors' ? 'authors' : 'books';
  const state: SearchState = { query: (params.get('q') ?? '').trim(), type };
  if (type === 'authors') return state;

  const subject = params.get('subject')?.trim();
  const sort = params.get('sort');
  return {
    ...state,
    subject: subject || undefined,
    sort: isBookSort(sort) ? sort : undefined,
    yearFrom: parseYear(params.get('from')),
    yearTo: parseYear(params.get('to')),
  };
}

export function toSearchParams(state: SearchState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.type === 'authors') {
    params.set('type', 'authors');
    return params;
  }
  if (state.subject) params.set('subject', state.subject);
  if (state.sort) params.set('sort', state.sort);
  if (state.yearFrom !== undefined) params.set('from', String(state.yearFrom));
  if (state.yearTo !== undefined) params.set('to', String(state.yearTo));
  return params;
}

export const hasBookFilters = (state: SearchState) =>
  state.sort !== undefined || state.yearFrom !== undefined || state.yearTo !== undefined;

/** Whether the current state should run a search at all. */
export function isActive(state: SearchState): boolean {
  return state.type === 'authors' ? isSearchable(state.query) : isSearchable(state.query) || !!state.subject;
}

/** `/?subject=Fantasy` — used by subject links on book pages. */
export const subjectSearchUrl = (subject: string) =>
  `/?${toSearchParams({ query: '', type: 'books', subject }).toString()}`;
