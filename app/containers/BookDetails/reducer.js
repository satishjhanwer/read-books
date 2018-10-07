/*
 *
 * BookDetails reducer
 *
 */

import { fromJS } from 'immutable';
import {
  BOOK_INFO_FAILURE,
  BOOK_INFO_REQUEST,
  BOOK_INFO_SUCCESS,
} from './constants';

export const initialState = fromJS({
  bookId: '',
  errorMessage: undefined,
  book: undefined,
});

function bookDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case BOOK_INFO_REQUEST:
      return state.set('bookId', action.id);
    case BOOK_INFO_SUCCESS:
      return state.set('book', action.book);
    case BOOK_INFO_FAILURE:
      return state.set('errorMessage', action.message);
    default:
      return state;
  }
}

export default bookDetailsReducer;
