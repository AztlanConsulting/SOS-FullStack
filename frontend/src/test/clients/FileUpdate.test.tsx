import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '@shared/components/ui/FileUpload/FileUpload';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

const FileUploadHarness = ({ index = 1 }: { index?: number }) => {
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  return (
    <FileUpload
      index={index}
      currentFileName={fileName}
      onChange={(file) => setFileName(file?.name)}
    />
  );
};

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

  test('file input restricts accept to JPEG, PNG and HEIF only', () => {
    const { container } = render(<FileUpload index={1} />);
    const input = container.querySelector('input[type="file"]');
    expect(input?.getAttribute('accept')).toBe(
      'image/jpeg,image/png,image/heif,image/heic',
    );
  });

  test('does not call onChange and shows error when a non-allowed file type is selected', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const gif = new File(['content'], 'animacion.gif', { type: 'image/gif' });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Use fireEvent to bypass the accept-attribute filter and test the JS-level MIME check
    fireEvent.change(input, { target: { files: [gif] } });

    expect(mockOnChange).not.toHaveBeenCalled();
    expect(
      screen.getByText('Solo se permiten archivos JPG/JPEG, PNG o HEIF'),
    ).toBeDefined();
  });

  test('does not call onChange for PDF files', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const pdf = new File(['content'], 'documento.pdf', {
      type: 'application/pdf',
    });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [pdf] } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('calls onChange normally for PNG files', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const png = new File(['content'], 'foto.png', { type: 'image/png' });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, png);

    expect(mockOnChange).toHaveBeenCalledWith(png);
  });

  test('calls onChange normally for HEIF files', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const heif = new File(['content'], 'foto.heic', { type: 'image/heic' });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [heif] } });

    expect(mockOnChange).toHaveBeenCalledWith(heif);
  });

  test('clears the type error when a valid file is selected after an invalid one', () => {
    const { container } = render(<FileUpload index={1} onChange={vi.fn()} />);
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Trigger the error with an invalid type
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'bad.gif', { type: 'image/gif' })] },
    });
    expect(
      screen.getByText('Solo se permiten archivos JPG/JPEG, PNG o HEIF'),
    ).toBeDefined();

    // Follow up with a valid file — error should disappear
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'good.jpg', { type: 'image/jpeg' })] },
    });
    expect(
      screen.queryByText('Solo se permiten archivos JPG/JPEG, PNG o HEIF'),
    ).toBeNull();
  });

  test('displays the file name after a file is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUploadHarness index={1} />);

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
    const { container } = render(<FileUploadHarness index={1} />);

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

  test('calls onChange again when the same file is selected twice', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { container } = render(
      <FileUpload index={1} onChange={mockOnChange} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const sameFile = new File(['same'], 'repetida.jpg', { type: 'image/jpeg' });

    await user.upload(input, sameFile);
    await user.upload(input, sameFile);

    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, sameFile);
    expect(mockOnChange).toHaveBeenNthCalledWith(2, sameFile);
  });

  test('the file input is wrapped in a label (clickable area)', () => {
    const { container } = render(<FileUpload index={1} />);
    const label = container.querySelector('label');
    const input = container.querySelector('input[type="file"]');
    expect(label).not.toBeNull();
    expect(label?.contains(input)).toBe(true);
  });
});
