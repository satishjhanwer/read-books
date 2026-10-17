import { useIntl } from 'react-intl';
import { Link } from 'react-router';

import { PageTitle } from './PageTitle';
import { StatusPage, buttonClass } from './StatusPage';

export default function NotFoundPage() {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'notFound.title' });

  return (
    <>
      <PageTitle title={title} />
      <StatusPage
        code="404"
        title={title}
        body={intl.formatMessage({ id: 'notFound.body' })}
        action={
          <Link to="/" className={buttonClass}>
            {intl.formatMessage({ id: 'notFound.home' })}
          </Link>
        }
      />
    </>
  );
}
