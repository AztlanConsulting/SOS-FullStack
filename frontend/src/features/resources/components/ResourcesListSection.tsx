import ListAdmin from '@shared/components/ui/ListAdmin';
import Pagination from '@shared/components/ui/Pagination';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';
import { useEffect, useState } from 'react';
import ResourceCard from './ResourceCard';
import { ResourceModal } from './ResourceModal';
import ResourceSearch from './ResourceSearch.tsx';
import { type ResourceResult, type Resource } from '../types/resource';
import queryResources from '../services/queryResources';
import useResourceFilter from '../hooks/useResourceFilter';
import EditResourceModal from './EditResourceModal.tsx';
import { Modal } from '@/shared/components/ui/Modal/Modal.tsx';

const ResourcesListSection = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const { searchHook, query, pages } = useResourceFilter<ResourceResult>(
    queryResources,
    'resources',
  );

  useEffect(() => {
    console.log('Edit: ', edit, 'Selected Resource: ', selectedResource);
  }, []);

  const { isLoading, error, data } = query;

  return (
    <section className="color-grey-border-top w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        {/* Filters and search */}
        <div className="w-full">
          <ResourceSearch searchHook={searchHook} />
        </div>

        {/* State management and list */}
        {isLoading && <LoadingSpinner />}
        {error && (
          <Text className="mb-60 mt-40">
            Error cargando resultados de búsqueda, ${error.message}
          </Text>
        )}
        {data && data.resources.length == 0 && (
          <Text className="mb-20">No hay resultados...</Text>
        )}
        {!isLoading && !error && data && (
          <ListAdmin<Resource>
            cards={data.resources}
            component={(card, idx) => (
              <ResourceCard
                resource={card}
                key={idx}
                onClick={setSelectedResource}
              />
            )}
          />
        )}

        {selectedResource &&
          (edit ? (
            <EditResourceModal
              resource={selectedResource}
              cancel={() => setEdit(false)}
              close={() => {
                setEdit(false);
                setSelectedResource(null);
              }}
              success={() => {
                setEdit(false);
                setSelectedResource(null);
                setSuccess(true);
              }}
            />
          ) : (
            <ResourceModal
              resource={selectedResource}
              onClose={() => setSelectedResource(null)}
              setEdit={() => setEdit(true)}
            />
          ))}
        {success && (
          <Modal
            title={'Se ha actualizado correctamente'}
            onClose={() => setSuccess(false)}
          >
            El recurso seleccionado se ha actualizado correctamente
          </Modal>
        )}

        {/* Pagination */}
        {data && data.resources.length > 0 && <Pagination pages={pages} />}
      </div>
    </section>
  );
};

export default ResourcesListSection;
