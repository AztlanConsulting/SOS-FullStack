import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';
import getSimilarPets from '@use-cases/images/getSimilarPets';
import type { Request, Response } from 'express';

export default async function findSimilarPets(req: Request, res: Response) {
  try {
    const { species } = req.body;
    const { page } = req.query;

    const image = req.file;

    if (!image) {
      return res.status(400).json({
        error: 'No picture provided',
        details: 'No picture provided',
      });
    }

    const result = await getSimilarPets(petVector, Number(page), {
      image: image.buffer,
      species,
    });

    res.status(200).json({
      data: result,
      status: 'success',
    });
  } catch (err: unknown) {
    console.log(err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error: 'Error uploading picture',
      details: errorMessage,
    });
  }
}
