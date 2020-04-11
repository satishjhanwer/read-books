/*
 * BookDetails Messages
 *
 * This contains all the text for the BookDetails component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.BookDetails';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Book Details',
  },
  by: {
    id: `${scope}.by`,
    defaultMessage: 'By:',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Description',
  },
  isbn: {
    id: `${scope}.isbn`,
    defaultMessage: 'ISBN#',
  },
  publicationYear: {
    id: `${scope}.publicationYear`,
    defaultMessage: 'Publication Year',
  },
  publisher: {
    id: `${scope}.publisher`,
    defaultMessage: 'Publisher',
  },
  format: {
    id: `${scope}.format`,
    defaultMessage: 'Format',
  },
  review: {
    id: `${scope}.review`,
    defaultMessage: 'Total Review',
  },
  rating: {
    id: `${scope}.rating`,
    defaultMessage: 'Average Rating',
  },
});
