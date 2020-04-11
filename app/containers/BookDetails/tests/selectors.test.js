import { selectBookDetails, makeSelectBookId } from '../selectors';

describe('selectBookDetails', () => {
  it('should select the book detail state', () => {
    const bookState = {
      bookId: '',
      errorMessage: undefined,
      book: undefined,
    };
    const mockedState = {
      bookDetails: bookState,
    };
    expect(selectBookDetails(mockedState)).toEqual(bookState);
  });
});

describe('makeSelectBookId', () => {
  const bookIdSelector = makeSelectBookId();
  it('should select the bookId', () => {
    const bookId = '2324';
    const mockedState = {
      bookDetails: {
        bookId,
      },
    };
    expect(bookIdSelector(mockedState)).toEqual(bookId);
  });
});
