import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Text } from '../../../shared/components/ui/Text/Text';

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

describe('Text component', () => {
  test('renders children text correctly', () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('renders as the specified HTML element', () => {
    const { container } = render(<Text as="h1">Heading 1</Text>);
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(screen.getByText('Heading 1').tagName).toBe('H1');
  });

  test('applies variant classes correctly', () => {
    render(<Text variant="h1">H1 Text</Text>);
    const textElement = screen.getByText('H1 Text');
    expect(textElement.className).toContain('text-2xl');
  });

  test('applies weight classes correctly', () => {
    render(<Text weight="bold">Bold Text</Text>);
    const textElement = screen.getByText('Bold Text');
    expect(textElement.className).toContain('font-bold');
  });

  test('applies custom className', () => {
    render(<Text className="custom-class">Custom Class</Text>);
    expect(screen.getByText('Custom Class').className).toContain(
      'custom-class',
    );
  });

  test('applies custom color class', () => {
    render(<Text color="text-red-500">Red Text</Text>);
    expect(screen.getByText('Red Text').className).toContain('text-red-500');
  });
});
