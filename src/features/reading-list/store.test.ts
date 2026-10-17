import type { BookSummary } from '../../api/types';
import {
  STORAGE_KEY,
  exportList,
  getSnapshot,
  importList,
  removeBook,
  resetForTests,
  setShelf,
  sortedEntries,
  subscribe,
} from './store';

const hobbit: BookSummary = {
  id: 'OL27482W',
  title: 'The Hobbit',
  authors: [{ id: 'OL26320A', name: 'J.R.R. Tolkien' }],
  coverId: 14627509,
  firstPublishYear: 1937,
};
const dune: BookSummary = { id: 'OL893414W', title: 'Dune', authors: [{ id: 'OL79034A', name: 'Frank Herbert' }] };

const t1 = new Date('2026-01-01T10:00:00.000Z');
const t2 = new Date('2026-01-02T10:00:00.000Z');

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as unknown;

describe('reading list store', () => {
  it('adds, moves and removes books, persisting to localStorage', () => {
    setShelf(hobbit, 'want', t1);
    expect(getSnapshot()[hobbit.id]).toEqual({
      book: hobbit,
      shelf: 'want',
      addedAt: t1.toISOString(),
      updatedAt: t1.toISOString(),
    });

    setShelf(hobbit, 'read', t2);
    expect(getSnapshot()[hobbit.id]).toMatchObject({
      shelf: 'read',
      addedAt: t1.toISOString(),
      updatedAt: t2.toISOString(),
    });
    expect(stored()).toEqual([getSnapshot()[hobbit.id]]);

    removeBook(hobbit.id);
    expect(getSnapshot()).toEqual({});
    expect(stored()).toEqual([]);
  });

  it('keeps the snapshot reference stable until something changes', () => {
    const before = getSnapshot();
    expect(getSnapshot()).toBe(before);
    removeBook('OL1W'); // not in the list: no change
    expect(getSnapshot()).toBe(before);
    setShelf(dune, 'reading');
    expect(getSnapshot()).not.toBe(before);
  });

  it('notifies subscribers and stops after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    setShelf(dune, 'want');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    removeBook(dune.id);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('loads valid entries from storage and drops corrupt ones', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { book: hobbit, shelf: 'reading', addedAt: t1.toISOString(), updatedAt: t1.toISOString() },
        { book: { ...dune, id: '../evil' }, shelf: 'want', addedAt: t1.toISOString(), updatedAt: t1.toISOString() },
        { book: dune, shelf: 'someday', addedAt: t1.toISOString(), updatedAt: t1.toISOString() },
      ]),
    );
    resetForTests();

    expect(Object.keys(getSnapshot())).toEqual([hobbit.id]);
  });

  it('ignores unreadable storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    resetForTests();
    expect(getSnapshot()).toEqual({});
  });

  it('picks up changes made in another tab', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ book: dune, shelf: 'read', addedAt: t1.toISOString(), updatedAt: t1.toISOString() }]),
    );

    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));

    expect(listener).toHaveBeenCalled();
    expect(getSnapshot()[dune.id]?.shelf).toBe('read');
    unsubscribe();
  });

  it('sorts entries newest first', () => {
    setShelf(hobbit, 'want', t1);
    setShelf(dune, 'want', t2);
    expect(sortedEntries(getSnapshot()).map((entry) => entry.book.title)).toEqual(['Dune', 'The Hobbit']);
  });
});

describe('export / import', () => {
  it('round-trips through an exported file', () => {
    setShelf(hobbit, 'read', t1);
    setShelf(dune, 'reading', t2);
    const file = exportList(getSnapshot(), t2);
    expect(JSON.parse(file)).toMatchObject({ app: 'read-books', version: 1, exportedAt: t2.toISOString() });

    removeBook(hobbit.id);
    removeBook(dune.id);

    expect(importList(file)).toEqual({ ok: true, imported: 2, skipped: 0 });
    expect(getSnapshot()[hobbit.id]?.shelf).toBe('read');
    expect(getSnapshot()[dune.id]?.shelf).toBe('reading');
  });

  it('merges, keeping whichever copy was updated more recently', () => {
    setShelf(hobbit, 'read', t2); // local copy is newer
    setShelf(dune, 'want', t1); // local copy is older
    const file = JSON.stringify({
      app: 'read-books',
      version: 1,
      entries: [
        { book: hobbit, shelf: 'want', addedAt: t1.toISOString(), updatedAt: t1.toISOString() },
        { book: dune, shelf: 'read', addedAt: t1.toISOString(), updatedAt: t2.toISOString() },
        { book: { title: 'broken' }, shelf: 'want' },
      ],
    });

    expect(importList(file)).toEqual({ ok: true, imported: 1, skipped: 1 });
    expect(getSnapshot()[hobbit.id]?.shelf).toBe('read');
    expect(getSnapshot()[dune.id]?.shelf).toBe('read');
  });

  it('rejects files that are not Read Books exports', () => {
    expect(importList('not json')).toEqual({ ok: false });
    expect(importList(JSON.stringify({ app: 'other', version: 1, entries: [] }))).toEqual({ ok: false });
    expect(importList(JSON.stringify([]))).toEqual({ ok: false });
    expect(getSnapshot()).toEqual({});
  });
});
