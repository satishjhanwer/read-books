/**
 * BookDetails selectors
 */
import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBookDetails = state => state.bookDetails || initialState;

const makeSelectBookId = () =>
  createSelector(
    selectBookDetails,
    bookDetailState => bookDetailState.bookId,
  );

const makeSelectBookInfo = () =>
  createSelector(
    selectBookDetails,
    bookDetailState => bookDetailState.book,
  );

const makeSelectErrorMessage = () =>
  createSelector(
    selectBookDetails,
    bookDetailState => bookDetailState.errorMessage,
  );

export {
  selectBookDetails,
  makeSelectBookInfo,
  makeSelectBookId,
  makeSelectErrorMessage,
};
