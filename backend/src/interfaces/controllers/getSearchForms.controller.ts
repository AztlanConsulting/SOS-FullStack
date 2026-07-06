import { getAllSearchForms } from '@/use-cases/members-only/getAllSearchForms';
import { SearchFormDataAccess } from '@infrastructure/data-access/searchForm.data-access';
import type { Request, Response } from 'express';

export default async function getSearchFormsController(
  _req: Request,
  res: Response,
) {
  try {
    const forms = await getAllSearchForms(SearchFormDataAccess);
    res.status(200).json({ data: forms });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({
      error: 'Ocurrió un error al obtener los formularios de búsqueda.',
      details: errorMessage,
    });
  }
}
