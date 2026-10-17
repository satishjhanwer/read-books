import { useIntl } from 'react-intl';

/** Sets the document title. React 19 hoists <title> into <head>. */
export function PageTitle({ title }: { title?: string }) {
  const appName = useIntl().formatMessage({ id: 'app.name' });
  return <title>{title ? `${title} · ${appName}` : appName}</title>;
}
