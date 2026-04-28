import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Absolute path where uploaded files will be stored.
 * Uses process.cwd() to ensure consistency across environments
 * (dev, build, docker, etc.)
 */
const uploadDir = path.join(process.cwd(), 'uploads');

/**
 * Ensure upload directory exists.
 * If it doesn't exist, create it recursively.
 */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Multer disk storage configuration.
 * - destination: folder where files will be saved
 * - filename: generates a unique filename to avoid collisions
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '')}`;
    cb(null, uniqueName);
  },
});

/**
 * File filter to restrict uploads to images only.
 * Rejects any file that does not have an image MIME type.
 */
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

/**
 * Multer middleware configuration:
 * - Uses disk storage
 * - Limits file size to 5MB per file
 * - Applies file type filtering
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter,
});
