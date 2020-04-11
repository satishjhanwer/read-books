/*
 *
 * AuthorDetails actions
 *
 */

import {
  AUTHOR_INFO_REQUEST,
  AUTHOR_INFO_SUCCESS,
  AUTHOR_INFO_FAILURE,
} from './constants';

/**
 *
 * @param {string} id Requested author id
 *
 * @return {object} An action object with a type of AUTHOR_INFO_REQUEST
 */
export function authorInfoRequest(id) {
  return {
    type: AUTHOR_INFO_REQUEST,
    id,
  };
}

/**
 *
 * @param {object} authorInfo Returned Author object based on author id
 *
 * @return {object} An action object with a type of AUTHOR_INFO_SUCCESS
 */
export function authorInfoSuccess(authorInfo) {
  return {
    type: AUTHOR_INFO_SUCCESS,
    authorInfo,
  };
}

/**
 *
 * @param {string} message error message
 *
 * @return {object} An action object with a type of AUTHOR_INFO_FAILURE
 */
export function authorInfoFailure(message) {
  return {
    type: AUTHOR_INFO_FAILURE,
    message,
  };
}
