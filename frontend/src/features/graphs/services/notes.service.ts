import axiosInstance from '@shared/utils/axios';
import type { Notes } from '../types/notes.types';

/**
 * Obtiene nota del cliente
 */
export const getNotes = async (): Promise<Notes> => {
  const response = await axiosInstance.get<Notes>(`/clientDashboard/notes`);
  console.log('getNotes response:', response.data);
  return response.data;
};
