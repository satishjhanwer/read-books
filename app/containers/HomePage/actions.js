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

/**
 *
 * @param {string} searchTerm The new text of input field
 *
 * @return {object} An action object with a type of CHANGE_SEARCH_TERM
 */
export function changeSearchTerm(searchTerm) {
  return { type: CHANGE_SEARCH_TERM, searchTerm };
}

/**
 *
 * @param {string} searchTerm The new text of input field
 *
 * @return {object} An action object with a type of BOOK_SEARCH_REQUEST
 */
export function requestBookSearch() {
  return { type: BOOK_SEARCH_REQUEST };
}

/**
 *
 * @param {Array} bookList List of books searched by search term
 *
 * @return {object} An action object with a type of BOOK_SEARCH_SUCCESS
 */
export function requestBookSearchSuccess(bookList) {
  return { type: BOOK_SEARCH_SUCCESS, bookList };
}

/**
 *
 * @param {string} message error message
 *
 * @return {object} An action object with a type of BOOK_SEARCH_FAILURE
 */
export function requestBookSearchFailure(message) {
  return { type: BOOK_SEARCH_FAILURE, message };
}
