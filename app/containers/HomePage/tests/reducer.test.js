import { produce } from 'immer';

import homeReducer from '../reducer';
import { changeSearchTerm } from '../actions';

describe('homeReducer', () => {
  let state;
  beforeEach(() => {
    state = {
      searchTerm: '',
      bookList: [],
      errorMessage: undefined,
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(homeReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the changeSearchTerm action correctly', () => {
    const fixture = 'harry';
    const expectedResult = produce(state, (draft) => {
      draft.searchTerm = fixture;
    });

    expect(homeReducer(state, changeSearchTerm(fixture))).toEqual(expectedResult);
  });
});
