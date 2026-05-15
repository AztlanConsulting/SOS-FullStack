// frontend/src/test/clients/AdProgressSection.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AdProgressSection } from '@/features/client/components/AdProgressSection';

const exportColor = vi.fn();
const exportBW = vi.fn();

vi.mock('@/shared/services/posterExport.services', () => ({
  exportPosterAsPdfColor: (...args: unknown[]) => exportColor(...args),
  exportPosterAsPdfBlackAndWhite: (...args: unknown[]) => exportBW(...args),
}));

describe('AdProgressSection', () => {
  test('no renderiza nada si no hay posterUrl', () => {
    const { container } = render(<AdProgressSection posterUrl={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renderiza imagen y dispara exportaciones', async () => {
    const user = userEvent.setup();

    render(
      <AdProgressSection posterUrl="http://localhost:3000/uploads/poster.jpg" />,
    );

    expect(screen.getByAltText('Póster de mascota perdida')).toBeDefined();

    await user.click(screen.getByText('Descargar a Color'));
    await user.click(screen.getByText('Descargar en B/N'));

    expect(exportColor).toHaveBeenCalledTimes(1);
    expect(exportBW).toHaveBeenCalledTimes(1);
  });
});
