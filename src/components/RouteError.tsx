import { useIntl } from 'react-intl';
import { isRouteErrorResponse, useRouteError } from 'react-router';

import { Layout } from './Layout';
import NotFoundPage from './NotFoundPage';
import { PageTitle } from './PageTitle';
import { StatusPage, buttonClass } from './StatusPage';

/** Router errorElement: renders inside the normal layout so navigation keeps working. */
export function RouteError() {
  const error = useRouteError();
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'error.title' });

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Layout>
        <NotFoundPage />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTitle title={title} />
      <StatusPage
        title={title}
        body={intl.formatMessage({ id: 'error.body' })}
        action={
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              window.location.reload();
            }}>
            {intl.formatMessage({ id: 'error.reload' })}
          </button>
        }
      />
    </Layout>
  );
}
