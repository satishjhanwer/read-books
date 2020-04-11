/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

// eslint-disable-next-line react/prefer-stateless-function
class NotFound extends React.Component {
  render() {
    return (
      <article>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
      </article>
    );
  }
}

export default NotFound;
