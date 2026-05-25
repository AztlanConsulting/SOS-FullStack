import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ClientSearch } from '@/features/clients/components/ClientSearch';

describe('ClientSearch (Component Tests)', () => {
  /**
   * Verifies search input renders with placeholder
   */
  test('renders search input with placeholder', () => {
    render(<ClientSearch value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Buscar cliente...')).toBeDefined();
  });

  /**
   * Verifies search input displays current value
   */
  test('displays current value', () => {
    render(<ClientSearch value="Sebastian" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(
      'Buscar cliente...',
    ) as HTMLInputElement;
    expect(input.value).toBe('Sebastian');
  });

  /**
   * Verifies onChange is called when input changes
   */
  test('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<ClientSearch value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar cliente...'), {
      target: { value: 'Jorge' },
    });
    expect(onChange).toHaveBeenCalledWith('Jorge');
  });
});
