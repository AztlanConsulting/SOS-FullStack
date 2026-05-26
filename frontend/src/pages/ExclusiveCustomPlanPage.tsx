import { useNavigate, useLocation } from 'react-router';
import { Text } from '../shared/components/ui/Text';
import CustomPlanCard from '@/features/plans/components/customPlanCard';
import { HeaderBack } from '@/shared/components/layout/HeaderBack';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useEffect } from 'react';

/**
 * ExclusiveCustomPlanPage Component.
 * * Provides a dedicated page for users to configure their own search plan.
 * It integrates the CustomPlanCard logic within a consistent layout, featuring
 * a navigation-back action and responsive padding.
 */
export default function ExclusiveCustomPlanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const { petId } = (location.state ?? {}) as { petId?: string };

  useEffect(() => {
    if (!petId) {
      navigate('/inicio/extender-plan', { replace: true });
    }
  }, [petId, navigate]);

  return (
    <>
      <HeaderBack
        name="Regresar a planes"
        onBack={() => navigate('/inicio/extender-plan')}
      />
      <main className="min-h-screen bg-light-purple flex flex-col items-center py-8 px-8">
        <Text
          variant="h2"
          weight="medium"
          as="h2"
          className="text-gray-900 mb-6"
        >
          Personaliza tu plan
        </Text>
        <CustomPlanCard
          colorScheme="purple"
          checkoutPath="/inicio/compra"
          userEmail={user?.email ?? ''}
          userName={user?.username ?? ''}
          petId={petId ?? ''}
        />
      </main>
    </>
  );
}
