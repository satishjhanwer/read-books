/*
 *
 * Home actions
 *
 */

import {
  BOOK_SEARCH_REQUEST,
  BOOK_SEARCH_SUCCESS,
  BOOK_SEARCH_FAILURE,
  CHANGE_SEARCH_TERM,
} from './constants';

export function changeSearchTerm(searchTerm) {
  return { type: CHANGE_SEARCH_TERM, searchTerm };
}

export function requestBookSearch(searchTerm) {
  return { type: BOOK_SEARCH_REQUEST, searchTerm };
}

export function requestBookSearchSuccess(bookList) {
  return { type: BOOK_SEARCH_SUCCESS, bookList };
}

export function requestBookSearchFailure(message) {
  return { type: BOOK_SEARCH_FAILURE, message };
}
