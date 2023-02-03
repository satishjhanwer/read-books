/**
 * Test the HomePage
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { HomePage, mapDispatchToProps } from '../index';
import { changeSearchTerm, requestBookSearch } from '../actions';
import { store } from '../../../configureStore';

describe('<HomePage />', () => {
  it('should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <HomePage bookList={[]} />
        </IntlProvider>
      </Provider>,
    );
    expect(firstChild).toMatchSnapshot();
  });

  it('should fetch the book list on mount if a searchTerm exists', () => {
    const submitSpy = jest.fn();
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <HomePage searchTerm="Not Empty" onChangeSearchTerm={() => {}} onSubmitForm={submitSpy} />
        </IntlProvider>
      </Provider>,
    );
    expect(submitSpy).toBeDefined();
  });

  it('should not call onSubmitForm if searchTerm is an empty string', () => {
    const submitSpy = jest.fn();
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <HomePage onChangeSearchTerm={() => {}} onSubmitForm={submitSpy} />
        </IntlProvider>
      </Provider>,
    );
    expect(submitSpy).not.toHaveBeenCalled();
  });

  describe('mapDispatchToProps', () => {
    describe('onChangeSearchTerm', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onChangeSearchTerm).toBeDefined();
      });

      it('should dispatch changeSearchTerm when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const searchTerm = 'harry';
        result.onChangeSearchTerm({ target: { value: searchTerm } });
        expect(dispatch).toHaveBeenCalledWith(changeSearchTerm(searchTerm));
      });
    });

    describe('onSubmitForm', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onSubmitForm).toBeDefined();
      });

      it('should dispatch requestBookSearch when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.onSubmitForm();
        expect(dispatch).toHaveBeenCalledWith(requestBookSearch());
      });

      it('should preventDefault if called with event', () => {
        const preventDefault = jest.fn();
        const result = mapDispatchToProps(() => {});
        const evt = { preventDefault };
        result.onSubmitForm(evt);
        expect(preventDefault).toHaveBeenCalledWith();
      });
    });
  });
});
