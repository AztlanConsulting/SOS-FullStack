import { AuthProvider } from '@/features/auth/hooks/AuthProvider';
import { PetReportProvider } from '@/shared/context/PetReportContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Prevents vitest from waiting for retries on failure
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <QueryClientProvider client={createTestQueryClient()}>
      <PetReportProvider>{children}</PetReportProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default wrapper;
