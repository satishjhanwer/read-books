import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'reduxjs-toolkit-persist';

const initialState = {
  bookList: [],
  searchTerm: '',
  errorMessage: undefined,
};

const homePageSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    changeSearchTerm(state, action) {
      const { searchTerm } = action;
      state.searchTerm = searchTerm;
    },
    requestBookSearchFailure(state, action) {
      const { message } = action;
      state.errorMessage = message;
    },
    requestBookSearchSuccess(state, action) {
      const { bookList } = action;
      state.errorMessage = '';
      state.bookList = [...bookList];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

const { actions, reducer } = homePageSlice;

export const { changeSearchTerm, requestBookSearchFailure, requestBookSearchSuccess } = actions;

export default reducer;
