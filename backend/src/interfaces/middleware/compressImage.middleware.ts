import type { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';

export const compressImageMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file || !req.file.buffer) {
      return next();
    }

    const compressed = await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    req.file.buffer = compressed;
    req.file.size = compressed.length;
    req.file.mimetype = 'image/jpeg';
    req.file.originalname = `${req.file.originalname.replace(/\.[^/.]+$/, '')}.jpg`;

    return next();
  } catch (error) {
    next(error);
  }
};
