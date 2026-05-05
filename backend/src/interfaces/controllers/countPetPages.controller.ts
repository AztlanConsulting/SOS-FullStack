import { petVector } from '@/infrastructure/data-access/vectorDB/petVector.data-access';
import countPetImages from '@/use-cases/images/countPetImages.usecase';
import type { Request, Response } from 'express';

async function countPetPages(req: Request, res: Response) {
  try {
    const image = req.file;
    const { species } = req.body;

    if (!image) {
      throw new Error('Missing image in body');
    }

    const pages = await countPetImages(petVector, {
      image: image.buffer,
      species,
    });

    console.log(pages);
    return res.status(200).send(pages);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

export default countPetPages;
