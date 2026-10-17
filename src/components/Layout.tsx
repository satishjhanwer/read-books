import { BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router';

import { useReadingList } from '../features/reading-list/useReadingList';
import { LanguageSwitcher } from './LanguageSwitcher';
import { OfflineBanner } from './OfflineBanner';
import { ThemeSwitcher } from './ThemeSwitcher';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
    isActive
      ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
  }`;

export function Layout({ children }: { children?: ReactNode }) {
  const savedCount = Object.keys(useReadingList()).length;

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow dark:focus:bg-slate-900">
        <FormattedMessage id="layout.skipToContent" />
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <BookOpen aria-hidden className="size-5 text-indigo-600 dark:text-indigo-400" />
            {/* Icon-only on phones so the nav fits on one line; the name stays available to screen readers. */}
            <span className="max-sm:sr-only">
              <FormattedMessage id="app.name" />
            </span>
          </Link>
          <nav className="flex flex-1 items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <FormattedMessage id="nav.search" />
            </NavLink>
            <NavLink to="/list" className={navLinkClass}>
              <FormattedMessage id="nav.list" />
              {savedCount > 0 && (
                <>
                  <span
                    aria-hidden
                    className="ml-1.5 rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {savedCount}
                  </span>
                  <span className="sr-only">
                    {' ('}
                    <FormattedMessage id="list.countLabel" values={{ count: savedCount }} />
                    {')'}
                  </span>
                </>
              )}
            </NavLink>
          </nav>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
        <OfflineBanner />
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children ?? <Outlet />}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <FormattedMessage
          id="layout.footer"
          values={{
            link: (chunks) => (
              <a
                href="https://openlibrary.org"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                {chunks}
              </a>
            ),
          }}
        />
      </footer>
      <ScrollRestoration />
    </div>
  );
}
