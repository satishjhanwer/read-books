import request from 'utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { BOOK_SEARCH_REQUEST } from './constants';
import { makeSelectSearchTerm } from './selectors';
import { requestBookSearchFailure, requestBookSearchSuccess } from './actions';

export function* GetBookSearch() {
  // Select username from store
  const searchTerm = yield select(makeSelectSearchTerm());
  const requestURL = `/api/search?q=${encodeURI(searchTerm)}`;
  try {
    const response = yield call(request, requestURL);
    yield put(requestBookSearchSuccess(response.books));
  } catch (err) {
    yield put(requestBookSearchFailure(err));
  }
}

/**
 * Root saga manages watcher life-cycle
 */
export default function* homePageData() {
  yield takeLatest(BOOK_SEARCH_REQUEST, GetBookSearch);
}
