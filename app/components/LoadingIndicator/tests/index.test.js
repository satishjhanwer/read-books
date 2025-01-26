import React from 'react';
import LoadingIndicator from '../index';
import { render } from '@testing-library/react';

describe('<LoadingIndicator />', () => {
  it('should match the snapshot', () => {
    const renderedComponent = render(<LoadingIndicator />);
    expect(renderedComponent).toMatchSnapshot();
  });
});
