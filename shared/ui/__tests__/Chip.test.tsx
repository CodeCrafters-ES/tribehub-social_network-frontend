import { render, screen, fireEvent } from '@testing-library/react';
import Chip from '../Chip';

describe('Chip', () => {
  it('renders with label', () => {
    render(<Chip label="Test Label" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders as button when onClick is provided', () => {
    const mockOnClick = jest.fn();
    render(<Chip label="Clickable" onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Clickable');
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Chip label="Click Me" onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when selected is true', () => {
    render(<Chip label="Selected" selected={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-rose-200', 'text-rose-900');
  });

  it('applies normal styles when selected is false', () => {
    render(<Chip label="Normal" selected={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-rose-100', 'text-rose-900');
  });

  it('applies indigo color styles when color is indigo', () => {
    render(<Chip label="Indigo Normal" color="indigo" selected={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-rose-100', 'text-rose-900');
  });

  it('applies indigo selected styles when color is indigo and selected', () => {
    render(<Chip label="Indigo Selected" color="indigo" selected={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-rose-500', 'text-white');
  });

  it('has correct base classes', () => {
    render(<Chip label="Base Classes" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'px-3',
      'py-1',
      'rounded-full',
      'transition',
      'font-medium',
      'text-nowrap',
    );
  });
});
