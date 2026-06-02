import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Dispatch, SetStateAction } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ResourceSearch from '@features/resources/components/ResourceSearch';

vi.mock('@shared/components/ui/SearchInput', () => ({
  default: ({ handleSearch }: { handleSearch: (value: string) => void }) => (
    <input
      data-testid="search-input"
      onChange={(event) => handleSearch(event.target.value)}
    />
  ),
}));

vi.mock('@shared/components/ui/DropDownResource', () => ({
  default: ({
    isOpen,
    sortHook,
    typeHook,
  }: {
    isOpen: boolean;
    sortHook: [string, Dispatch<SetStateAction<string>>];
    typeHook: [string, Dispatch<SetStateAction<string>>];
  }) => (
    <div data-testid="dropdown">
      {isOpen ? 'open' : 'closed'}-{sortHook[0]}-{typeHook[0]}
    </div>
  ),
}));

describe('ResourceSearch', () => {
  it('renders the search input and toggles the dropdown', () => {
    const handleSearch = vi.fn();
    const sortSet = vi.fn();
    const typeSet = vi.fn();

    render(
      <ResourceSearch
        searchHook={{
          handleSearch,
          sortHook: ['Nombre (A-Z)', sortSet],
          typeHook: ['Todos', typeSet],
        }}
      />,
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown')).toHaveTextContent('closed');

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('dropdown')).toHaveTextContent('open');

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'perro' },
    });

    expect(handleSearch).toHaveBeenCalledWith('perro');
  });
});
