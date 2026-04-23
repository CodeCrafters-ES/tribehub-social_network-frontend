import { render, screen, fireEvent } from '@testing-library/react';
import InterestsSelector from '@/components/onboarding/InterestsSelector';
import * as interestsApi from '@/lib/api/interests';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@/lib/api/interests', () => ({
  listInterests: jest.fn().mockResolvedValue([
    { id: '1', name: 'Tech' },
    { id: '2', name: 'Sports' },
    { id: '3', name: 'Music' },
  ]),
  getMyInterests: jest.fn().mockResolvedValue([]),
  setMyInterests: jest.fn().mockResolvedValue(undefined),
}));

describe('InterestsSelector', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('renders and selects interests', async () => {
    render(<InterestsSelector />);

    const tech = await screen.findByText('Tech');

    fireEvent.click(tech);

    expect(tech).toBeInTheDocument();
  });

  it('disables button if less than 3 selected', async () => {
    render(<InterestsSelector />);

    const btn = await screen.findByText('Guardar y continuar');

    expect(btn).toBeDisabled();
  });

  it('enables button when 3 interests selected', async () => {
    render(<InterestsSelector />);

    const tech = await screen.findByText('Tech');
    const sports = await screen.findByText('Sports');
    const music = await screen.findByText('Music');

    fireEvent.click(tech);
    fireEvent.click(sports);
    fireEvent.click(music);

    const btn = screen.getByText('Guardar y continuar');

    expect(btn).not.toBeDisabled();
  });

  it('calls API and redirects on save', async () => {
    render(<InterestsSelector />);

    const tech = await screen.findByText('Tech');
    const sports = await screen.findByText('Sports');
    const music = await screen.findByText('Music');

    fireEvent.click(tech);
    fireEvent.click(sports);
    fireEvent.click(music);

    const btn = screen.getByText('Guardar y continuar');

    fireEvent.click(btn);

    await screen.findByText('Guardar y continuar');

    expect(interestsApi.setMyInterests).toHaveBeenCalledWith(['1', '2', '3']);
    expect(pushMock).toHaveBeenCalledWith('/feed');
  });
});
