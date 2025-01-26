/**
 * Tests from AuthorDetailsPage sagas
 */

import { takeLatest } from 'redux-saga/effects';
import { AUTHOR_INFO_REQUEST } from '../constants';
import authorDetailsData, { GetAuthorInfo } from '../saga';

describe('authorDetailsData Saga', () => {
  const authorDetailsSaga = authorDetailsData();

  it('should start task to watch for BOOK_INFO_REQUEST action', () => {
    const takeLatestDescriptor = authorDetailsSaga.next().value;
    expect(takeLatestDescriptor).toEqual(takeLatest(AUTHOR_INFO_REQUEST, GetAuthorInfo));
  });
});
