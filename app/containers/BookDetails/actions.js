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

/**
 *
 * @param {string} id Requested book id
 *
 * @return {object} An action object with a type of BOOK_INFO_REQUEST
 */
export function requestBookInfo(id) {
  return { type: BOOK_INFO_REQUEST, id };
}

/**
 *
 * @param {object} book Returned Book object based on book id
 *
 * @return {object} An action object with a type of BOOK_INFO_SUCCESS
 */
export function requestBookInfoSuccess(book) {
  return { type: BOOK_INFO_SUCCESS, book };
}

/**
 *
 * @param {string} message error message
 *
 * @return {object} An action object with a type of BOOK_INFO_FAILURE
 */
export function requestBookInfoFailure(message) {
  return { type: BOOK_INFO_FAILURE, message };
}
