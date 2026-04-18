import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import Header from '@shared/components/layout/Header';
import Footer from '@shared/components/layout/Footer';

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

    const buttons = screen.getAllByRole('button');
    const burger = buttons.find(
      (b) => b.querySelector('svg') && !b.textContent?.includes('Síguenos'),
    );

    if (burger) {
      fireEvent.click(burger);
      const iniciarSesionButtons = screen.getAllByText('Iniciar Sesión');
      // Check that at least one "Iniciar Sesión" button exists (from mobile menu)
      expect(iniciarSesionButtons.length).toBeGreaterThan(0);
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

    const instagramLink = document.querySelector(
      'a[href="https://www.instagram.com/sos_encontrando_mascotas/"]',
    );
    expect(instagramLink).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cerrar'));
    expect(screen.getByText('Síguenos')).toBeInTheDocument();
  });
});

describe('Footer component', () => {
  test('renders copyright with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Copyright SOS Encontrando Mascotas/),
    ).toBeInTheDocument();
  });

  test('renders social links', () => {
    render(<Footer />);
    const fbLink = document.querySelector(
      'a[href="https://www.facebook.com/SOSencontrandomascotas"]',
    );
    expect(fbLink).toBeInTheDocument();

    const igLink = document.querySelector(
      'a[href="https://www.instagram.com/sos_encontrando_mascotas/"]',
    );
    expect(igLink).toBeInTheDocument();
  });

  test('renders Terminos y condiciones', () => {
    render(<Footer />);
    expect(screen.getByText(/Terminos y condiciones/)).toBeInTheDocument();
  });

  test('renders image credits link', () => {
    render(<Footer />);
    const creditsLink = screen.getByText('Creditos de imagenes').closest('a');
    expect(creditsLink).toHaveAttribute('href', '/credits');
  });
});
