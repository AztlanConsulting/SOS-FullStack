import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import Header from '../../../shared/components/layout/Header';

// Mock useNavigate and useLocation from react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Header component', () => {
  test('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Talleres')).toBeInTheDocument();
  });

  test('toggles mobile menu when burger icon is clicked', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    // Burger icon is in a button with lg:hidden
    // Find the button that isn't the social button (social buttons have 'Cerrar' or 'Síguenos')
    const buttons = screen.getAllByRole('button');
    const burger = buttons.find(
      (b) => b.querySelector('svg') && !b.textContent?.includes('Síguenos'),
    );

    if (burger) {
      fireEvent.click(burger);
      // After clicking, the drawer should be visible.
      // The drawer contains the "Iniciar Sesión" text
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    }
  });

  test('navigates when a link is clicked', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const inicioLink = screen.getByText('Inicio');
    fireEvent.click(inicioLink.closest('div')!);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('toggles social links sidebar', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const followButton = screen.getByText('Síguenos');
    fireEvent.click(followButton);

    expect(screen.getByText('Cerrar')).toBeInTheDocument();

    // Check if one of the social links is rendered in the sidebar
    const instagramLink = document.querySelector(
      'a[href="https://www.instagram.com/sos_encontrando_mascotas/"]',
    );
    expect(instagramLink).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cerrar'));
    expect(screen.getByText('Síguenos')).toBeInTheDocument();
  });
});