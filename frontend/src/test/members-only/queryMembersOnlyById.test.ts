import queryMembersOnlyById from '@features/members-only/services/queryMembersOnlyById';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('@shared/utils/axios', () => ({
  default: {
    get: mockGet,
  },
}));

const MOCK_ITEM = {
  _id: '123',
  name: 'Test Resource',
  duration: 10,
  content: 'Content here',
  imageUrl: '/images/test.jpg',
  pdfUrl: '/pdfs/test.pdf',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('queryMembersOnlyById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls GET /members-only with id param', async () => {
    mockGet.mockResolvedValue({ data: { membersOnly: [MOCK_ITEM], total: 1 } });

    await queryMembersOnlyById('123');

    expect(mockGet).toHaveBeenCalledWith('/members-only', {
      params: { id: '123' },
    });
  });

  test('returns the first item when found', async () => {
    mockGet.mockResolvedValue({ data: { membersOnly: [MOCK_ITEM], total: 1 } });

    const result = await queryMembersOnlyById('123');

    expect(result).toEqual(MOCK_ITEM);
  });

  test('throws when membersOnly array is empty', async () => {
    mockGet.mockResolvedValue({ data: { membersOnly: [], total: 0 } });

    await expect(queryMembersOnlyById('123')).rejects.toThrow(
      'Members only content not found',
    );
  });

  test('throws when membersOnly is undefined', async () => {
    mockGet.mockResolvedValue({ data: { total: 0 } });

    await expect(queryMembersOnlyById('123')).rejects.toThrow(
      'Members only content not found',
    );
  });

  test('propagates network errors', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    await expect(queryMembersOnlyById('123')).rejects.toThrow('Network error');
  });
});
