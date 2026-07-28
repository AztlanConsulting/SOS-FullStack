import { getUploadUrl } from '@/utils/uploadUrl.utils';
import logger from '@/utils/logger';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

async function uploadResourceImage(req: Request, res: Response) {
  try {
    return res.status(200).send(getUploadUrl(req, req.file?.filename!));
  } catch (error) {
    logger.error('uploadResourceImage error', {
      error,
      body: req.body,
    });
    return res.status(500).json({ error });
  }
}

export default uploadResourceImage;
