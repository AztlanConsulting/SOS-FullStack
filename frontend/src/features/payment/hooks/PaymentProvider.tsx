import { createContext, useState } from 'react';

export const PaymentContext = createContext<{
  error: string | null;
  setError: (msg: string | null) => void;
} | null>(null);

// Handle when there is payment errors
export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <PaymentContext.Provider value={{ error, setError }}>
      {children}
    </PaymentContext.Provider>
  );
};
