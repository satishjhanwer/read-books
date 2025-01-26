import request from '../../utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { AUTHOR_INFO_REQUEST } from './constants';
import { makeSelectAuthorId } from './selectors';
import { authorInfoFailure, authorInfoSuccess } from './actions';

export function* GetAuthorInfo() {
  // Select username from store
  const authorId = yield select(makeSelectAuthorId());
  const requestURL = `/api/author/${authorId}`;
  try {
    const author = yield call(request, requestURL);
    yield put(authorInfoSuccess(author));
  } catch (err) {
    yield put(authorInfoFailure(err));
  }
}

/**
 * Root saga manages watcher life-cycle
 */
export default function* authorDetailsData() {
  yield takeLatest(AUTHOR_INFO_REQUEST, GetAuthorInfo);
}
