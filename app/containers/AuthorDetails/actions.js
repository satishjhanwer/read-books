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

export function authorInfoRequest(id) {
  return {
    type: AUTHOR_INFO_REQUEST,
    id,
  };
}

export function authorInfoSuccess(authorInfo) {
  return {
    type: AUTHOR_INFO_SUCCESS,
    authorInfo,
  };
}

export function authorInfoFailure(message) {
  return {
    type: AUTHOR_INFO_FAILURE,
    message,
  };
}
