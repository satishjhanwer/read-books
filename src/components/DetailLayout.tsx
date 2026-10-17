import type { ReactNode } from 'react';

export const sectionHeadingClass =
  'mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400';

/** Two-column detail layout: image on the left (stacked above on small screens), content on the right. */
export function DetailLayout({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-8 md:grid-cols-[14rem_1fr] lg:grid-cols-[16rem_1fr]">
      <div className="mx-auto w-48 md:mx-0 md:w-full">{aside}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div aria-hidden data-testid="detail-skeleton" className="animate-pulse">
      <DetailLayout aside={<div className="aspect-[2/3] rounded-md bg-slate-200 dark:bg-slate-800" />}>
        <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 space-y-2">
          {[100, 95, 98, 80].map((width) => (
            <div
              key={width}
              className="h-4 rounded bg-slate-200 dark:bg-slate-800"
              style={{ width: `${String(width)}%` }}
            />
          ))}
        </div>
      </DetailLayout>
    </div>
  );
}
