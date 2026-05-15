import { renderHook } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import useGetMembersOnlyContent from '@features/members-only/hooks/useGetMembersOnlyContent';

const { mockUseParams, mockUseLocation, mockUseQuery } = vi.hoisted(() => ({
  mockUseParams: vi.fn(),
  mockUseLocation: vi.fn(),
  mockUseQuery: vi.fn(),
}));

vi.mock('react-router', () => ({
  useParams: mockUseParams,
  useLocation: mockUseLocation,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

const queryFn = vi.fn();

describe('useGetMembersOnlyContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  });

  test('calls scrollTo(0,0) on mount', () => {
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ state: null });
    mockUseQuery.mockReturnValue({ isLoading: false, error: null, data: null });

    renderHook(() => useGetMembersOnlyContent(queryFn));

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('enables query when no state and id exists', () => {
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ state: null });

    renderHook(() => useGetMembersOnlyContent(queryFn));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['membersOnly', '123'],
        enabled: true,
      }),
    );
  });

  test('disables query when state.membersOnly exists', () => {
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ state: { membersOnly: { _id: '1' } } });

    renderHook(() => useGetMembersOnlyContent(queryFn));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });

  test('disables query when id is undefined', () => {
    mockUseParams.mockReturnValue({});
    mockUseLocation.mockReturnValue({ state: null });

    renderHook(() => useGetMembersOnlyContent(queryFn));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });

  test('returns membersOnly from state when available', () => {
    const stateData = { _id: '1', name: 'From State' };
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ state: { membersOnly: stateData } });
    mockUseQuery.mockReturnValue({ isLoading: false, error: null, data: null });

    const { result } = renderHook(() => useGetMembersOnlyContent(queryFn));

    expect(result.current.membersOnly).toEqual(stateData);
  });

  test('returns membersOnly from query data when no state', () => {
    const queryData = { _id: '2', name: 'From Query' };
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ state: null });
    mockUseQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: queryData,
    });

    const { result } = renderHook(() => useGetMembersOnlyContent(queryFn));

    expect(result.current.membersOnly).toEqual(queryData);
  });

  test('exposes isLoading and error from query', () => {
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ state: null });
    mockUseQuery.mockReturnValue({
      isLoading: true,
      error: new Error('fail'),
      data: null,
    });

    const { result } = renderHook(() => useGetMembersOnlyContent(queryFn));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toEqual(new Error('fail'));
  });
});
