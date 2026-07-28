import { petCollectionParams } from '@/types/petCollection.types';
import { petVector } from '@infrastructure/data-access/vectorDB/petVector.data-access';
import getSimilarPets from '@use-cases/images/getSimilarPets';
import logger from '@/utils/logger';
import type { Request, Response } from 'express';

export default async function findSimilarPets(req: Request, res: Response) {
  try {
    const query = petCollectionParams.safeParse(req.query);
    if (query.error) {
      logger.error('findSimilarPets validation failed', {
        error: query.error,
        query: req.query,
      });
      throw query.error;
    }
    const image = req.file;

    if (!image) {
      logger.warn('findSimilarPets missing image', {
        query: req.query,
      });
      return res.status(400).json({
        error: 'No picture provided',
        details: 'No picture provided',
      });
    }

    const result = await getSimilarPets(petVector, {
      image: image.buffer,
      query: query.data,
    });

    res.status(200).json(result);
  } catch (err: unknown) {
    logger.error('findSimilarPets error', {
      error: err,
      query: req.query,
    });
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error: 'Error uploading picture',
      details: errorMessage,
    });
  }
}
