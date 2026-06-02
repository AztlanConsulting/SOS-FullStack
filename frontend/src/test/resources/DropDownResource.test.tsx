import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DropDown from '@shared/components/ui/DropDownResource';

describe('DropDownResource', () => {
  it('renders sorting and type sections and updates selections', () => {
    const setSortOption = vi.fn();
    const setTypeOption = vi.fn();

    render(
      <DropDown
        isOpen
        sortHook={['Nombre (A-Z)', setSortOption]}
        typeHook={['Todos', setTypeOption]}
      />,
    );

    expect(screen.getByText('Ordenar')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('radio', { name: 'Precio: mayor a menor' }),
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Manual' }));

    expect(setSortOption).toHaveBeenCalledWith('Precio: mayor a menor');
    expect(setTypeOption).toHaveBeenCalledWith('Manual');
  });

  it('hides price options when onlyAlphabetic is true', () => {
    const setSortOption = vi.fn();
    const setTypeOption = vi.fn();

    render(
      <DropDown
        isOpen
        sortHook={['Nombre (A-Z)', setSortOption]}
        typeHook={['Todos', setTypeOption]}
        onlyAlphabetic
      />,
    );

    expect(
      screen.getByRole('radio', { name: 'Nombre (A-Z)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Nombre (Z-A)' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('radio', { name: 'Precio: menor a mayor' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('radio', { name: 'Precio: mayor a menor' }),
    ).not.toBeInTheDocument();
  });
});
