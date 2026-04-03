import axios from 'axios';
import type { Location } from '../../domain/models/location';
import type { ILocationRepository } from '../../domain/repositories/ILocationRepository';

export class IpApiService implements ILocationRepository {
  async getIp(ip: string): Promise<Location | null> {
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);

      if (response.data.error) {
        console.error('error: ', response.data.reason);
        return null;
      }

      return {
        country: response.data.country_name,
        currency: response.data.currency,
      };
    } catch (error) {
      console.error('Error en ApiService:', error);
      return null;
    }
  }
}
