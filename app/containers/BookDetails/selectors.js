import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the bookDetails state domain
 */

const selectBookDetailsDomain = state => state.get('bookDetails', initialState);

/**
 * Other specific selectors
 */
const makeSelectBookId = () =>
  createSelector(selectBookDetailsDomain, subState => subState.get('bookId'));

const makeSelectBookInfo = () =>
  createSelector(selectBookDetailsDomain, subState => subState.get('book'));

const makeSelectErrorMessage = () =>
  createSelector(selectBookDetailsDomain, subState =>
    subState.get('errorMessage'),
  );

/**
 * Default selector used by BookDetails
 */

const makeSelectBookDetails = () =>
  createSelector(selectBookDetailsDomain, subState => subState.toJS());

export {
  makeSelectBookDetails,
  selectBookDetailsDomain,
  makeSelectBookInfo,
  makeSelectBookId,
  makeSelectErrorMessage,
};
