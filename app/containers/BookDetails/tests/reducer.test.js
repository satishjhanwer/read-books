import produce from 'immer';

import bookDetailsReducer from '../reducer';
import { requestBookInfo } from '../actions';

/* eslint-disable default-case, no-param-reassign */
describe('bookDetailsReducer', () => {
  let state;
  beforeEach(() => {
    state = {
      bookId: '',
      errorMessage: undefined,
      book: undefined,
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(bookDetailsReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the requestBookInfo action correctly', () => {
    const fixture = '1234';
    const expectedResult = produce(state, (draft) => {
      draft.bookId = fixture;
    });

    expect(bookDetailsReducer(state, requestBookInfo(fixture))).toEqual(expectedResult);
  });
});
