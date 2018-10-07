/*
 *
 * BookDetails actions
 *
 */

import {
  BOOK_INFO_REQUEST,
  BOOK_INFO_SUCCESS,
  BOOK_INFO_FAILURE,
} from './constants';

export function requestBookInfo(id) {
  return { type: BOOK_INFO_REQUEST, id };
}

export function requestBookInfoSuccess(book) {
  return { type: BOOK_INFO_SUCCESS, book };
}

export function requestBookInfoFailure(message) {
  return { type: BOOK_INFO_FAILURE, message };
}
