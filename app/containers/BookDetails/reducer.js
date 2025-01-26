/*
 *
 * BookDetails reducer
 *
 */

import produce from 'immer';
import { BOOK_INFO_FAILURE, BOOK_INFO_REQUEST, BOOK_INFO_SUCCESS } from './constants';

export const initialState = {
  bookId: '',
  errorMessage: undefined,
  book: undefined,
};

/* eslint-disable default-case, no-param-reassign */
const bookDetailsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case BOOK_INFO_REQUEST:
        draft.bookId = action.id;
        break;
      case BOOK_INFO_SUCCESS:
        draft.book = action.book;
        break;
      case BOOK_INFO_FAILURE:
        draft.errorMessage = action.message;
        break;
    }
  });

export default bookDetailsReducer;
