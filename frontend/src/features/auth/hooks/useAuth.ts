import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

/**
 * Custom hook to access authentication context.
 *
 * Ensures that the hook is used within an AuthProvider tree.
 * If used outside, it throws an explicit runtime error to prevent silent failures.
 *
 * @throws Error when used outside of AuthProvider
 * @return AuthContext value containing auth state and actions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
