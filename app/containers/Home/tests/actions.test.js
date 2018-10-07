import { requestBookSearch } from '../actions';
import { BOOK_SEARCH_REQUEST } from '../constants';

describe('Home actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = { type: BOOK_SEARCH_REQUEST, searchTerm: 'xas' };
      expect(requestBookSearch('xas')).toEqual(expected);
    });
  });
});
