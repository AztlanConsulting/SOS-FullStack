import axiosInstance from '@shared/utils/axios';
import type { Workshop } from '../types/workshop';

export default async function queryWorkshopById(id: string): Promise<Workshop> {
  const { data } = await axiosInstance.get(`/workshop`, {
    params: { id },
  });
  return data.workshops as Workshop;
}
