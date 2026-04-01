import type { Location } from '../models/location';

export interface ILocationRepository {
  getIp(ip: string): Promise<Location | null>;
}
