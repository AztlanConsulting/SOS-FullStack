import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

function Hello() {
  return <h1>Hello world</h1>;
}

describe('Hello component', () => {
  test('renders text', () => {
    render(<Hello />);
    expect(screen.getByText('Hello world')).toBeDefined();
  });
});
