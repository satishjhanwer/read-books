import type { ReactNode } from 'react';

/** Centered message block used by the 404 and error pages. */
export function StatusPage({
  code,
  title,
  body,
  action,
}: {
  code?: string;
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-md py-16 text-center">
      {code && <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{code}</p>}
      <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{body}</p>
      <div className="mt-6">{action}</div>
    </section>
  );
}

export const buttonClass =
  'inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
