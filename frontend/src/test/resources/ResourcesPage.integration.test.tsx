import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResourcesPage } from '@pages/ResourcesPage';

vi.mock('@/shared/components/layout/Sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

vi.mock('@features/resources/components/ResourcesListSection', () => ({
  default: () => <div data-testid="resources-list-section">Resources</div>,
}));

describe('ResourcesPage', () => {
  it('renders the sidebar and resources content without removing the page header', () => {
    render(<ResourcesPage />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Recursos')).toBeInTheDocument();
    expect(screen.getByText('Agregar recurso')).toBeInTheDocument();
    expect(screen.getByTestId('resources-list-section')).toBeInTheDocument();
  });
});
