import { authorInfoRequest } from '../actions';
import { AUTHOR_INFO_REQUEST } from '../constants';

describe('BookDetails actions', () => {
  describe('Book Info Request', () => {
    it('has a type of AUTHOR_INFO_REQUEST', () => {
      const expected = { type: AUTHOR_INFO_REQUEST, id: 1233 };
      expect(authorInfoRequest(1233)).toEqual(expected);
    });
  });
});
