/**
 *
 * Asynchronously loads the component for AuthorDetails
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
