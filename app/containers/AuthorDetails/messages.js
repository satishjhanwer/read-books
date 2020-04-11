/*
 * AuthorDetails Messages
 *
 * This contains all the text for the AuthorDetails component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AuthorDetails';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Author Details',
  },
  about: {
    id: `${scope}.about`,
    defaultMessage: 'About',
  },
  fans: {
    id: `${scope}.fans`,
    defaultMessage: 'Total Fans',
  },
  followers: {
    id: `${scope}.followers`,
    defaultMessage: 'Total Followers',
  },
  gender: {
    id: `${scope}.gender`,
    defaultMessage: 'Gender',
  },
  hometown: {
    id: `${scope}.hometown`,
    defaultMessage: 'Hometown',
  },
  born: {
    id: `${scope}.born`,
    defaultMessage: 'Born At',
  },
  died: {
    id: `${scope}.died`,
    defaultMessage: 'Died At',
  },
  books: {
    id: `${scope}.books`,
    defaultMessage: 'Book Published',
  },
});
