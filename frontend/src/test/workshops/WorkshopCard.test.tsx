import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, type Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import WorkshopCard from '@features/workshop/components/WorkshopCard';
import type { Workshop } from '@features/workshop/types/workshop';
import { useNavigate } from 'react-router';

vi.mock('react-router', async () => {
  const actual = await vi.importActual<any>('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

/**
 * Standard props for the PlanCard component.
 * Includes basic info and a mocked selection handler.
 */
const mockWorkshop: Workshop = {
  _id: '123456789',
  name: 'Taller de búsqueda',
  description: 'Taller de como buscar a tu perro perdido',
  price: 150,
  category: ['perros', 'perdidos'],
  imageUrl:
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.VxHxDUm1rNHfYMPrvtnmcwHaE7%3Fpid%3DApi&f=1&ipt=592d2c2dea636064a067f94c351caa4808200d27eda3dea614e16eb4dd7c4856&ipo=images',
  content: `Este taller de duelo para perros es un espacio terapéutico diseñado para acompañar a las personas en el proceso de sanación tras la pérdida de su compañero canino, validando la profundidad del vínculo emocional compartido. A través de sesiones guiadas por profesionales, los participantes exploran sus sentimientos de tristeza, culpa o vacío, comprendiendo que el dolor es una expresión legítima del amor y la lealtad que definieron su relación. El programa integra dinámicas de apoyo grupal y técnicas de expresión creativa, permitiendo a los asistentes compartir memorias significativas en un ambiente de empatía y respeto mutuo. El objetivo principal no es olvidar, sino transformar la experiencia de la ausencia en un recuerdo reconfortante, brindando las herramientas necesarias para transitar las etapas del duelo y encontrar, poco a poco, un nuevo equilibrio emocional.`,
};

/**
 * Unit tests for the PlanCard component.
 * Validates rendering of plan details, interaction handlers, and modal behavior.
 */
describe('PlanCard Component', () => {
  /**
   * Verifies that the plan title is rendered as provided in props.
   */
  test('renders workshop correctly', () => {
    render(<WorkshopCard workshop={mockWorkshop} />);
    expect(screen.getByText('Taller de búsqueda')).toBeDefined();
  });

  /**
   * Verifies that the price is displayed.
   */
  test('renders workshop price correctly', () => {
    render(<WorkshopCard workshop={mockWorkshop} />);
    expect(screen.getByText(/\$?\s*150/)).toBeDefined();
  });

  /**
   * Simulates a user clicking the primary action button to ensure the callback triggers.
   */
  test('Navigates to /talleres/:id', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);

    render(<WorkshopCard workshop={mockWorkshop} />);

    await userEvent.click(screen.getByText('Ver'));
    expect(mockNavigate).toHaveBeenCalledWith(`/talleres/${mockWorkshop._id}`, {
      state: { workshop: mockWorkshop },
    });
  });
});
