import { BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router';

import { LanguageSwitcher } from './LanguageSwitcher';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
  }`;

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow dark:focus:bg-slate-900">
        <FormattedMessage id="layout.skipToContent" />
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <BookOpen aria-hidden className="size-5 text-indigo-600 dark:text-indigo-400" />
            <FormattedMessage id="app.name" />
          </Link>
          <nav className="flex-1">
            <NavLink to="/" end className={navLinkClass}>
              <FormattedMessage id="nav.search" />
            </NavLink>
          </nav>
          <LanguageSwitcher />
        </div>
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
