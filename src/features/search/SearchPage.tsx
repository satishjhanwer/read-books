import { FormattedMessage } from 'react-intl';

import { PageTitle } from '../../components/PageTitle';

// Placeholder until phase 4 (search UI).
export default function SearchPage() {
  return (
    <>
      <PageTitle />
      <h1 className="text-2xl font-semibold">
        <FormattedMessage id="search.title" />
      </h1>
    </>
  );
}
