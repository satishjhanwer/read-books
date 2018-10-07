/*
 *
 * Home reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_SEARCH_TERM,
  BOOK_SEARCH_SUCCESS,
  BOOK_SEARCH_FAILURE,
  BOOK_SEARCH_REQUEST,
} from './constants';

export const initialState = fromJS({
  searchTerm: '',
  errorMessage: undefined,
  bookList: [],
  query: '',
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SEARCH_TERM:
      return state.set('searchTerm', action.searchTerm);
    case BOOK_SEARCH_REQUEST:
      return state.set('query', action.searchTerm);
    case BOOK_SEARCH_FAILURE:
      return state.set('errorMessage', action.message);
    case BOOK_SEARCH_SUCCESS:
      return state.set('errorMessage', '').set('bookList', action.bookList);
    default:
      return state;
  }
}

export default homeReducer;
