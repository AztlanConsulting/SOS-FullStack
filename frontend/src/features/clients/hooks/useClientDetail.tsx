import { useState, useEffect } from 'react';
import { ClientService } from '../services/client.service';
import type { ClientDetail } from '../types/client.type';

/**
 * Custom hook to manage the lifecycle of fetching a specific client's details.
 *
 * It handles the loading states, error reporting, and data synchronization
 * whenever the provided client ID changes.
 *
 * @param {string | null} id - The ID of the client to fetch. If null, the state is cleared.
 * @returns {Object} { client, loading, error } - Current state of the data fetch operation.
 */
export const useClientDetail = (id: string | null) => {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Numeric counter used to force a side-effect re-execution on demand
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  /**
   * Internal worker function to execute the asynchronous data fetch from the service layer.
   */
  const fetchClient = async (clientId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClientService.getClientById(clientId);
      setClient(data);
    } catch {
      setError('No se pudo cargar el cliente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setClient(null);
      return;
    }
    fetchClient(id);
  }, [id, refetchTrigger]);

  /**
   * Imperatively forces a data reload from the server without changing the target client ID.
   */
  const refetch = () => setRefetchTrigger((t) => t + 1);

  return { client, loading, error, refetch };
};
