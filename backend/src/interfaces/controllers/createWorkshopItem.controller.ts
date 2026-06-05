import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';
import { createManual } from '@/use-cases/manuals/createManual.usecase';
import { createWorkshop } from '@/use-cases/workshops/createWorkshop.usecase';
import type { Request, Response } from 'express';
// ── Mirror of frontend limits — single source of truth on the server ──────────
const MAX_NAME_LENGTH = 100;
const MAX_TEXT_LENGTH = 400;
const MAX_LINK_LENGTH = 500;
const MAX_PRICE = 99_999;
const MAX_BLOCKS = 10;
const MAX_SECRET_URL_LENGTH = 100;
const VALID_TYPES = ['manual', 'taller'] as const;
const VALID_BLOCK_KINDS = ['texto', 'imagen', 'link'] as const;

type ValidType = (typeof VALID_TYPES)[number];
type ValidBlockKind = (typeof VALID_BLOCK_KINDS)[number];

interface ContentBlockBody {
  type: ValidBlockKind;
  content: string;
}

interface WorkshopItemBody {
  type: ValidType;
  name: string;
  price: unknown;
  imageUrl: string;
  content?: unknown[];
  description?: string;
  category?: unknown[];
  videoUrl?: string;
  emailContent?: string;
  pdfUrl?: string;
}

/**
 * Validates and sanitises a content block from the request body.
 * Returns a clean block or a string describing the error.
 */
function validateBlock(raw: unknown, index: number): ContentBlockBody | string {
  const types: Record<string, string> = {
    texto: 'text',
    imagen: 'image',
    link: 'text',
  };
  if (typeof raw !== 'object' || raw === null)
    return `Bloque ${index + 1}: formato inválido`;

  const b = raw as Record<string, unknown>;

  if (!VALID_BLOCK_KINDS.includes(b.type as ValidBlockKind))
    return `Bloque ${index + 1}: tipo inválido`;

  if (typeof b.content !== 'string')
    return `Bloque ${index + 1}: value debe ser texto`;

  if (b.type === 'texto' && b.content.length > MAX_TEXT_LENGTH)
    return `Bloque ${index + 1}: texto supera ${MAX_TEXT_LENGTH} caracteres`;

  if (b.type === 'link' && b.content.length > MAX_LINK_LENGTH)
    return `Bloque ${index + 1}: link supera ${MAX_LINK_LENGTH} caracteres`;

  return {
    type: types[b.type as string] as ValidBlockKind,
    content: b.content as string,
  };
}

/**
 * Handles POST /workshop-item
 * Creates either a Manual or a Taller depending on the `type` field.
 * All fields are validated server-side regardless of what the client sends.
 */
export const CreateWorkshopItemController = {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as WorkshopItemBody;

      // ── type ──
      if (!VALID_TYPES.includes(body.type as ValidType)) {
        console.log('Type debe ser manual o taller');
        res.status(400).json({ message: 'type debe ser "manual" o "taller"' });
        return;
      }

      // ── name ──
      if (typeof body.name !== 'string' || !body.name.trim()) {
        console.error('Nombre es requerido');
        res.status(400).json({ message: 'El nombre es requerido' });
        return;
      }
      if (body.name.trim().length > MAX_NAME_LENGTH) {
        console.log('Nombre demasiado largo');
        res.status(400).json({
          message: `El nombre no puede superar ${MAX_NAME_LENGTH} caracteres`,
        });
        return;
      }

      // ── price ──
      const price = Number(body.price);
      if (isNaN(price) || price <= 0) {
        console.log('Precio no es un número');
        res
          .status(400)
          .json({ message: 'El precio debe ser un número positivo' });
        return;
      }
      if (price > MAX_PRICE) {
        console.log('price is more than the max');
        res.status(400).json({
          message: `El precio no puede superar ${MAX_PRICE.toLocaleString()} USD`,
        });
        return;
      }

      // ── imageUrl ──
      if (typeof body.imageUrl !== 'string' || !body.imageUrl.trim()) {
        console.error('imageUrl is required');
        res.status(400).json({ message: 'imageUrl es requerido' });
        return;
      }

      // ── content blocks ──
      const rawBlocks = Array.isArray(body.content) ? body.content : [];
      if (rawBlocks.length > MAX_BLOCKS) {
        console.log('Raw blocks exceeded');
        res.status(400).json({
          message: `No se permiten más de ${MAX_BLOCKS} bloques de contenido`,
        });
        return;
      }

      const validatedBlocks: ContentBlockBody[] = [];
      for (let i = 0; i < rawBlocks.length; i++) {
        const result = validateBlock(rawBlocks[i], i);
        if (typeof result === 'string') {
          console.log(result);
          console.log('Result not string');
          res.status(400).json({ message: result });
          return;
        }
        validatedBlocks.push(result);
      }

      const cleanName = body.name.trim();

      // ── branch by type ──
      if (body.type === 'manual') {
        if (
          typeof body.pdfUrl === 'string' &&
          body.pdfUrl.trim().length > MAX_SECRET_URL_LENGTH
        ) {
          console.log('PDF url error');
          res
            .status(400)
            .json({ message: 'El pdfUrl supera el límite permitido' });
          return;
        }
        const manualId = await createManual(ManualDataAccess, {
          name: cleanName,
          price,
          imageUrl: body.imageUrl.trim(),
          content: validatedBlocks as any,
          pdfUrl:
            typeof body.pdfUrl === 'string' ? body.pdfUrl.trim() : undefined,
        });
        res.status(201).json({ id: manualId, type: 'manual' });
        return;
      }

      // taller
      if (typeof body.description !== 'string' || !body.description.trim()) {
        console.log('Description needed');
        res
          .status(400)
          .json({ message: 'description es requerido para talleres' });
        return;
      }

      // validate optional string arrays
      const category = Array.isArray(body.category)
        ? body.category
            .filter((c): c is string => typeof c === 'string')
            .map((c) => c.trim())
        : [];

      if (
        typeof body.videoUrl === 'string' &&
        body.videoUrl.trim().length > MAX_SECRET_URL_LENGTH
      ) {
        console.log('VideoURL exceeds expected length');
        res
          .status(400)
          .json({ message: 'El videoUrl supera el límite permitido' });
        return;
      }

      const workshopId = await createWorkshop(WorkshopDataAccess, {
        name: cleanName,
        price,
        imageUrl: body.imageUrl.trim(),
        description: body.description.trim(),
        content: validatedBlocks as any,
        category,
        videoUrl:
          typeof body.videoUrl === 'string' ? body.videoUrl.trim() : undefined,
        emailContent:
          typeof body.emailContent === 'string'
            ? body.emailContent.trim()
            : undefined,
      });
      res.status(201).json({ id: workshopId, type: 'taller' });
    } catch (err) {
      res.status(500).json({
        message:
          err instanceof Error
            ? err.message
            : 'Error interno al crear el recurso',
      });
    }
  },
};
