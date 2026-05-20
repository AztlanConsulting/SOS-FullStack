import type { MembersOnly } from '@domain/models/membersOnly.model';
import type {
  MembersOnlyRequest,
  MembersOnlyRepository,
} from '@domain/repositories/membersOnly.repository';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

async function uploadBase64File(
  base64Data: string,
  folder: string,
): Promise<string> {
  const commaIndex = base64Data.indexOf(',');
  if (commaIndex === -1) throw new Error('Invalid base64 format');

  const header = base64Data.slice(0, commaIndex);
  const data = base64Data.slice(commaIndex + 1);

  const mimeMatch = header.match(/^data:([\w/+]+);base64$/);
  if (!mimeMatch) throw new Error('Invalid base64 header');

  const mimeType = mimeMatch[1];
  const extension = ALLOWED_MIME_TYPES[mimeType];
  if (!extension) throw new Error(`Unsupported file type: ${mimeType}`);

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(data))
    throw new Error('Invalid base64 data');

  const fileName = `${new Types.ObjectId().toHexString()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), 'uploads', folder);

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, fileName);
  await fs.promises.writeFile(filePath, data, 'base64');

  return `/members-only/file/${fileName}`;
}

export async function createMembersOnly(
  membersOnlyRepository: MembersOnlyRepository,
  data: Omit<
    MembersOnly,
    '_id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'pdfUrl'
  > & { image: string; pdf: string },
): Promise<MembersOnly> {
  const imageUrl = await uploadBase64File(data.image, 'members-only');
  const pdfUrl = await uploadBase64File(data.pdf, 'members-only');

  const { image, pdf, ...rest } = data;

  return await membersOnlyRepository.createMembersOnly({
    ...rest,
    imageUrl,
    pdfUrl,
  });
}

export async function getMembersOnlyList(
  membersOnlyRepository: MembersOnlyRepository,
  request: MembersOnlyRequest,
): Promise<{ membersOnly: MembersOnly[]; total: number }> {
  const membersOnly = await membersOnlyRepository.getMembersOnly(request);
  const total = await membersOnlyRepository.getTotalMembersOnly(request);
  return { membersOnly, total };
}

export async function getMembersOnlyById(
  membersOnlyRepository: MembersOnlyRepository,
  id: string,
): Promise<MembersOnly | null> {
  return await membersOnlyRepository.getMembersOnlyById(id);
}

export function getMemberFilePath(fileName: string): string {
  return path.join(process.cwd(), 'uploads', 'members-only', fileName);
}
