import axios from 'axios';
import { createContext, useEffect, useState, useRef } from 'react';
import { setAccessToken } from '@shared/utils/tokenStorage';
import {
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
} from '../services/auth.service';
import type { User } from '../types/auth.types';

// Authentication context exposed to the application.
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthLoading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  login: (
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider is responsible for:
 * - Session initialization (refresh + /me bootstrap)
 * - Managing authentication state
 * - Exposing login/logout actions
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevents React StrictMode (dev) from executing init twice.
  const hasRun = useRef(false);

  /**
   * Initial authentication bootstrap:
   * 1. Try refreshing access token (if refresh cookie exists)
   * 2. If successful, fetch authenticated user profile
   * 3. If any step fails, clear session state
   */
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const init = async () => {
      try {
        const res = await refreshRequest();
        setAccessToken(res.accessToken);

        const data = await meRequest();
        setUser(data.user);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    init();
  }, []);

  /**
   * Handles login flow:
   * - Calls backend login endpoint
   * - Stores access token in memory
   * - Sets authenticated user state
   * - Maps backend errors into user-friendly messages
   */
  const login = async (email: string, password: string, remember: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest(email, password, remember);

      setUser(data.user);
      setAccessToken(data.accessToken);

      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const backendMessage = err.response?.data?.message;

        switch (status) {
          case 400:
            setError(backendMessage || 'Datos inválidos');
            break;

          case 401:
            setError('Credenciales incorrectas');
            break;

          case 403:
            setError('Tu cuenta se encuentra desactivada');
            break;

          case 429:
            setError('Demasiados intentos, intenta más tarde');
            break;

          default:
            setError('Error inesperado, intenta de nuevo');
        }
      } else {
        setError('Error desconocido');
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the user:
   * - Calls backend logout endpoint
   * - Clears local auth state regardless of backend response
   */
  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setAccessToken(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthLoading,
        login,
        logout,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
