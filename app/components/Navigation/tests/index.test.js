import React from 'react';
import { render } from 'react-testing-library';
import Navigation from '../index';

describe('<Navigation />', () => {
  it('should render and match the snapshot', () => {
    const component = render(<Navigation />);
    expect(component).toMatchSnapshot();
  });
});
