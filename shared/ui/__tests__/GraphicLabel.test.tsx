import { render, screen } from '@testing-library/react';
import GraphicLabel from '../GraphicLabel';

describe('GraphicLabel', () => {
  it('renders icon above the message', () => {
    render(
      <GraphicLabel
        icon={<span data-testid="graphic-icon">Icon</span>}
        message="Mi mensaje"
      />,
    );

    expect(screen.getByTestId('graphic-icon')).toBeInTheDocument();
    expect(screen.getByText('Mi mensaje')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <GraphicLabel
        icon={<span data-testid="graphic-icon">Icon</span>}
        message="Mi mensaje"
        className="custom-class"
      />,
    );

    const messageElement = screen.getByText('Mi mensaje');
    expect(messageElement.parentElement).toHaveClass('custom-class');
  });
});
