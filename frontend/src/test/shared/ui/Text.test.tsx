import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Text } from '../../../shared/components/ui/Text/Text';

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
    expect(textElement.className).toContain('text-2xl'); // based on variantStyles in Text.tsx
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
