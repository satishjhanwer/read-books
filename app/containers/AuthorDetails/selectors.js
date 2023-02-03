import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAuthorDetails = (state) => state.authorDetails || initialState;

const makeSelectAuthorId = () => createSelector(selectAuthorDetails, (subState) => subState.authorId);

const makeSelectAuthorInfo = () => createSelector(selectAuthorDetails, (subState) => subState.authorInfo);

const makeSelectErrorMessage = () => createSelector(selectAuthorDetails, (subState) => subState.errorMessage);

export { selectAuthorDetails, makeSelectAuthorId, makeSelectAuthorInfo, makeSelectErrorMessage };
