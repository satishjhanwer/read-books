import * as z from 'zod/mini';

import type { BookSummary } from '../../api/types';

// The reading list lives in localStorage, per browser. A tiny external store (read through
// useSyncExternalStore) keeps every card, the header badge and the list page in sync, and the
// `storage` event keeps other open tabs in sync too.

export const STORAGE_KEY = 'read-books:list:v1';
export const SHELVES = ['want', 'reading', 'read'] as const;
export type Shelf = (typeof SHELVES)[number];
export const isShelf = (value: unknown): value is Shelf => SHELVES.some((shelf) => shelf === value);

export interface ReadingListEntry {
  book: BookSummary;
  shelf: Shelf;
  /** ISO timestamps; `updatedAt` decides which copy wins when importing. */
  addedAt: string;
  updatedAt: string;
}

/** bookId -> entry */
export type ReadingList = Readonly<Record<string, ReadingListEntry>>;

// Stored data and imported files are untrusted: validate every entry and drop the ones that don't fit.
const bookSchema = z.object({
  id: z.string().check(z.regex(/^OL\d+W$/)),
  title: z.string(),
  authors: z.array(z.object({ id: z.string().check(z.regex(/^OL\d+A$/)), name: z.optional(z.string()) })),
  coverId: z.optional(z.number()),
  firstPublishYear: z.optional(z.number()),
  editionCount: z.optional(z.number()),
  rating: z.optional(z.object({ average: z.number(), count: z.number() })),
});

const entrySchema = z.object({
  book: bookSchema,
  shelf: z.enum(SHELVES),
  addedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const fileSchema = z.object({
  app: z.literal('read-books'),
  version: z.literal(1),
  entries: z.array(z.unknown()),
});

function toList(rawEntries: unknown[]): { list: Record<string, ReadingListEntry>; skipped: number } {
  const list: Record<string, ReadingListEntry> = {};
  let skipped = 0;
  for (const raw of rawEntries) {
    const parsed = entrySchema.safeParse(raw);
    if (parsed.success) list[parsed.data.book.id] = parsed.data;
    else skipped += 1;
  }
  return { list, skipped };
}

function load(): ReadingList {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? toList(data).list : {};
  } catch {
    return {};
  }
}

let snapshot: ReadingList | undefined;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) {
    snapshot = load();
    notify();
  }
}

export function getSnapshot(): ReadingList {
  snapshot ??= load();
  return snapshot;
}

export function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

function commit(next: ReadingList) {
  snapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.values(next)));
  } catch {
    // Storage full or blocked: the list still works for this session.
  }
  notify();
}

export function setShelf(book: BookSummary, shelf: Shelf, now = new Date()): void {
  const current = getSnapshot()[book.id];
  const timestamp = now.toISOString();
  commit({
    ...getSnapshot(),
    // Refresh the stored summary too, so title/cover/rating stay current.
    [book.id]: { book, shelf, addedAt: current?.addedAt ?? timestamp, updatedAt: timestamp },
  });
}

export function removeBook(bookId: string): void {
  const next = { ...getSnapshot() };
  if (!(bookId in next)) return;
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- keyed by book id
  delete next[bookId];
  commit(next);
}

/** Entries newest-first. */
export function sortedEntries(list: ReadingList): ReadingListEntry[] {
  return Object.values(list).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function exportList(list: ReadingList, now = new Date()): string {
  return JSON.stringify(
    { app: 'read-books', version: 1, exportedAt: now.toISOString(), entries: sortedEntries(list) },
    null,
    2,
  );
}

export type ImportResult = { ok: true; imported: number; skipped: number } | { ok: false };

/** Merges an exported file into the list. For books in both, the more recently updated entry wins. */
export function importList(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false };
  }
  const file = fileSchema.safeParse(data);
  if (!file.success) return { ok: false };

  const { list: incoming, skipped } = toList(file.data.entries);
  const merged: Record<string, ReadingListEntry> = { ...getSnapshot() };
  let imported = 0;
  for (const entry of Object.values(incoming)) {
    const existing = merged[entry.book.id];
    if (!existing || entry.updatedAt > existing.updatedAt) {
      merged[entry.book.id] = entry;
      imported += 1;
    }
  }
  if (imported > 0) commit(merged);
  return { ok: true, imported, skipped };
}

/** Test helper: forget the cached snapshot so the next read comes from localStorage. */
export function resetForTests(): void {
  snapshot = undefined;
}
