import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useGetResourceContent from '@features/resources/hooks/useGetResourceContent';

const useQueryMock = vi.fn();
const useLocationMock = vi.fn();
const useParamsMock = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}));

vi.mock('react-router', () => ({
  useLocation: () => useLocationMock(),
  useParams: () => useParamsMock(),
}));

describe('useGetResourceContent hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses router state resource without refetching', async () => {
    const resource = {
      _id: 'r1',
      name: 'Recurso 1',
      type: 'Manual',
      price: 50,
      content: [],
      imageUrl: '',
      resourceUrl: '',
    };

    useLocationMock.mockReturnValue({ state: { resource } });
    useParamsMock.mockReturnValue({ id: 'r1' });
    useQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    const queryFunction = vi.fn();
    const { result } = renderHook(() => useGetResourceContent(queryFunction));

    expect(result.current.resource).toEqual(resource);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['resource', 'r1'],
        enabled: false,
      }),
    );
    expect(queryFunction).not.toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('fetches when no state resource exists', async () => {
    const fetchedResource = {
      _id: 'r2',
      name: 'Recurso 2',
      type: 'Taller',
      price: 100,
      content: [],
      imageUrl: '',
      resourceUrl: '',
    };

    useLocationMock.mockReturnValue({ state: null });
    useParamsMock.mockReturnValue({ id: 'r2' });
    useQueryMock.mockImplementation(
      (options: { queryFn: () => Promise<unknown> }) => {
        void options.queryFn();
        return {
          data: fetchedResource,
          isLoading: false,
          error: null,
        };
      },
    );

    const queryFunction = vi.fn().mockResolvedValue(fetchedResource);
    const { result } = renderHook(() => useGetResourceContent(queryFunction));

    await waitFor(() => {
      expect(queryFunction).toHaveBeenCalledWith('r2');
    });

    expect(result.current.resource).toEqual(fetchedResource);
    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['resource', 'r2'],
        enabled: true,
      }),
    );
  });
});
