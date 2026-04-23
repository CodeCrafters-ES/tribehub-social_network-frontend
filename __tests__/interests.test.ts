global.fetch = jest.fn();

import { listInterests } from '@/lib/api/interests';

describe('interests API', () => {
  it('fetches interests', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', name: 'Tech' }],
    });

    const res = await listInterests();

    expect(res).toHaveLength(1);
    expect(fetch).toHaveBeenCalled();
  });
});
