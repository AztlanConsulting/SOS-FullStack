import type { ILocationRepository } from 'src/domain/repositories/ILocationRepository';

export const GetLocationByIp = async (
  ip: string,
  repositories: ILocationRepository,
) => {
  return await repositories.getIp(ip);
};
