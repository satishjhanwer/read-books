import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { BookSummary } from '../../api/types';
import { renderApp } from '../../test/render';
import { STORAGE_KEY, getSnapshot, setShelf } from './store';

const hobbit: BookSummary = {
  id: 'OL27482W',
  title: 'The Hobbit',
  authors: [{ id: 'OL26320A', name: 'J.R.R. Tolkien' }],
};
const dune: BookSummary = { id: 'OL893414W', title: 'Dune', authors: [{ id: 'OL79034A', name: 'Frank Herbert' }] };

const navLink = () => screen.getByRole('link', { name: /^My list/ });

describe('saving books', () => {
  it('toggles a search result on and off the list from its bookmark', async () => {
    const user = userEvent.setup();
    renderApp('/?q=the%20hobbit');

    const [first] = await screen.findAllByRole('article');
    if (!first) throw new Error('no results');
    const save = within(first).getByRole('button', { name: 'Save “The Hobbit” to your reading list' });
    expect(save).toHaveAttribute('aria-pressed', 'false');

    await user.click(save);
    expect(save).toHaveAttribute('aria-pressed', 'true');
    expect(getSnapshot()['OL27482W']?.shelf).toBe('want');
    expect(navLink()).toHaveTextContent('My list1 (1 book)');
    expect(localStorage.getItem(STORAGE_KEY)).toContain('OL27482W');

    await user.click(save);
    expect(save).toHaveAttribute('aria-pressed', 'false');
    expect(getSnapshot()).toEqual({});
    expect(navLink()).toHaveTextContent(/^My list$/);
  });

  it('sets the shelf from the book page', async () => {
    const user = userEvent.setup();
    renderApp('/book/OL27482W');

    const select = await screen.findByRole('combobox', { name: 'Reading list' });
    expect(select).toHaveValue('none');

    await user.selectOptions(select, 'reading');
    expect(getSnapshot()['OL27482W']).toMatchObject({
      shelf: 'reading',
      book: { id: 'OL27482W', title: 'The Hobbit', firstPublishYear: 1938, coverId: 14627509 },
    });

    await user.selectOptions(select, 'none');
    expect(getSnapshot()).toEqual({});
  });
});

describe('ReadingListPage', () => {
  it('shows an empty state', async () => {
    renderApp('/list');

    expect(await screen.findByRole('heading', { level: 1, name: 'My reading list' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your list is empty' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
    await waitFor(() => {
      expect(document.title).toBe('My reading list · Read Books');
    });
  });

  it('lists saved books, filters by shelf, and moves books between shelves', async () => {
    setShelf(hobbit, 'read', new Date('2026-01-01T00:00:00Z'));
    setShelf(dune, 'want', new Date('2026-01-02T00:00:00Z'));
    const user = userEvent.setup();
    const { router } = renderApp('/list');

    const shelves = within(await screen.findByRole('navigation', { name: 'Shelves' }));
    expect(shelves.getByRole('link', { name: 'All 2' })).toHaveAttribute('aria-current', 'page');
    // Newest first.
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Dune', 'The Hobbit']);

    await user.click(shelves.getByRole('link', { name: 'Read 1' }));
    expect(router.state.location.search).toBe('?shelf=read');
    expect(screen.getAllByRole('article')).toHaveLength(1);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Reading list status for “The Hobbit”' }), 'reading');
    expect(await screen.findByText('No books on this shelf yet.')).toBeInTheDocument();
    expect(shelves.getByRole('link', { name: 'Reading 1' })).toBeInTheDocument();
  });

  it('exports the list as a JSON download', async () => {
    setShelf(hobbit, 'read');
    const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:list');
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const user = userEvent.setup();
    renderApp('/list');

    await user.click(await screen.findByRole('button', { name: 'Export' }));

    expect(click).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0]?.[0];
    const file = JSON.parse((await blob?.text()) ?? '') as { app: string; entries: { book: BookSummary }[] };
    expect(file.app).toBe('read-books');
    expect(file.entries.map((entry) => entry.book.id)).toEqual(['OL27482W']);
  });

  it('imports a file and reports the result', async () => {
    const user = userEvent.setup();
    const { container } = renderApp('/list');
    await screen.findByRole('heading', { level: 1, name: 'My reading list' });
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) throw new Error('no file input');
    expect(screen.getByLabelText('Import')).toBe(input);

    const exported = JSON.stringify({
      app: 'read-books',
      version: 1,
      entries: [
        { book: dune, shelf: 'reading', addedAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
      ],
    });
    await user.upload(input, new File([exported], 'list.json', { type: 'application/json' }));

    expect(await screen.findByText('Imported 1 book.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Dune' })).toBeInTheDocument();

    await user.upload(input, new File(['nope'], 'bad.json', { type: 'application/json' }));
    expect(await screen.findByText('That file isn’t a Read Books export.')).toBeInTheDocument();
  });
});
