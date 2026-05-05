import { describe, test, expect, vi, beforeEach } from 'vitest';
import { exportToCSV } from '@/shared/utils/exportCSV';

describe('exportToCSV (Unit Tests)', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });

    const mockClick = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement);
  });

  /**
   * Verifies exportToCSV does nothing when rows are empty
   */
  test('does nothing when rows are empty', () => {
    const createObjectURL = vi.mocked(URL.createObjectURL);
    exportToCSV('test', []);
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  /**
   * Verifies exportToCSV creates a blob and triggers download
   */
  test('creates a blob and triggers download', () => {
    exportToCSV('clientes', [
      { Nombre: 'Sebastian', Email: 'sebastian@test.com' },
    ]);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  /**
   * Verifies the filename is set correctly on the anchor element
   */
  test('sets correct filename on download', () => {
    const mockAnchor = {
      click: vi.fn(),
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement;
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);

    exportToCSV('clientes', [{ Nombre: 'Sebastian' }]);

    expect(mockAnchor.download).toBe('clientes.csv');
  });

  /**
   * Verifies URL is revoked after download
   */
  test('revokes object URL after download', () => {
    exportToCSV('clientes', [{ Nombre: 'Sebastian' }]);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
