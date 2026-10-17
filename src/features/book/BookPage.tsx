import { useIntl } from 'react-intl';
import { useParams } from 'react-router';

import { PageTitle } from '../../components/PageTitle';

// Placeholder until phase 5 (book details).
export default function BookPage() {
  const { workId } = useParams();
  const title = useIntl().formatMessage({ id: 'book.title' });
  return (
    <>
      <PageTitle title={title} />
      <h1 className="text-2xl font-semibold">
        {title} {workId}
      </h1>
    </>
  );
}
