/*
 * HomeReducer
 *
 */

import produce from 'immer';
import { CHANGE_SEARCH_TERM, BOOK_SEARCH_SUCCESS, BOOK_SEARCH_FAILURE } from './constants';

// The initial state of the App
export const initialState = {
  searchTerm: '',
  errorMessage: undefined,
  bookList: [],
};

/* eslint-disable default-case, no-param-reassign */
const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CHANGE_SEARCH_TERM:
        draft.searchTerm = action.searchTerm;
        break;
      case BOOK_SEARCH_FAILURE:
        draft.errorMessage = action.message;
        break;
      case BOOK_SEARCH_SUCCESS:
        draft.errorMessage = '';
        draft.bookList = action.bookList;
        break;
    }
  });

export default homeReducer;
