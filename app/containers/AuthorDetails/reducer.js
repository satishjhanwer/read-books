/*
 *
 * AuthorDetails reducer
 *
 */

import { produce } from 'immer';
import { AUTHOR_INFO_FAILURE, AUTHOR_INFO_SUCCESS, AUTHOR_INFO_REQUEST } from './constants';

export const initialState = {
  authorId: '',
  errorMessage: undefined,
  authorInfo: undefined,
};

 
const authorDetailsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case AUTHOR_INFO_REQUEST:
        draft.authorId = action.id;
        break;
      case AUTHOR_INFO_SUCCESS:
        draft.authorInfo = action.authorInfo;
        break;
      case AUTHOR_INFO_FAILURE:
        draft.errorMessage = action.message;
        break;
    }
  });

export default authorDetailsReducer;
