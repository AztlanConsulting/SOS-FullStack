import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { ForbiddenPage } from '@pages/ForbiddenPage';

// Creates a real navigation stack for integration testing
const createApp = () => {
  // Define in-memory router with test routes
  const router = createMemoryRouter(
    [
      { path: '/', element: <div>Home</div> },
      { path: '/dashboard', element: <div>Dashboard</div> },
      { path: '/forbidden', element: <ForbiddenPage /> },
    ],
    {
      initialEntries: ['/', '/dashboard', '/forbidden'],
      initialIndex: 2,
    },
  );

  // Return router instance and wrapped UI for rendering
  return { router, ui: <RouterProvider router={router} /> };
};

describe('ForbiddenPage integration', () => {
  it('renders forbidden page content', () => {
    const { ui } = createApp();

    render(ui);

    // Verify forbidden page is displayed
    expect(screen.getByText('Acceso denegado')).toBeInTheDocument();
  });

  it('navigates to home when clicking go to home button', async () => {
    const user = userEvent.setup();
    const { ui } = createApp();

    render(ui);

    // Simulate user clicking "go to home" button
    await user.click(screen.getByText('Ir al inicio'));

    // Verify navigation to Home page
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('navigates back to previous route when clicking back button', async () => {
    const user = userEvent.setup();
    const { ui } = createApp();

    render(ui);

    // Simulate user clicking back button
    await user.click(screen.getByText('Volver'));

    // Verify navigation back to Dashboard
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
