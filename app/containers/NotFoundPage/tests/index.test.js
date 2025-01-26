/**
 * Testing the NotFoundPage
 */

/**
 * Test the BookDetails
 */

import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import NotFound from '../index';

describe('<NotFound />', () => {
  let store;

  it('should render the Page Not Found text', () => {
    const component = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NotFound />
        </IntlProvider>
      </Provider>,
    );
    expect(component).toMatchSnapshot();
  });
});
