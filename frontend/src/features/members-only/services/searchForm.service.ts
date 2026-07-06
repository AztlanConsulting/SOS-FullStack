import axiosInstance from '@shared/utils/axios';
import type { SearchFormData } from '../types/searchForm.types';

export interface SearchFormResponse {
  message: string;
  data: unknown;
}

export interface SearchFormWithUser extends SearchFormData {
  _id: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetSearchFormsResponse {
  data: SearchFormWithUser[];
}

export const createSearchForm = async (
  formData: Record<string, unknown>,
): Promise<SearchFormResponse> => {
  const { data } = await axiosInstance.post('/searchform', formData, {
    timeout: 30000,
  });
  return data;
};

export const getSearchForms = async (): Promise<GetSearchFormsResponse> => {
  const { data } = await axiosInstance.get('/searchform');
  return data;
};
