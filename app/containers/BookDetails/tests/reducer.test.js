import { fromJS } from 'immutable';
import bookDetailsReducer from '../reducer';

describe('bookDetailsReducer', () => {
  it('returns the initial state', () => {
    expect(bookDetailsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
