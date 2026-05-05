import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';
import { countPetCollectionParams } from '@/types/petCollection.types';
import countPetImages from '@/use-cases/images/countPetImages.usecase';
import type { Request, Response } from 'express';

async function countPetPages(req: Request, res: Response) {
  try {
    const image = req.file;
    const query = countPetCollectionParams.safeParse(req.query);
    if (query.error) throw query.error;

    if (!image) {
      throw new Error('Missing image in body');
    }

    const total = await countPetImages(petVector, {
      image: image.buffer,
      query: query.data,
    });

    return res.status(200).send(total);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

export default countPetPages;
