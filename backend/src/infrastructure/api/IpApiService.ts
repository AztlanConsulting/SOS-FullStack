import axios from 'axios';
import type { Location } from '../../domain/ports/ILocationRepository';
import type { ILocationRepository } from '../../domain/ports/ILocationRepository';

/**
 * Translates the Ip adresses unto the geographical and currency data
 */
export const IpApiService: ILocationRepository = {
  /**
   * Fetches location from Ipapi.co JSON endpoint
   * @param ip The target Ipv6 adress
   * @returns A promise resolving to a location or null depending the case.
   */
  async getIp(ip: string): Promise<Location | null> {
    try {
      //Get request to Ipapi.co
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);

      if (response.data.error !== undefined) {
        console.error('error: ', response.data.reason);
        return null;
      }

      //Receive the information that is usefull to us.
      return {
        country: response.data.country_name,
        currency: response.data.currency,
      };
    } catch (error) {
      console.error('Error en ApiService:', error);
      return null;
    }
  },
};
