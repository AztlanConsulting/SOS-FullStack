import type { PartialResourceWithId } from '@/shared/types/resource.types';
import axiosInstance from '@/shared/utils/axios';

const resourceType: Record<string, string> = {
  workshop: 'taller',
  manual: 'manual',
};

async function editResource(
  updateInfo: PartialResourceWithId,
  resource: string,
) {
  const result = await axiosInstance.put(
    `/resources?resource=${resource}`,
    updateInfo,
  );

  switch (result.status) {
    case 200:
      return `El ${resourceType[resource]} ha sido actualizado con éxito`;
    case 401:
      return `Hubo un error al intentar editar el recurso seleccionado`;
    case 404:
      return `No se ha encontrado el ${resourceType[resource]} seleccionado`;
    default:
      return 'Ocurrió un error inesperado';
  }
}

export default editResource;
