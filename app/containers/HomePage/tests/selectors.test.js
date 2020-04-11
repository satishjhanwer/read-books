import { selectHome, makeSelectSearchTerm } from '../selectors';

describe('selectHome', () => {
  it('should select the home state', () => {
    const homeState = {
      searchTerm: '',
      errorMessage: undefined,
      bookList: [],
      query: '',
    };
    const mockedState = {
      home: homeState,
    };
    expect(selectHome(mockedState)).toEqual(homeState);
  });
});

describe('makeSelectSearchTerm', () => {
  const usernameSelector = makeSelectSearchTerm();
  it('should select the username', () => {
    const searchTerm = 'harry';
    const mockedState = {
      home: {
        searchTerm,
      },
    };
    expect(usernameSelector(mockedState)).toEqual(searchTerm);
  });
});
