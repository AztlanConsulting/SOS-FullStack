import { useState } from 'react';
import { loginRequest, logoutRequest } from '../services/auth.service';
import { setAccessToken } from '@shared/utils/tokenStorage';
import type { User } from '../types/auth.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const data = await loginRequest(email, password);

      setAccessToken(data.accessToken);
      setUser(data.user);

      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutRequest();
    setAccessToken(null);
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
