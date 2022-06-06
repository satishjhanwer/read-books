/**
 * Tests from BookDetailsPage sagas
 */

import { takeLatest } from 'redux-saga/effects';
import { BOOK_INFO_REQUEST } from '../constants';
import bookDetailsData, { GetBookInfo } from '../saga';

describe('bookDetailsData Saga', () => {
  const bookDetailsSaga = bookDetailsData();

  it('should start task to watch for BOOK_INFO_REQUEST action', () => {
    const takeLatestDescriptor = bookDetailsSaga.next().value;
    expect(takeLatestDescriptor).toEqual(takeLatest(BOOK_INFO_REQUEST, GetBookInfo));
  });
});
