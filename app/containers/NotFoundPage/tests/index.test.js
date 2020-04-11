/**
 * Testing the NotFoundPage
 */

/**
 * Test the BookDetails
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';

import NotFound from '../index';
import configureStore from '../../../configureStore';

describe('<NotFound />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

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
