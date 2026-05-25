import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { PlanStatusBadge } from '@/shared/components/ui/StatusBadge/PlanStatus';
import type { PlanStatus } from '@/features/clients/types/client.type';

describe('PlanStatusBadge (Component Tests)', () => {
  /**
   * Verifies continua status renders correctly
   */
  test('renders continua badge', () => {
    render(<PlanStatusBadge status={'continua' as PlanStatus} />);
    expect(screen.getByText('Continua')).toBeInTheDocument();
  });

  /**
   * Verifies casi expira status renders correctly
   */
  test('renders casi expira badge', () => {
    render(<PlanStatusBadge status={'casi expira' as PlanStatus} />);
    expect(screen.getByText('Casi expira')).toBeInTheDocument();
  });

  /**
   * Verifies expirado status renders correctly
   */
  test('renders expirado badge', () => {
    render(<PlanStatusBadge status={'expirado' as PlanStatus} />);
    expect(screen.getByText('Expirado')).toBeInTheDocument();
  });

  /**
   * Verifies RIP status renders correctly
   */
  test('renders RIP badge', () => {
    render(<PlanStatusBadge status={'RIP' as PlanStatus} />);
    expect(screen.getByText('RIP')).toBeInTheDocument();
  });
});
