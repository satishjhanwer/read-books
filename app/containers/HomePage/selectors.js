/**
 * HomePage selectors
 */
import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = (state) => state.home || initialState;

const makeSelectBookList = () => createSelector(selectHome, (homeState) => homeState.bookList);

const makeSelectSearchTerm = () => createSelector(selectHome, (homeState) => homeState.searchTerm);

const makeSelectErrorMessage = () => createSelector(selectHome, (homeState) => homeState.errorMessage);

export { selectHome, makeSelectBookList, makeSelectSearchTerm, makeSelectErrorMessage };
