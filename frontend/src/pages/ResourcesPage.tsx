import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { Text } from '@/shared/components/ui/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { RegisterWorkshopItemModal } from '@/shared/components/ui/Modal/workshopItemModal';

/**
 * Admin page for managing workshop resources (manuales and talleres).
 * Provides an entry point for registering new resources via a modal.
 * The consult/list functionality is handled by a separate story.
 */
export const RecursosPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F6F6] overflow-x-hidden w-full">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 flex flex-col gap-6 min-w-0 overflow-x-hidden lg:ml-64">
        <div className="bg-[#FFE598]/20 rounded-xl border border-primary p-5">
          <div className="flex items-center justify-between mb-4">
            <Text variant="h3" weight="regular">
              Recursos
            </Text>
            <Button
              variant="toolbar"
              label="Registrar recurso"
              icon={HiPlus}
              onClick={() => setShowModal(true)}
            />
          </div>

          {/* Placeholder — list will be implemented by the consult story */}
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Text variant="body" color="text-gray-400">
              El listado de recursos estará disponible próximamente.
            </Text>
          </div>
        </div>
      </div>

      {showModal && (
        <RegisterWorkshopItemModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
