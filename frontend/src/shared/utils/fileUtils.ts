import axiosInstance from './axios';

export const urlToFile = async (
  url: string,
  filename: string,
  mimeType: string,
): Promise<File> => {
  const response = await axiosInstance.get(url, { responseType: 'blob' });
  return new File([response.data], filename, { type: mimeType });
};
