import axiosInstance from '@/shared/utils/axios';
import type { ClientListResponse } from '../types/client.type';

/**
 * Frontend Service for Client Management.
 *
 * Provides an abstraction layer for interacting with the `/clientDashboard` endpoints.
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
    const data = await axiosInstance.get(
      `/clientDashboard?${new URLSearchParams(params)}`,
    );
    return data.data;
  },

  /**
   * Retrieves the full profile of a specific client, including pets and historical plans.
   *
   * @param id - The unique MongoDB ObjectId of the user.
   */
  getClientById: async (id: string) => {
    const data = await axiosInstance.get(`/clientDashboard/${id}`);
    return data.data;
  },

  /**
   * Updates the external conversation link for a client.
   * Useful for linking specific WhatsApp or CRM threads to a user profile.
   *
   * @param id - The user ID to update.
   * @param conversation - The full URL string of the conversation.
   */
  updateConversation: async (id: string, conversation: string) => {
    await axiosInstance.put(`/clientDashboard/${id}`, { conversation });
  },

  /**
   * Dispatches an HTTP PUT request to modify the operational status of a specific subscription ledger.
   *
   * @param planId - The target unique identifier for the subscription ledger.
   * @param status - The new string state to apply.
   * @returns {Promise<void>} Resolves when the network layer successfully finishes processing the update.
   */
  updatePlanStatus: async (planId: string, status: string): Promise<void> => {
    await axiosInstance.put(`/clientDashboard/plan-status/${planId}`, {
      status,
    });
  },

  /**
   * Updates arbitrary metadata fields on a client profile.
   *
   * @param id - The unique user profile identification database token string.
   * @param data - Fields to update: conversation link, internal notes, or public note.
   * @returns {Promise<void>} Resolves once network transactions conclude successfully.
   */
  updateClient: async (
    id: string,
    data: {
      conversation?: string;
      notes?: string;
      publicNote?: { text?: string; image?: string };
    },
  ) => {
    await axiosInstance.put(`/clientDashboard/${id}`, data);
  },
};
