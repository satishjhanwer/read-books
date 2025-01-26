import { produce } from 'immer';

import authorDetailsReducer from '../reducer';
import { authorInfoRequest } from '../actions';

 
describe('authorDetailsReducer', () => {
  let state;
  beforeEach(() => {
    state = {
      authorId: '',
      errorMessage: undefined,
      authorInfo: undefined,
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(authorDetailsReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the authorInfoRequest action correctly', () => {
    const fixture = '1234';
    const expectedResult = produce(state, (draft) => {
      draft.authorId = fixture;
    });

    expect(authorDetailsReducer(state, authorInfoRequest(fixture))).toEqual(expectedResult);
  });
});
