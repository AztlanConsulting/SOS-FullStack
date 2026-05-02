import { useState, useEffect } from 'react';
import { ClientService } from '../services/client.service';
import type { ClientDetail } from '../types/client.type';

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

    ClientService.getClientById(id)
      .then(setClient)
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { client, loading, error };
};
