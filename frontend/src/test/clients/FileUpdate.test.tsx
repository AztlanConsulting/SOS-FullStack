import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '@shared/components/ui/FileUpload/FileUpload';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('FileUpload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with the upload label including the slot index', () => {
    render(<FileUpload index={1} />);
    expect(screen.getByText('Subir foto 1')).toBeDefined();
  });

  test('renders with different index numbers correctly', () => {
    render(<FileUpload index={3} />);
    expect(screen.getByText('Subir foto 3')).toBeDefined();
  });

  test('renders a hidden file input', () => {
    const { container } = render(<FileUpload index={1} />);
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
    expect(input?.classList.contains('hidden')).toBe(true);
  });

  test('file input only accepts image files (accept="image/*")', () => {
    const { container } = render(<FileUpload index={1} />);
    const input = container.querySelector('input[type="file"]');
    expect(input?.getAttribute('accept')).toBe('image/*');
  });

  test('displays the file name after a file is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload index={1} />);

    const file = new File(['content'], 'mi-perro.jpg', { type: 'image/jpeg' });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, file);

    expect(screen.getByText('mi-perro.jpg')).toBeDefined();
    expect(screen.queryByText('Subir foto 1')).toBeNull();
  });

  test('calls onChange with the selected File object', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const file = new File(['content'], 'mascota.jpg', { type: 'image/jpeg' });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, file);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(file);
  });

  test('calls onChange with null when no file is selected (empty change event)', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [] } });

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  test('does not throw when onChange prop is not provided', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload index={1} />);

    const file = new File(['content'], 'perro.jpg', { type: 'image/jpeg' });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await expect(user.upload(input, file)).resolves.not.toThrow();
  });

  test('displays the new file name when a second file is uploaded', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload index={1} onChange={vi.fn()} />);

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(
      input,
      new File(['a'], 'primero.jpg', { type: 'image/jpeg' }),
    );
    expect(screen.getByText('primero.jpg')).toBeDefined();

    await user.upload(
      input,
      new File(['b'], 'segundo.jpg', { type: 'image/jpeg' }),
    );
    expect(screen.getByText('segundo.jpg')).toBeDefined();
    expect(screen.queryByText('primero.jpg')).toBeNull();
  });

  test('calls onChange on every file selection', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(
      input,
      new File(['a'], 'foto1.jpg', { type: 'image/jpeg' }),
    );
    await user.upload(
      input,
      new File(['b'], 'foto2.jpg', { type: 'image/jpeg' }),
    );

    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  test('the file input is wrapped in a label (clickable area)', () => {
    const { container } = render(<FileUpload index={1} />);
    const label = container.querySelector('label');
    const input = container.querySelector('input[type="file"]');
    expect(label).not.toBeNull();
    expect(label?.contains(input)).toBe(true);
  });
});
