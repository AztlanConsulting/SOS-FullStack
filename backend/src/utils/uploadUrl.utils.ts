import type { Request } from 'express';

type UploadUrlRequest = Pick<Request, 'protocol' | 'get'>;

const trimTrailingSlashes = (url: string) => url.replace(/\/+$/, '');

export const getApiBaseUrl = (req: UploadUrlRequest): string => {
  const configuredBaseUrl = process.env.BASE_URL?.trim();

  if (
    configuredBaseUrl !== undefined &&
    configuredBaseUrl !== '' &&
    !['undefined', 'null'].includes(configuredBaseUrl.toLowerCase())
  ) {
    return trimTrailingSlashes(configuredBaseUrl);
  }

  const host = req.get('host')?.trim() ?? '';

  if (host === '') {
    return '';
  }

  return `${req.protocol}://${host}`;
};

export const getUploadUrl = (
  req: UploadUrlRequest,
  filename: string,
): string => {
  return `${getApiBaseUrl(req)}/uploads/${filename}`;
};
