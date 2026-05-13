import { createSearchForm } from '@features/members-only/services/searchForm.service';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock('@shared/utils/axios', () => ({
  default: {
    post: mockPost,
  },
}));

const FORM_DATA = { especie: 'Perro', tamano: 'Mediano' };

const MOCK_RESPONSE = { message: 'Form submitted', data: { id: '1' } };

describe('createSearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('POSTs to /searchform with form data', async () => {
    mockPost.mockResolvedValue({ data: MOCK_RESPONSE });

    await createSearchForm(FORM_DATA);

    expect(mockPost).toHaveBeenCalledWith('/searchform', FORM_DATA);
  });

  test('returns SearchFormResponse on success', async () => {
    mockPost.mockResolvedValue({ data: MOCK_RESPONSE });

    const result = await createSearchForm(FORM_DATA);

    expect(result).toEqual(MOCK_RESPONSE);
    expect(result.message).toBe('Form submitted');
  });

  test('propagates server errors', async () => {
    mockPost.mockRejectedValue(new Error('Server error'));

    await expect(createSearchForm(FORM_DATA)).rejects.toThrow('Server error');
  });
});
