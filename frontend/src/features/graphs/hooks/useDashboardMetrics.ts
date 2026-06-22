import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../services/graphs.service';
import type { DashboardResponse } from '../types/dashboardMetrics';
import { getNotes } from '../services/notes.service';
import type { Notes } from '../types/notes.types';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardResponse | null>(null);
  const [clientNotes, setClientNotes] = useState<Notes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics();
        const note = await getNotes();
        setMetrics(data);
        setClientNotes(note);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la información del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { metrics, clientNotes, loading, error };
};
