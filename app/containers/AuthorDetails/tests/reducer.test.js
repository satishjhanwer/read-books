import { fromJS } from 'immutable';
import authorDetailsReducer from '../reducer';

describe('authorDetailsReducer', () => {
  it('returns the initial state', () => {
    expect(authorDetailsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
