import type { Request, Response } from 'express';
import { publishLostPet } from '@use-cases/clients/publishLostPet.usecase';
import { metaPublisher } from '@infrastructure/api/meta.api';

const publishPet = async (req: Request, res: Response) => {
  try {
    const { caption, mediaUrl } = req.body;

    const result = await publishLostPet(metaPublisher, {
      imageUrl: mediaUrl,
      caption,
    });

    res.json({
      message: 'Successfully published to Facebook and Instagram',
      data: result,
    });
  } catch (err: unknown) {
    console.error(err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error: 'Error publishing to social media',
      details: errorMessage,
    });
  }
};

export default {
  publishPet,
};
