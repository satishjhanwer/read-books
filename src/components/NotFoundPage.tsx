import { useIntl } from 'react-intl';
import { Link } from 'react-router';

import type { MessageId } from '../i18n/messages';
import { PageTitle } from './PageTitle';
import { StatusPage, buttonClass } from './StatusPage';

interface NotFoundPageProps {
  titleId?: MessageId;
  bodyId?: MessageId;
}

export default function NotFoundPage({ titleId = 'notFound.title', bodyId = 'notFound.body' }: NotFoundPageProps) {
  const intl = useIntl();
  const title = intl.formatMessage({ id: titleId });

  return (
    <>
      <PageTitle title={title} />
      <StatusPage
        code="404"
        title={title}
        body={intl.formatMessage({ id: bodyId })}
        action={
          <Link to="/" className={buttonClass}>
            {intl.formatMessage({ id: 'notFound.home' })}
          </Link>
        }
      />
    </>
  );
}
