import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Dashboard } from './features/graphs/components/Dashboard';
import './index.css';
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LandingPage from './presentation/pages/landing/LandingPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />,
  </React.StrictMode>,
);
