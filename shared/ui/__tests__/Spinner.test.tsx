import { render, screen } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({ width: '24px', height: '24px' });
    expect(spinner).toHaveClass('text-white');
  });

  it('renders with custom size', () => {
    render(<Spinner size={32} />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('renders with custom color', () => {
    render(<Spinner color="rose-900" />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('text-rose-900');
  });

  it('renders with custom size and color', () => {
    render(<Spinner size={40} color="blue-500" />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveStyle({ width: '40px', height: '40px' });
    expect(spinner).toHaveClass('text-blue-500');
  });
});
