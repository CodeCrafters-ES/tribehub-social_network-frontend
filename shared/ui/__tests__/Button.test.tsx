import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click Me</Button>);

    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>Click Me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnClick = jest.fn();
    render(
      <Button onClick={mockOnClick} disabled>
        Disabled
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('is disabled when isLoading is true', () => {
    const mockOnClick = jest.fn();
    render(
      <Button onClick={mockOnClick} isLoading>
        Loading
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loadingContent when isLoading is true and loadingContent is provided', () => {
    render(
      <Button isLoading loadingContent="Loading...">
        Normal
      </Button>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Normal')).not.toBeInTheDocument();
  });

  it('shows children when isLoading is true but no loadingContent', () => {
    render(<Button isLoading>Normal</Button>);

    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('renders leftIcon when provided', () => {
    const mockIcon = <span data-testid="left-icon">Icon</span>;
    render(<Button leftIcon={mockIcon}>With Icon</Button>);

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders rightIcon when provided', () => {
    const mockIcon = <span data-testid="right-icon">Icon</span>;
    render(<Button rightIcon={mockIcon}>With Icon</Button>);

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders only icon when iconOnly is true', () => {
    const mockIcon = <span data-testid="only-icon">Icon</span>;
    render(<Button rightIcon={mockIcon} iconOnly />);

    expect(screen.getByTestId('only-icon')).toBeInTheDocument();
    expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
  });

  it('clones icon with size 20', () => {
    const TestIcon: React.FC<
      { size?: number } & React.HTMLAttributes<HTMLSpanElement>
    > = (props) => <span {...props}>Icon</span>;
    const mockIcon = <TestIcon data-testid="icon" />;
    render(<Button leftIcon={mockIcon}>With Icon</Button>);

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('size', '20');
  });

  it('applies correct base classes', () => {
    render(<Button>Base Classes</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'w-full',
      'flex',
      'items-center',
      'justify-center',
      'gap-2',
      'rounded-xl',
      'bg-rose-500',
      'px-4',
      'py-3.5',
      'text-sm',
      'font-bold',
      'text-white',
      'transition',
      'duration-150',
      'min-h-12',
      'max-h-12',
    );
  });

  it('applies hover classes when not disabled', () => {
    render(<Button>Hover</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'enabled:hover:bg-rose-600',
      'enabled:hover:cursor-pointer',
    );
  });

  it('applies disabled classes when disabled', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'disabled:opacity-40',
      'disabled:cursor-default',
    );
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes other props to button element', () => {
    render(
      <Button type="submit" data-testid="submit-button">
        Submit
      </Button>,
    );

    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
