import { useContext } from 'react';
import { PaymentContext } from './PaymentProvider';

/**
 * Custom hook to access authentication context.
 *
 * Ensures that the hook is used within an AuthProvider tree.
 * If used outside, it throws an explicit runtime error to prevent silent failures.
 *
 * @throws Error when used outside of AuthProvider
 * @return AuthContext value containing auth state and actions
 */
export const usePayment = () => {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error('usePayment must be inside PaymentProvider');
  }

  return context;
};
