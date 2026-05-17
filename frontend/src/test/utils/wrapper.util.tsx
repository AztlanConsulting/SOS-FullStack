import { AuthProvider } from '@/features/auth/hooks/AuthProvider';
import { PetReportProvider } from '@/shared/context/PetReportContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationProvider } from '@shared/context/Location.context';
import { vi } from 'vitest';

// Mocks the LocationContext to provide default USD pricing values.
// Required because components using useLocationContext need a LocationProvider
vi.mock('@features/plans/services/pricing.service', () => ({
  getPricing: () =>
    Promise.resolve({
      country: null,
      currencyCode: 'USD',
      plans: [],
      manuals: [],
      workshops: [],
    }),
}));

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
      <PetReportProvider>
        <LocationProvider>{children}</LocationProvider>
      </PetReportProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default wrapper;
