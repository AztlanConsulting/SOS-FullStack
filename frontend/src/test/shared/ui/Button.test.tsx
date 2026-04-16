import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Button } from '../../../shared/components/ui/Button/Button';

describe('Button component', () => {
  test('renders with the provided label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when the disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders an icon when provided', () => {
    const MockIcon = () => <span data-testid="mock-icon" />;
    render(<Button label="With Icon" icon={MockIcon} />);
    expect(screen.getByTestId('mock-icon')).toBeDefined();
  });

  test('applies variant classes correctly', () => {
    const { rerender } = render(<Button label="Button" variant="primary" />);
    expect(screen.getByRole('button').className).toContain('bg-yellow-400');

    rerender(<Button label="Button" variant="danger" />);
    expect(screen.getByRole('button').className).toContain('bg-[#F5F5F5]');
  });
});
