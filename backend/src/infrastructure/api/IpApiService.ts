import axios from 'axios';
import type { Location } from '../../domain/models/location';
import type { ILocationRepository } from '../../domain/repositories/ILocationRepository';

export class IpApiService implements ILocationRepository {
  async getIp(ip: string): Promise<Location | null> {
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);

      return {
        country: response.data.string,
        currency: response.data.string,
      };
    } catch (error) {
      console.error('Error en ApiService:', error);
      return null;
    }
  }
}
