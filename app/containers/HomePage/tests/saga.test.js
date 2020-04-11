/**
 * Tests for HomePage sagas
 */

import { takeLatest } from 'redux-saga/effects';
import { BOOK_SEARCH_REQUEST } from '../constants';
import homePageData, { GetBookSearch } from '../saga';

describe('homePageData Saga', () => {
  const homePageSaga = homePageData();

  it('should start task to watch for BOOK_SEARCH_REQUEST action', () => {
    const takeLatestDescriptor = homePageSaga.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(BOOK_SEARCH_REQUEST, GetBookSearch),
    );
  });
});
