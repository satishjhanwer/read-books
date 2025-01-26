import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { BOOK_INFO_REQUEST } from './constants';
import { makeSelectBookId } from './selectors';
import { requestBookInfoFailure, requestBookInfoSuccess } from './actions';

export function* GetBookInfo() {
  // Select username from store
  const bookId = yield select(makeSelectBookId());
  const requestURL = `/api/book/${bookId}`;
  try {
    const book = yield call(request, requestURL);
    yield put(requestBookInfoSuccess(book));
  } catch (err) {
    yield put(requestBookInfoFailure(err));
  }
}

/**
 * Root saga manages watcher life-cycle
 */
export default function* bookDetailsData() {
  yield takeLatest(BOOK_INFO_REQUEST, GetBookInfo);
}
