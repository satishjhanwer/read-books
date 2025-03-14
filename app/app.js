/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import 'regenerator-runtime';
import FontFaceObserver from 'fontfaceobserver';
import 'sanitize.css/sanitize.css';
import './assets/css/bootstrap.min.css'; // TODO check this
import './assets/css/font-awesome.min.css';

// Import root app
import './global.css';
import App from './containers/App';

// Import Language Provider
import LanguageProvider from './containers/LanguageProvider';

import { history, persistor, store } from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

const openSansObserver = new FontFaceObserver('Open Sans', {});
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

// Create redux store with history
const MOUNT_NODE = document.getElementById('app');
const root = createRoot(MOUNT_NODE);

const render = (messages) => {
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider messages={messages}>
          <Router history={history} basename={process.env.BASE_PATH}>
            <App />
          </Router>
        </LanguageProvider>
      </PersistGate>
    </Provider>,
  );
};

if (module.hot) {
  // Hot re-loadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', './containers/App'], () => {
    render(translationMessages);
  });
}

render(translationMessages);
