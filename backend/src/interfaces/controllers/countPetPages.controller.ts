import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';
import { countPetCollectionParams } from '@/types/petCollection.types';
import countPetImages from '@/use-cases/images/countPetImages.usecase';
import logger from '@/utils/logger';
import type { Request, Response } from 'express';

async function countPetPages(req: Request, res: Response) {
  try {
    const image = req.file;
    const query = countPetCollectionParams.safeParse(req.query);
    if (query.error) {
      logger.error('countPetPages validation failed', {
        error: query.error,
        query: req.query,
      });
      throw query.error;
    }

    if (!image) {
      logger.error('countPetPages missing image', {
        query: req.query,
      });
      throw new Error('Missing image in body');
    }

    const total = await countPetImages(petVector, {
      image: image.buffer,
      query: query.data,
    });

    return res.status(200).send(total);
  } catch (err) {
    logger.error('countPetPages error', {
      error: err,
      query: req.query,
    });
    res.status(500).send(err);
  }
}

export default countPetPages;
