import { render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Page', () => {
  it('debe renderizar el encabezado correctamente', () => {
    render(<Page />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
