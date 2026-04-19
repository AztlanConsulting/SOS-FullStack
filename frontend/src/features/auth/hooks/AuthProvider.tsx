import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { setAccessToken } from '@shared/utils/tokenStorage';
import {
  loginRequest,
  logoutRequest,
  meRequest,
} from '../services/auth.service';
import type { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 BOOTSTRAP: se ejecuta al abrir la app
  useEffect(() => {
    const init = async () => {
      try {
        const data = await meRequest(); // o refresh endpoint

        setUser(data.user);
        setAccessToken(data.accessToken);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest(email, password);

      setUser(data.user);
      setAccessToken(data.accessToken);
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

          case 429:
            setError('Demasiados intentos, intenta más tarde');
            break;

          default:
            setError('Error inesperado, intenta de nuevo');
        }
      } else {
        setError('Error desconocido');
      }

      throw err; // opcional para UI si quiere reaccionar
    } finally {
      setLoading(false);
    }
  };

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
