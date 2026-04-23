import { Interest } from '../types/interests';

export function groupInterests(interests: Interest[]) {
  return interests.reduce(
    (acc, interest) => {
      if (!acc[interest.category]) {
        acc[interest.category] = [];
      }

      acc[interest.category].push(interest);
      return acc;
    },
    {} as Record<string, Interest[]>,
  );
}
