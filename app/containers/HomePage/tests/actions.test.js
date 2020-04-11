import { BOOK_SEARCH_REQUEST } from '../constants';
import { requestBookSearch } from '../actions';

describe('Home Actions', () => {
  describe('requestBookSearch', () => {
    it('should return the correct type and the passed name', () => {
      const expected = {
        type: BOOK_SEARCH_REQUEST,
      };
      expect(requestBookSearch()).toEqual(expected);
    });
  });
});
