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

  useEffect(() => {
    if (!id) {
      setClient(null);
      return;
    }

    setLoading(true);
    setError(null);

    /**
     * API Call to the client service.
     * Updates the state based on the promise resolution.
     */
    ClientService.getClientById(id)
      .then(setClient)
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { client, loading, error };
};
