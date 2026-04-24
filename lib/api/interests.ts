import {
  MOCK_CATEGORIES,
  MOCK_INTERESTS,
  MOCK_SELECTED,
} from '../mocks/interests';
import { Category, Interest } from '../types/interests';

const getUseMock = () => process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function listInterests(category?: string): Promise<Interest[]> {
  if (getUseMock()) {
    await new Promise((r) => setTimeout(r, 300));

    if (!category) return MOCK_INTERESTS;

    return MOCK_INTERESTS.filter((interest) => interest.category === category);
  }

  const res = await fetch(
    `${API_URL}/interests${category ? `?category=${category}` : ''}`,
    {
      credentials: 'include',
    },
  );

  if (!res.ok) throw new Error('Error fetching interests');
  return res.json();
}

export async function listCategories(): Promise<Category[]> {
  if (getUseMock()) {
    await new Promise((r) => setTimeout(r, 2000));
    return MOCK_CATEGORIES;
  }

  const res = await fetch(`${API_URL}/categories`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Error fetching categories');
  return res.json();
}

export async function getMyInterests(): Promise<string[]> {
  if (getUseMock()) {
    await new Promise((r) => setTimeout(r, 2000));
    return MOCK_SELECTED;
  }

  const res = await fetch(`${API_URL}/users/me/interests`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error fetching my interests');
  return res.json();
}

export async function setMyInterests(interestIds: string[]) {
  if (getUseMock()) {
    await new Promise((r) => setTimeout(r, 2000));

    MOCK_SELECTED.length = 0;
    MOCK_SELECTED.push(...interestIds);

    return;
  }

  const res = await fetch(`${API_URL}/users/me/interests`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ interestIds }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error saving interests: ${text}`);
  }
}
