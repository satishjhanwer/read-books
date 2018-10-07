import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the home state domain
 */

const selectHomeDomain = state => state.get('home', initialState);

/**
 * Other specific selectors
 */
const makeSelectBookList = () =>
  createSelector(selectHomeDomain, subState => subState.get('bookList'));

const makeSelectSearchTerm = () =>
  createSelector(selectHomeDomain, subState => subState.get('searchTerm'));

const makeSelectErrorMessage = () =>
  createSelector(selectHomeDomain, subState => subState.get('errorMessage'));

/**
 * Default selector used by Home
 */

const makeSelectHome = () =>
  createSelector(selectHomeDomain, subState => subState.toJS());

export {
  makeSelectHome,
  selectHomeDomain,
  makeSelectBookList,
  makeSelectSearchTerm,
  makeSelectErrorMessage,
};
