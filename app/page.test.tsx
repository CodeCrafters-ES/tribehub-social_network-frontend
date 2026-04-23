import Page from '../app/page';

const redirectMock = jest.fn();

jest.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => redirectMock(...args),
}));

describe('Page', () => {
  it('redirige a login en la ruta raíz', () => {
    Page();
    expect(redirectMock).toHaveBeenCalledWith('/login');
  });
});
