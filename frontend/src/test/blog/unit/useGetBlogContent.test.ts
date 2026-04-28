import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import useGetBlogContent from '@features/blog/hooks/useGetBlogContent';
import { useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

// Mock React Router hooks to control routing state in tests
vi.mock('react-router', () => ({
  useLocation: vi.fn(),
  useParams: vi.fn(),
}));

// Mock React Query to inspect configuration without real network calls
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useGetBlogContent hook unit tests', () => {
  const queryFunctionMock = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test to avoid shared state
    vi.clearAllMocks();
  });

  /**
   * STATE CASE
   * If blog exists in router state, it should be returned directly
   * without triggering any API request.
   */
  it('returns blog from router state (no fetch)', () => {
    (useLocation as unknown as Mock).mockReturnValue({
      state: {
        blog: { _id: 'b1', name: 'Blog test' },
      },
    });

    (useParams as unknown as Mock).mockReturnValue({
      id: 'b1',
    });

    (useQuery as unknown as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: undefined,
    });

    const { result } = renderHook(() => useGetBlogContent(queryFunctionMock));

    expect(result.current.blog).toEqual({
      _id: 'b1',
      name: 'Blog test',
    });

    expect(queryFunctionMock).not.toHaveBeenCalled();
  });

  /**
   * QUERY ENABLE CASE
   * If there is no blog in state, query should be enabled
   * and executed using the route param id.
   */
  it('enables query when no state blog exists', () => {
    (useLocation as unknown as Mock).mockReturnValue({
      state: null,
    });

    (useParams as unknown as Mock).mockReturnValue({
      id: 'b2',
    });

    (useQuery as unknown as Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: undefined,
    });

    renderHook(() => useGetBlogContent(queryFunctionMock));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['blog', 'b2'],
        enabled: true,
      }),
    );
  });

  /**
   * QUERY DISABLE CASE
   * If blog exists in router state, React Query must be disabled
   * to prevent unnecessary refetching.
   */
  it('disables query when state blog exists', () => {
    (useLocation as unknown as Mock).mockReturnValue({
      state: {
        blog: { _id: 'b1' },
      },
    });

    (useParams as unknown as Mock).mockReturnValue({
      id: 'b1',
    });

    (useQuery as unknown as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: null,
    });

    renderHook(() => useGetBlogContent(queryFunctionMock));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });

  /**
   * SIDE EFFECT CASE
   * Ensures the hook triggers scroll reset on mount.
   */
  it('calls window.scrollTo on mount', () => {
    const scrollMock = vi.fn();
    window.scrollTo = scrollMock;

    (useLocation as unknown as Mock).mockReturnValue({
      state: null,
    });

    (useParams as unknown as Mock).mockReturnValue({
      id: 'b1',
    });

    (useQuery as unknown as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: null,
    });

    renderHook(() => useGetBlogContent(queryFunctionMock));

    expect(scrollMock).toHaveBeenCalledWith(0, 0);
  });
});
