import { useEffect, useState } from 'react';
import { getManuals } from '../services/manual.service';

type Manual = {
  _id: string;
  name: string;
  price: number;
  content: string;
  imageUrl: string;
};

export const useManualsListSection = () => {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchManuals = async () => {
      try {
        const data = await getManuals();
        setManuals(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchManuals();
  }, []);

  return { manuals, loading, error };
};
