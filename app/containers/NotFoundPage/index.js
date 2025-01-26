/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

 
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
