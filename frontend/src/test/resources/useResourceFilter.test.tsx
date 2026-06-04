import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import useResourceFilter from '@features/resources/hooks/useResourceFilter';

const queryFunction = vi.fn();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useResourceFilter hook', () => {
  it('fetches resources and computes pagination', async () => {
    queryFunction.mockResolvedValue({
      resources: [],
      total: 12,
    });

    const { result } = renderHook(
      () =>
        useResourceFilter(queryFunction, false, 'resources', 'Nombre (A-Z)'),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(queryFunction).toHaveBeenCalledWith(
        1,
        '',
        'Nombre (A-Z)',
        'Todos',
      );
    });

    await waitFor(() => expect(result.current.pages.totalPages).toBe(2));

    expect(result.current.searchHook.sortHook[0]).toBe('Nombre (A-Z)');
    expect(result.current.searchHook.typeHook[0]).toBe('Todos');
    expect(result.current.pages.visiblePages).toEqual([1, 2]);
    expect(result.current.pages.totalPages).toBe(2);
  });

  it('resets page to 1 when search changes', async () => {
    queryFunction.mockResolvedValue({
      resources: [],
      total: 12,
    });

    const { result } = renderHook(
      () =>
        useResourceFilter(queryFunction, false, 'resources', 'Nombre (A-Z)'),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() =>
      expect(queryFunction).toHaveBeenCalledWith(
        1,
        '',
        'Nombre (A-Z)',
        'Todos',
      ),
    );

    queryFunction.mockClear();

    act(() => {
      result.current.searchHook.handleSearch('Luna');
    });

    await waitFor(() => {
      expect(queryFunction).toHaveBeenLastCalledWith(
        1,
        'Luna',
        'Nombre (A-Z)',
        'Todos',
      );
    });
  });
});
