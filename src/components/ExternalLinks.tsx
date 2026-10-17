import { ExternalLink } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import type { ExternalLink as Link } from '../api/types';
import { sectionHeadingClass } from './DetailLayout';

const isWebUrl = (url: string) => /^https?:\/\//i.test(url);

/** The record's own links (user-supplied, so only http/https are shown) plus the Open Library page. */
export function ExternalLinks({ links, openLibraryUrl }: { links: Link[]; openLibraryUrl: string }) {
  const items = links.filter((link) => isWebUrl(link.url));

  return (
    <section className="mt-8">
      <h2 className={sectionHeadingClass}>
        <FormattedMessage id="details.links" />
      </h2>
      <ul className="space-y-2 text-sm">
        <li>
          <a
            href={openLibraryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            <FormattedMessage id="details.viewOnOpenLibrary" />
            <ExternalLink aria-hidden className="size-3.5" />
          </a>
        </li>
        {items.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline dark:text-indigo-400">
              {link.title}
              <ExternalLink aria-hidden className="size-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
