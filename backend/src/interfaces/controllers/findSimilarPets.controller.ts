import { petCollectionParams } from '@/types/petCollection.types';
import { petVector } from '@infrastructure/data-access/vectorDB/petVector.data-access';
import getSimilarPets from '@use-cases/images/getSimilarPets';
import type { Request, Response } from 'express';

export default async function findSimilarPets(req: Request, res: Response) {
  try {
    const query = petCollectionParams.safeParse(req.query);
    if (query.error) throw query.error;

    const image = req.file;

    if (!image) {
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
    // console.log(err);
    console.log('Error');

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error: 'Error uploading picture',
      details: errorMessage,
    });
  }
}
