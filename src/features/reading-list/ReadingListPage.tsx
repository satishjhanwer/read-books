import { Download, Upload } from 'lucide-react';
import { useId, useMemo, useState, type ChangeEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useSearchParams } from 'react-router';

import { BookGrid } from '../../components/BookGrid';
import { PageTitle } from '../../components/PageTitle';
import { ShelfSelect } from './ShelfSelect';
import { SHELVES, exportList, importList, isShelf, sortedEntries, type ImportResult, type Shelf } from './store';
import { useReadingList } from './useReadingList';

const secondaryButtonClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800';

function downloadJson(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReadingListPage() {
  const intl = useIntl();
  const importId = useId();
  const list = useReadingList();
  const [params] = useSearchParams();
  const shelfParam = params.get('shelf');
  const shelf = isShelf(shelfParam) ? shelfParam : undefined;
  const [importResult, setImportResult] = useState<ImportResult>();

  const entries = useMemo(() => sortedEntries(list), [list]);
  const shown = shelf ? entries.filter((entry) => entry.shelf === shelf) : entries;
  const counts = useMemo(() => {
    const byShelf: Record<Shelf, number> = { want: 0, reading: 0, read: 0 };
    for (const entry of entries) byShelf[entry.shelf] += 1;
    return byShelf;
  }, [entries]);

  const onImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    setImportResult(importList(await file.text()));
    input.value = ''; // allow importing the same file again
  };

  const tabs: { key: string; to: string; label: string; count: number; active: boolean }[] = [
    { key: 'all', to: '/list', label: intl.formatMessage({ id: 'list.all' }), count: entries.length, active: !shelf },
    ...SHELVES.map((value) => ({
      key: value,
      to: `/list?shelf=${value}`,
      label: intl.formatMessage({ id: `shelf.${value}` }),
      count: counts[value],
      active: shelf === value,
    })),
  ];

  return (
    <>
      <PageTitle title={intl.formatMessage({ id: 'list.title' })} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <FormattedMessage id="list.title" />
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            <FormattedMessage id="list.subtitle" />
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={entries.length === 0}
            onClick={() => {
              const date = new Date().toISOString().slice(0, 10);
              downloadJson(exportList(list), `read-books-list-${date}.json`);
            }}
            className={secondaryButtonClass}>
            <Download aria-hidden className="size-4" />
            <FormattedMessage id="list.export" />
          </button>
          {/* The file input is visually hidden; its label is the visible, focusable button. */}
          <input
            id={importId}
            type="file"
            accept="application/json,.json"
            onChange={(event) => void onImport(event)}
            className="peer sr-only"
          />
          <label
            htmlFor={importId}
            className={`${secondaryButtonClass} peer-focus-visible:outline-2 peer-focus-visible:outline-indigo-600`}>
            <Upload aria-hidden className="size-4" />
            <FormattedMessage id="list.import" />
          </label>
        </div>
      </div>

      <p role="status" className="mt-4 min-h-5 text-sm">
        {importResult &&
          (importResult.ok ? (
            <FormattedMessage
              id="list.import.done"
              values={{ imported: importResult.imported, skipped: importResult.skipped }}
            />
          ) : (
            <span className="text-red-600 dark:text-red-400">
              <FormattedMessage id="list.import.failed" />
            </span>
          ))}
      </p>

      {entries.length === 0 ? (
        <div className="mt-12 text-center">
          <h2 className="text-lg font-semibold">
            <FormattedMessage id="list.empty.title" />
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            <FormattedMessage id="list.empty.body" />
          </p>
        </div>
      ) : (
        <>
          <nav aria-label={intl.formatMessage({ id: 'list.shelves' })} className="mt-4 mb-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                to={tab.to}
                aria-current={tab.active ? 'page' : undefined}
                className={`rounded-full border px-3 py-1 text-sm ${
                  tab.active
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:hover:text-indigo-400'
                }`}>
                {tab.label} <span className={tab.active ? '' : 'text-slate-500 dark:text-slate-400'}>{tab.count}</span>
              </Link>
            ))}
          </nav>

          {shown.length === 0 ? (
            <p className="text-slate-500 italic dark:text-slate-400">
              <FormattedMessage id="list.empty.shelf" />
            </p>
          ) : (
            <BookGrid books={shown.map((entry) => entry.book)} renderFooter={(book) => <ShelfSelect book={book} />} />
          )}
        </>
      )}
    </>
  );
}
