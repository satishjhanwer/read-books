import { authorInfoRequest } from '../actions';
import { AUTHOR_INFO_REQUEST } from '../constants';

describe('AuthorDetails Actions', () => {
  describe('authorInfoRequest', () => {
    it('should return the correct type and the passed id', () => {
      const fixture = 1223;
      const expected = {
        type: AUTHOR_INFO_REQUEST,
        id: fixture,
      };
      expect(authorInfoRequest(fixture)).toEqual(expected);
    });
  });
});
