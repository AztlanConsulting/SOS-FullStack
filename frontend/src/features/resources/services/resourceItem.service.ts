import axiosInstance from '@shared/utils/axios';
import convertToWebP from '@/features/petCollection/services/convertToWebp';
import type { Resource } from '../types/resource';

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
  updateResource: async (
    payload: Partial<Resource> & Pick<Resource, '_id'>,
  ): Promise<boolean> => {
    const types: Record<string, string> = {
      Taller: 'workshop',
      Manual: 'manual',
    };

    const { data } = await axiosInstance.put('/resources', payload, {
      params: {
        resource: types[payload.type!],
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
    const webpFile = await convertToWebP(file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(webpFile);
    });
  },
};
