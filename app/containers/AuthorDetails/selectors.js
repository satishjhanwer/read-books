import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the authorDetails state domain
 */

const selectAuthorDetailsDomain = state =>
  state.get('authorDetails', initialState);

/**
 * Other specific selectors
 */
const makeSelectAuthorId = () =>
  createSelector(selectAuthorDetailsDomain, subState =>
    subState.get('authorId'),
  );

const makeSelectAuthorInfo = () =>
  createSelector(selectAuthorDetailsDomain, subState =>
    subState.get('authorInfo'),
  );

const makeSelectErrorMessage = () =>
  createSelector(selectAuthorDetailsDomain, subState =>
    subState.get('errorMessage'),
  );
/**
 * Default selector used by AuthorDetails
 */

const makeSelectAuthorDetails = () =>
  createSelector(selectAuthorDetailsDomain, subState => subState.toJS());

export {
  makeSelectAuthorDetails,
  selectAuthorDetailsDomain,
  makeSelectAuthorId,
  makeSelectAuthorInfo,
  makeSelectErrorMessage,
};
