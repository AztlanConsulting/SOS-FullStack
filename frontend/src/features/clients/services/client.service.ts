import type { ClientListResponse } from '../types/client.type';

export const ClientService = {
  getClients: async (
    page: number,
    search?: string,
  ): Promise<ClientListResponse> => {
    const params: Record<string, string> = { page: String(page) };
    if (search) {
      params.search = search;
    }
    const data = await fetch(
      `/api/clients?${new URLSearchParams(params)}`,
    ).then((res) => res.json());
    return data;
  },

  getClientById: async (id: string) => {
    const data = await fetch(`/api/clients/${id}`).then((res) => res.json());
    return data;
  },
};
