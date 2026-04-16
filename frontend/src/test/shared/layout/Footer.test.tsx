import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import Footer from '../../../shared/components/layout/Footer';

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
    // Find link by href
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
