import { selectAuthorDetails, makeSelectAuthorId } from '../selectors';

describe('selectAuthorDetails', () => {
  it('should select the book detail state', () => {
    const authorState = {
      authorId: '',
      errorMessage: undefined,
      authorInfo: undefined,
    };
    const mockedState = {
      authorDetails: authorState,
    };
    expect(selectAuthorDetails(mockedState)).toEqual(authorState);
  });
});

describe('makeSelectAuthorId', () => {
  const authorIdSelector = makeSelectAuthorId();
  it('should select the authorId', () => {
    const authorId = '2324';
    const mockedState = {
      authorDetails: {
        authorId,
      },
    };
    expect(authorIdSelector(mockedState)).toEqual(authorId);
  });
});
