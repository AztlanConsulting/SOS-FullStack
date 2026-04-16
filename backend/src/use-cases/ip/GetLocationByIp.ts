import type { ILocationRepository } from '@domain/ports/ILocationRepository';

/**
 * Use case to retrieve location details based on the Ip adress.
 * @param ip The target Ipv6 address to be resolved
 * @param repositories Implementation of the ILocationRepository
 * @returns A promise resolving to the location or null depending the case.
 */
export const GetLocationByIp = async (
  ip: string,
  repositories: ILocationRepository,
) => {
  return await repositories.getIp(ip);
};
