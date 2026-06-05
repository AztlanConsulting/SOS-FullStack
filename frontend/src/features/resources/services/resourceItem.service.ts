import axiosInstance from '@shared/utils/axios';
import type { Resource } from '../types/resource';
import type {
  CreateWorkshopItemPayload,
  CreateWorkshopItemResponse,
} from '@/features/workshop/types/workshopItem';

/**
 * Service for workshop item (manual / taller) management.
 * Handles creation requests against the /workshop-item endpoint.
 */
export const ResourceService = {
  /**
   * Creates a new workshop item (manual or taller).
   * Uploads the cover image first via /images, then posts the full payload.
   * @param payload - The complete workshop item data.
   * @returns The created item's id and type.
   */
  createWorkshopItem: async (
    payload: CreateWorkshopItemPayload,
  ): Promise<CreateWorkshopItemResponse> => {
    const { data } = await axiosInstance.post<CreateWorkshopItemResponse>(
      '/workshop-item',
      payload,
    );
    return data;
  },
  /**
   * Creates a new workshop item (manual or taller).
   * Uploads the cover image first via /images, then posts the full payload.
   * @param payload - The complete workshop item data.
   * @returns The created item's id and type.
   */
  updateResource: async (
    payload: Partial<Resource> & Pick<Resource, '_id'>,
  ): Promise<boolean> => {
    const types: Record<string, string> = {
      taller: 'workshop',
      manual: 'manual',
    };

    console.log(payload, types[payload.type!.toLowerCase()]);

    const { data } = await axiosInstance.put('/resources', payload, {
      params: {
        resource: types[payload.type!.toLowerCase()],
      },
    });
    return data;
  },

  /**
   * Uploads an image file to the /images endpoint and returns the hosted URL.
   * @param file - The image File object to upload.
   * @returns The URL string of the uploaded image.
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post('/resources/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status != 200) throw Error("Couldn't upload image");

    const imageUrl = response.data;
    return imageUrl;
  },
};
