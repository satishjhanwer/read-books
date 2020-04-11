import { requestBookInfo } from '../actions';
import { BOOK_INFO_REQUEST } from '../constants';

describe('BookDetails Actions', () => {
  describe('requestBookInfo', () => {
    it('should return the correct type and the passed id', () => {
      const fixture = 1223;
      const expected = {
        type: BOOK_INFO_REQUEST,
        id: fixture,
      };
      expect(requestBookInfo(fixture)).toEqual(expected);
    });
  });
});
