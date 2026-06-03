import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text';
import { Button } from '@/shared/components/ui/Button';
import { HiPlus } from 'react-icons/hi2';
import ResourcesListSection from '@/features/resources/components/ResourcesListSection';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { RegisterWorkshopItemModal } from '@/shared/components/ui/Modal/workshopItemModal';

export const ResourcesPage = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#F6F6F6] overflow-x-hidden w-full">
      <Sidebar />

      <div className="flex-1 lg:px-6 pb-24 lg:pb-0 lg:pt-6 flex flex-col items-center min-w-0 overflow-x-hidden lg:ml-64">
        <div className="flex justify-between gap-4 items-center py-4 w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
          <Text variant="h1" weight="bold" color="text-black">
            Recursos
          </Text>
          <Button
            variant="add"
            label="Agregar recurso"
            icon={HiPlus}
            onClick={() => setShowModal(true)}
          />
        </div>

        <ResourcesListSection />
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
