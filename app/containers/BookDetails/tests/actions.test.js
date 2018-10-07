import { requestBookInfo } from '../actions';
import { BOOK_INFO_REQUEST } from '../constants';

describe('BookDetails actions', () => {
  describe('Book Info Request', () => {
    it('has a type of BOOK_INFO_REQUEST', () => {
      const expected = { type: BOOK_INFO_REQUEST, id: 1233 };
      expect(requestBookInfo(1233)).toEqual(expected);
    });
  });
});
