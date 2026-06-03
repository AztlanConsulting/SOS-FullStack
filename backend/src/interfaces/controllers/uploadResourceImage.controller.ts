import { getUploadUrl } from '@/utils/uploadUrl.utils';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

async function uploadResourceImage(req: Request, res: Response) {
  try {
    return res.status(200).send(getUploadUrl(req, req.file?.filename!));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}

export default uploadResourceImage;
