import { getMembersOnlyList } from '@features/members-only/services/membersOnly.service';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('@shared/utils/axios', () => ({
  default: {
    get: mockGet,
  },
}));

const MOCK_RESULT = {
  membersOnly: [
    {
      _id: '1',
      name: 'Test Resource',
      duration: 10,
      content: 'Content here',
      imageUrl: '/images/test.jpg',
      pdfUrl: '/pdfs/test.pdf',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  total: 1,
};

describe('getMembersOnlyList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls GET /members-only with page-1 as param', async () => {
    mockGet.mockResolvedValue({ data: MOCK_RESULT });

    await getMembersOnlyList(1);

    expect(mockGet).toHaveBeenCalledWith('/members-only', {
      params: { page: 0 },
    });
  });

  test('calls GET with page=2 when page=3', async () => {
    mockGet.mockResolvedValue({ data: MOCK_RESULT });

    await getMembersOnlyList(3);

    expect(mockGet).toHaveBeenCalledWith('/members-only', {
      params: { page: 2 },
    });
  });

  test('returns MembersOnlyResult shape on success', async () => {
    mockGet.mockResolvedValue({ data: MOCK_RESULT });

    const result = await getMembersOnlyList(1);

    expect(result).toEqual(MOCK_RESULT);
    expect(result.membersOnly).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  test('propagates axios errors', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    await expect(getMembersOnlyList(1)).rejects.toThrow('Network error');
  });
});
