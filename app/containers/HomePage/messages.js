/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.HomePage';

export default defineMessages({
  inputText: {
    id: `${scope}.inputText`,
    defaultMessage: 'Search',
  },
  searchBtn: {
    id: `${scope}.searchBtn`,
    defaultMessage: 'Search',
  },
  quickView: {
    id: `${scope}.quickView`,
    defaultMessage: 'Quick View',
  },
  reviews: {
    id: `${scope}.reviews`,
    defaultMessage: ' editions in ',
  },
  language: {
    id: `${scope}.language`,
    defaultMessage: ' language',
  },
});
