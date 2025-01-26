/**
 * Create the store with dynamic reducers
 */
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';
import createSagaMiddleware from 'redux-saga';
import { createReduxHistoryContext } from 'redux-first-history';
import { persistStore } from 'reduxjs-toolkit-persist';
import { createBrowserHistory } from 'history';

import createReducer from './reducers';

const initialState = {};

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
});

const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

export const store = createStore(
  createReducer(routerReducer),
  initialState,
  composeWithDevToolsDevelopmentOnly(applyMiddleware(...[sagaMiddleware, routerMiddleware])),
);

export const persistor = persistStore(store);
export const history = createReduxHistory(store);
