import type { z } from 'zod';

import { keyToId, normalizeText } from '../lib/text';
import { authorSchema, ratingsSchema, searchResponseSchema, workSchema, type SearchDoc } from './schemas';
import type { AuthorDetails, AuthorRef, BookDetails, BookPage, BookSummary, Rating } from './types';

export const OPEN_LIBRARY_ORIGIN = 'https://openlibrary.org';
export const COVERS_ORIGIN = 'https://covers.openlibrary.org';
export const PAGE_SIZE = 24;

const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'author_key',
  'cover_i',
  'first_publish_year',
  'edition_count',
  'ratings_average',
  'ratings_count',
].join(',');

const WORK_ID = /^OL\d+W$/;
const AUTHOR_ID = /^OL\d+A$/;

export type ImageSize = 'S' | 'M' | 'L';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const isNotFound = (error: unknown): boolean => error instanceof ApiError && error.status === 404;

async function fetchJson<T extends z.ZodType>(path: string, schema: T, signal?: AbortSignal): Promise<z.infer<T>> {
  const response = await fetch(`${OPEN_LIBRARY_ORIGIN}${path}`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new ApiError(`Open Library request failed: ${String(response.status)} ${path}`, response.status);
  }
  const result = schema.safeParse(await response.json());
  if (!result.success) {
    throw new ApiError(`Unexpected Open Library response for ${path}`, 502);
  }
  return result.data;
}

const positiveId = (ids: number[] | undefined): number | undefined => ids?.find((id) => id > 0);

function toRating(average: number | null | undefined, count: number | undefined): Rating | undefined {
  return average != null && count ? { average, count } : undefined;
}

function toBookSummary(doc: SearchDoc): BookSummary {
  const names = doc.author_name ?? [];
  const authors = (doc.author_key ?? []).map((id, i) => ({ id, name: names[i] }));
  return {
    id: keyToId(doc.key),
    title: doc.title,
    authors,
    coverId: doc.cover_i !== undefined && doc.cover_i > 0 ? doc.cover_i : undefined,
    firstPublishYear: doc.first_publish_year,
    editionCount: doc.edition_count,
    rating: toRating(doc.ratings_average, doc.ratings_count),
  };
}

async function search(params: Record<string, string>, page: number, signal?: AbortSignal): Promise<BookPage> {
  const query = new URLSearchParams({
    ...params,
    page: String(page),
    limit: String(PAGE_SIZE),
    fields: SEARCH_FIELDS,
  });
  const data = await fetchJson(`/search.json?${query.toString()}`, searchResponseSchema, signal);
  return {
    books: data.docs.map(toBookSummary),
    total: data.numFound,
    page,
    hasMore: data.start + data.docs.length < data.numFound,
  };
}

/** Full-text book search. `page` is 1-based. */
export function searchBooks(query: string, page = 1, signal?: AbortSignal): Promise<BookPage> {
  return search({ q: query.trim() }, page, signal);
}

/** An author's books, most-published first. */
export function getAuthorBooks(authorId: string, page = 1, signal?: AbortSignal): Promise<BookPage> {
  assertId(authorId, AUTHOR_ID);
  return search({ author: authorId, sort: 'editions' }, page, signal);
}

export async function getAuthor(authorId: string, signal?: AbortSignal): Promise<AuthorDetails> {
  assertId(authorId, AUTHOR_ID);
  const author = await fetchJson(`/authors/${authorId}.json`, authorSchema, signal);
  return {
    id: authorId,
    name: author.name ?? author.personal_name,
    bio: normalizeText(author.bio),
    birthDate: author.birth_date,
    deathDate: author.death_date,
    photoId: positiveId(author.photos),
    links: author.links ?? [],
    openLibraryUrl: `${OPEN_LIBRARY_ORIGIN}/authors/${authorId}`,
  };
}

/** Work details plus ratings and author names. Ratings and author lookups are best-effort. */
export async function getBook(workId: string, signal?: AbortSignal): Promise<BookDetails> {
  assertId(workId, WORK_ID);
  const [work, ratings] = await Promise.all([
    fetchJson(`/works/${workId}.json`, workSchema, signal),
    fetchJson(`/works/${workId}/ratings.json`, ratingsSchema, signal).catch(() => undefined),
  ]);

  const authorIds = [...new Set((work.authors ?? []).map(({ author }) => keyToId(author.key)))];
  const authors = await Promise.all(
    authorIds.map((id): Promise<AuthorRef> =>
      getAuthor(id, signal).then(
        ({ name }) => ({ id, name }),
        () => ({ id, name: undefined }),
      ),
    ),
  );

  return {
    id: workId,
    title: work.title,
    authors,
    description: normalizeText(work.description),
    subjects: work.subjects ?? [],
    firstPublishDate: work.first_publish_date,
    coverId: positiveId(work.covers),
    rating: toRating(ratings?.summary.average, ratings?.summary.count),
    links: work.links ?? [],
    openLibraryUrl: `${OPEN_LIBRARY_ORIGIN}/works/${workId}`,
  };
}

export function coverUrl(coverId: number, size: ImageSize = 'M'): string {
  return `${COVERS_ORIGIN}/b/id/${String(coverId)}-${size}.jpg`;
}

export function authorPhotoUrl(photoId: number, size: ImageSize = 'M'): string {
  return `${COVERS_ORIGIN}/a/id/${String(photoId)}-${size}.jpg`;
}

/** Rejects malformed IDs from the URL before they reach a request path. */
function assertId(id: string, pattern: RegExp): void {
  if (!pattern.test(id)) throw new ApiError(`Invalid Open Library id: ${id}`, 404);
}
