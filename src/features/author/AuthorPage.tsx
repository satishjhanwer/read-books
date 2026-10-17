import { useIntl } from 'react-intl';
import { useParams } from 'react-router';

import { PageTitle } from '../../components/PageTitle';

// Placeholder until phase 5 (author details).
export default function AuthorPage() {
  const { authorId } = useParams();
  const title = useIntl().formatMessage({ id: 'author.title' });
  return (
    <>
      <PageTitle title={title} />
      <h1 className="text-2xl font-semibold">
        {title} {authorId}
      </h1>
    </>
  );
}
