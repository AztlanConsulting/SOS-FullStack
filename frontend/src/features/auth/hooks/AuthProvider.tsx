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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthLoading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  // 🔥 BOOTSTRAP: se ejecuta al abrir la app
  useEffect(() => {
    if (hasRun.current) return; // 👈 evita segunda ejecución
    hasRun.current = true;

    const init = async () => {
      try {
        console.log('1. calling refresh');

        const res = await refreshRequest();
        console.log('2. refresh OK', res);

        setAccessToken(res.accessToken);

        console.log('3. calling /me');

        const data = await meRequest();
        console.log('4. me OK', data);

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

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest(email, password);

      setUser(data.user);
      setAccessToken(data.accessToken);

      return true; // ✅ éxito
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

      return false; // ❌ fallo
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
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
