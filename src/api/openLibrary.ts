import type { z } from 'zod';

import { keyToId, normalizeText } from '../lib/text';
import {
  authorSchema,
  ratingsSchema,
  recordMetaSchema,
  searchResponseSchema,
  workSchema,
  type SearchDoc,
} from './schemas';
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

async function fetchRaw(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${OPEN_LIBRARY_ORIGIN}${path}`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new ApiError(`Open Library request failed: ${String(response.status)} ${path}`, response.status);
  }
  return response.json();
}

function parse<T extends z.ZodType>(schema: T, data: unknown, path: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(`Unexpected Open Library response for ${path}`, 502);
  }
  return result.data;
}

async function fetchJson<T extends z.ZodType>(path: string, schema: T, signal?: AbortSignal): Promise<z.infer<T>> {
  return parse(schema, await fetchRaw(path, signal), path);
}

const RECORD_PATH = /^\/(works\/OL\d+W|authors\/OL\d+A)$/;
const MAX_REDIRECTS = 3;

/**
 * Fetches a work or author record (`/works/OL1W`), following the `/type/redirect` stubs Open Library
 * leaves behind when records are merged. Deleted records (`/type/delete`) are reported as not found.
 */
async function fetchRecord<T extends z.ZodType>(path: string, schema: T, signal?: AbortSignal): Promise<z.infer<T>> {
  let current = path;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const data = await fetchRaw(`${current}.json`, signal);
    const meta = recordMetaSchema.safeParse(data).data;
    const type = meta?.type?.key;

    if (type === '/type/redirect') {
      const location = meta?.location;
      if (!location || !RECORD_PATH.test(location)) throw new ApiError(`Invalid redirect from ${current}`, 502);
      current = location;
      continue;
    }
    if (type === '/type/delete') throw new ApiError(`Open Library record deleted: ${current}`, 404);
    return parse(schema, data, current);
  }
  throw new ApiError(`Too many redirects for ${path}`, 502);
}

const fetchRatings = (workId: string, signal?: AbortSignal) =>
  fetchJson(`/works/${workId}/ratings.json`, ratingsSchema, signal).catch(() => undefined);

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
  const author = await fetchRecord(`/authors/${authorId}`, authorSchema, signal);
  // The canonical id differs from `authorId` when the record was merged into another one.
  const id = keyToId(author.key);
  return {
    id,
    name: author.name ?? author.personal_name,
    bio: normalizeText(author.bio),
    birthDate: author.birth_date,
    deathDate: author.death_date,
    photoId: positiveId(author.photos),
    links: author.links ?? [],
    openLibraryUrl: `${OPEN_LIBRARY_ORIGIN}/authors/${id}`,
  };
}

/**
 * Work details plus ratings and author names. Ratings and author lookups are best-effort.
 * The returned `id` is canonical and differs from `workId` when the work was merged.
 */
export async function getBook(workId: string, signal?: AbortSignal): Promise<BookDetails> {
  assertId(workId, WORK_ID);
  const [work, initialRatings] = await Promise.all([
    fetchRecord(`/works/${workId}`, workSchema, signal),
    fetchRatings(workId, signal),
  ]);
  const id = keyToId(work.key);
  // Ratings live on the canonical work, so fetch them again after a redirect.
  const ratings = id === workId ? initialRatings : await fetchRatings(id, signal);

  const authorIds = [...new Set((work.authors ?? []).map(({ author }) => keyToId(author.key)))];
  const authors = await Promise.all(
    authorIds.map((authorId): Promise<AuthorRef> =>
      getAuthor(authorId, signal).then(
        (author) => ({ id: author.id, name: author.name }),
        () => ({ id: authorId }),
      ),
    ),
  );

  return {
    id,
    title: work.title,
    authors,
    description: normalizeText(work.description),
    subjects: work.subjects ?? [],
    firstPublishDate: work.first_publish_date,
    coverId: positiveId(work.covers),
    rating: toRating(ratings?.summary.average, ratings?.summary.count),
    links: work.links ?? [],
    openLibraryUrl: `${OPEN_LIBRARY_ORIGIN}/works/${id}`,
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
