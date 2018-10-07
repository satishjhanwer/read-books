/**
 *
 * Asynchronously loads the component for BookDetails
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
