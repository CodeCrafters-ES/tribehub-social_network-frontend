import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InterestsSelector from '../InterestsSelector';
import {
  listInterests,
  getMyInterests,
  setMyInterests,
  listCategories,
} from '@/lib/api/interests';
import { MOCK_INTERESTS, MOCK_CATEGORIES } from '@/lib/mocks/interests';
import { Interest } from '@/lib/types/interests';

jest.mock('@/lib/api/interests', () => ({
  listInterests: jest.fn(),
  getMyInterests: jest.fn(),
  setMyInterests: jest.fn(),
  listCategories: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/lib/utils/groupInterests', () => ({
  groupInterests: jest.fn((interests: Interest[]) => {
    const grouped: Record<string, Interest[]> = {};
    interests.forEach((interest: Interest) => {
      if (!grouped[interest.category]) {
        grouped[interest.category] = [];
      }
      grouped[interest.category].push(interest);
    });
    return grouped;
  }),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('InterestsSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();

    (listInterests as jest.Mock).mockResolvedValue(MOCK_INTERESTS);
    (getMyInterests as jest.Mock).mockResolvedValue(['1', '2']);
    (listCategories as jest.Mock).mockResolvedValue(MOCK_CATEGORIES);
    (setMyInterests as jest.Mock).mockResolvedValue(undefined);
  });

  describe('1. Loading and Initial State', () => {
    it('1.1 shows loading spinner initially', () => {
      render(<InterestsSelector />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('1.2 loads and displays interests after loading', async () => {
      render(<InterestsSelector />);

      await waitFor(() => {
        expect(listInterests).toHaveBeenCalled();
        expect(getMyInterests).toHaveBeenCalled();
        expect(listCategories).toHaveBeenCalled();
      });

      expect(screen.getByText('Todos')).toBeInTheDocument();
      MOCK_CATEGORIES.forEach((cat) => {
        expect(screen.getByText(cat.label)).toBeInTheDocument();
      });

      MOCK_INTERESTS.forEach((interest) => {
        expect(screen.getByText(interest.name)).toBeInTheDocument();
      });
    });

    it('1.3 displays error message when loading fails', async () => {
      (listInterests as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByText('Oops algo ha salido mal')).toBeInTheDocument();
      });
    });

    it('1.3.1 displays no data message when no interests are returned', async () => {
      (listInterests as jest.Mock).mockResolvedValue([]);
      (getMyInterests as jest.Mock).mockResolvedValue([]);
      (listCategories as jest.Mock).mockResolvedValue(MOCK_CATEGORIES);

      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByText('Oops no hay datos')).toBeInTheDocument();
      });
    });

    it('1.4 displays the instruction text', async () => {
      render(<InterestsSelector />);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Elige al menos 3 intereses para personalizar tu feed',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('2. Filtering', () => {
    it('2.1 filters interests by search query', async () => {
      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar...');
      fireEvent.change(searchInput, { target: { value: 'Pintura' } });

      expect(searchInput).toHaveValue('Pintura');

      await waitFor(() => {
        expect(screen.queryByText('Fotografía')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Pintura')).toBeInTheDocument();
      expect(screen.queryByText('Fotografía')).not.toBeInTheDocument();
    });

    it('2.2 filters interests by category', async () => {
      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByText('Arte y cultura')).toBeInTheDocument();
      });

      const arteCategory = screen.getByText('Arte y cultura');
      fireEvent.click(arteCategory);

      expect(screen.getByText('Pintura')).toBeInTheDocument();
      expect(screen.getByText('Fotografía')).toBeInTheDocument();
      expect(screen.queryByText('Cine')).not.toBeInTheDocument();
    });
  });

  describe('3. Selection and Button State', () => {
    it('3.1 disables save button when less than 3 interests selected', async () => {
      (getMyInterests as jest.Mock).mockResolvedValue(['1']);

      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      const saveButton = screen.getByTestId('save-button');
      expect(saveButton).toBeDisabled();
    });

    it('3.2 enables save button when 3 or more interests selected', async () => {
      (getMyInterests as jest.Mock).mockResolvedValue(['1', '2', '3']);

      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      const saveButton = screen.getByTestId('save-button');
      expect(saveButton).not.toBeDisabled();
    });
  });

  describe('4. Saving', () => {
    it('4.1 calls setMyInterests and navigates to feed on save', async () => {
      (getMyInterests as jest.Mock).mockResolvedValue(['1', '2', '3']);

      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(setMyInterests).toHaveBeenCalledWith(['1', '2', '3']);
        expect(mockPush).toHaveBeenCalledWith('/feed');
      });
    });

    it('4.2 shows error when saving fails', async () => {
      (getMyInterests as jest.Mock).mockResolvedValue(['1', '2', '3']);
      (setMyInterests as jest.Mock).mockRejectedValue(new Error('Save Error'));

      render(<InterestsSelector />);

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText('Error guardando intereses'),
        ).toBeInTheDocument();
      });
    });
  });
});
