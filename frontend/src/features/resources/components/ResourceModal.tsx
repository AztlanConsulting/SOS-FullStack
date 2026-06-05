import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import { Text } from '@/shared/components/ui/Text';
import type { Resource } from '../types/resource';
import { Button } from '@/shared/components/ui/Button/Button';
import { ConfirmationModal } from '@/shared/components/ui/Modal/ConfirmationModal';
import { deleteResource } from '../services/queryResources';

type ResourceModalProps = {
  resource: Resource | null;
  onClose: () => void;
  setEdit: () => void;
};

export const ResourceModal = ({
  resource,
  onClose,
  setEdit,
}: ResourceModalProps) => {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!resource) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteResource(resource._id);
      await queryClient.invalidateQueries({ queryKey: ['resources'] });
      setShowDeleteModal(false);
      onClose();
    } catch {
      setDeleteError('Error al eliminar el recurso. Intente de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        title="Detalle del recurso"
        onClose={onClose}
        childrenClassName="px-0"
      >
        {!resource && (
          <Text
            variant="caption"
            color="text-red-500"
            className="text-center py-4"
          >
            Error cargando el detalle del recurso
          </Text>
        )}
        {resource && (
          <>
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] modal-scrollbar overflow-x-hidden pl-6 pr-5 py-5">
              <Text variant="caption" as="p" color="text-gray-600">
                Imagen de portada
              </Text>
              <img
                src={resource.imageUrl}
                alt={resource.name}
                className="w-full h-auto object-cover rounded-lg mb-8"
              />
              <Text variant="caption" as="p" color="text-gray-600">
                Título
              </Text>
              <Text
                variant="body"
                color="text-black"
                className="mb-6 break-words"
              >
                {resource.name}
              </Text>
              <Text variant="caption" as="p" color="text-gray-600">
                Tipo
              </Text>
              {resource.type === 'Taller' ? (
                <button className="bg-[#BDE0FE] px-5 py-1 mb-6 w-fit rounded-lg">
                  <Text
                    variant="caption"
                    as="p"
                    weight="medium"
                    color="text-[#2856B1]"
                  >
                    {' '}
                    Taller{' '}
                  </Text>
                </button>
              ) : (
                <button className="bg-[#D4C7DB] px-5 py-1 mb-6 w-fit rounded-lg">
                  <Text
                    variant="caption"
                    as="p"
                    weight="medium"
                    color="text-[#673881]"
                  >
                    {' '}
                    Manual{' '}
                  </Text>
                </button>
              )}
              <Text variant="caption" as="p" color="text-gray-600">
                Precio
              </Text>
              <Text
                variant="body"
                color="text-black"
                className="mb-6 break-words"
              >
                $
                {resource.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                USD
              </Text>
              <Text variant="caption" as="p" color="text-gray-600">
                {resource.type === 'Taller' ? 'Video URL' : 'PDF URL'}
              </Text>
              {resource.resourceUrl ? (
                <a
                  href={resource.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mb-6 break-words"
                >
                  {resource.resourceUrl}
                </a>
              ) : (
                <Text variant="body" className="mb-6 break-words">
                  N/A
                </Text>
              )}
              <Text variant="caption" as="p" color="text-gray-600">
                Contenidos
              </Text>
              {resource.content.map((content) => {
                if (content.type === 'text') {
                  return (
                    <Text
                      variant="body"
                      color="text-black"
                      className="mb-2 break-words"
                    >
                      {content.content}
                    </Text>
                  );
                }

                if (content.type === 'image') {
                  return (
                    <img
                      src={content.content}
                      alt={resource.name}
                      className="w-full h-auto object-cover rounded-lg mb-2"
                    />
                  );
                }
              })}
              {resource.emailContent && (
                <>
                  <Text
                    variant="caption"
                    as="p"
                    color="text-gray-600"
                    className="mt-6"
                  >
                    Contenido del correo electrónico
                  </Text>
                  <Text
                    variant="body"
                    color="text-black"
                    className="break-words"
                  >
                    {resource.emailContent}
                  </Text>
                </>
              )}
            </div>
            <div className="w-full flex flex-col lg:flex-row-reverse color-grey-border-top gap-4 px-5 py-4">
              <Button label="Editar" variant="primary" onClick={setEdit} />
              <Button
                label="Eliminar"
                variant="secondary"
                onClick={() => setShowDeleteModal(true)}
              />
            </div>
          </>
        )}
      </Modal>
      {showDeleteModal && (
        <ConfirmationModal
          title="Eliminar recurso"
          description="¿Estas seguro de querer eliminar el taller?"
          confirmLabel="Sí, eliminar"
          cancelLabel="Cancelar"
          tone="danger"
          isLoading={isDeleting}
          errorMessage={deleteError}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeleteError(null);
          }}
        />
      )}
    </>
  );
};
