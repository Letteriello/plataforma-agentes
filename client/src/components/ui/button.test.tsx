import { render } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  it('matches snapshot', () => {
    const { container } = render(<Button>Click</Button>);
    expect(container).toMatchSnapshot();
  });
});
