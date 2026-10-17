import ReactMarkdown, { type Components } from 'react-markdown';

// Open Library descriptions and bios are user-edited Markdown. react-markdown ignores raw HTML
// and strips unsafe URLs (javascript: etc.) by default; images are dropped to keep layout stable.
const components: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-4 border-slate-300 pl-4 italic dark:border-slate-700">{children}</blockquote>
  ),
  // Headings inside a description shouldn't compete with the page's own heading outline.
  h1: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  h2: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  h3: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  h4: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  h5: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  h6: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  hr: () => <hr className="my-4 border-slate-200 dark:border-slate-800" />,
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="leading-relaxed text-slate-700 dark:text-slate-300">
      <ReactMarkdown components={components} disallowedElements={['img']} unwrapDisallowed={false}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
