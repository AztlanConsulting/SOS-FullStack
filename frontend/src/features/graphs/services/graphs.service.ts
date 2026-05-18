import axiosInstance from '@shared/utils/axios';
import type { DashboardResponse } from '../types/dashboardMetrics';

/**
 * Obtiene las métricas del dashboard del cliente
 */
export const getDashboardMetrics = async (): Promise<DashboardResponse> => {
  const response =
    await axiosInstance.get<DashboardResponse>('/clients/inicio');
  return response.data;
};
