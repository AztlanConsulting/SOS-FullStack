import type { ClientListResponse } from '../types/client.type';

/**
 * Frontend Service for Client Management.
 *
 * Provides an abstraction layer for interacting with the `/api/clients` endpoints.
 * Handles query parameter serialization and standardizes fetch requests.
 */
export const ClientService = {
  /**
   * Fetches a paginated and optionally filtered list of clients.
   *
   * @param page - The current page number to retrieve.
   * @param search - Optional string to filter clients by username.
   * @returns A promise resolving to the paginated client response.
   */
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

  /**
   * Retrieves the full profile of a specific client, including pets and historical plans.
   *
   * @param id - The unique MongoDB ObjectId of the user.
   */
  getClientById: async (id: string) => {
    const data = await fetch(`/api/clients/${id}`).then((res) => res.json());
    return data;
  },

  /**
   * Updates the external conversation link for a client.
   * Useful for linking specific WhatsApp or CRM threads to a user profile.
   *
   * @param id - The user ID to update.
   * @param conversation - The full URL string of the conversation.
   */
  updateConversation: async (id: string, conversation: string) => {
    await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });
  },
};
