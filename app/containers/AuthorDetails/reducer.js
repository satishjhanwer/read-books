/*
 *
 * AuthorDetails reducer
 *
 */

import { fromJS } from 'immutable';
import {
  AUTHOR_INFO_FAILURE,
  AUTHOR_INFO_SUCCESS,
  AUTHOR_INFO_REQUEST,
} from './constants';

export const initialState = fromJS({
  authorId: '',
  errorMessage: undefined,
  authorInfo: undefined,
});

function authorDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHOR_INFO_REQUEST:
      return state.set('authorId', action.id);
    case AUTHOR_INFO_SUCCESS:
      return state.set('authorInfo', action.authorInfo);
    case AUTHOR_INFO_FAILURE:
      return state.set('errorMessage', action.message);
    default:
      return state;
  }
}

export default authorDetailsReducer;
