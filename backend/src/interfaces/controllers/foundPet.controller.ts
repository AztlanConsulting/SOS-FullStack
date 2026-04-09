import { petVector } from '@interfaces/data-access/vectorDB/petVector.data-access';
import { createPetImage } from '@use-cases/images/createPetImage';
import type { Request, Response } from 'express';

export default async function foundPet(req: Request, res: Response) {
  try {
    const { species } = req.body;

    const image = req.file;

    if (!image) {
      return res.status(400).json({
        error: 'No picture provided',
        details: 'No picture provided',
      });
    }

    const result = await createPetImage(petVector, {
      refId: '123',
      image: image.buffer,
      species,
    });

    if (!result) throw Error('Error uploading image to vector db');

    res.status(200).json({
      message: 'Image inserted into database',
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
