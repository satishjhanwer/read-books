/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers } from 'redux';
import { persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage';

// import globalReducer from 'containers/App/reducer';
import languageProviderReducer from './containers/LanguageProvider/reducer';

const persistConfig = {
  key: 'read-book-v1',
  storage,
  blacklist: ['router', 'workflow', 'varEditor'],
};

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(routerReducer) {
  const combinedReducer = combineReducers({
    language: languageProviderReducer,
    router: routerReducer,
  });

  const resetReducer = (state, action) => combinedReducer(action.type === 'LOGOUT_SUCCESS' ? undefined : state, action);

  const rootReducer = persistReducer(persistConfig, resetReducer);

  return persistReducer(persistConfig, rootReducer);
}
