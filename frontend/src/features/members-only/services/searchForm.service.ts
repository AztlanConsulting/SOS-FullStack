import axiosInstance from '@shared/utils/axios';

export interface SearchFormResponse {
  message: string;
  data: unknown;
}

export const createSearchForm = async (
  formData: Record<string, unknown>,
): Promise<SearchFormResponse> => {
  const { data } = await axiosInstance.post('/searchform', formData);
  return data;
};
