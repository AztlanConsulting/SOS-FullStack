import { createSearchForm } from '@/use-cases/members-only/createSearchForm';
import type { Request, Response } from 'express';
import { SearchFormDataAccess } from '@infrastructure/data-access/searchForm.data-access';
import { searchFormSchema } from '../../types/createSearchForm.types';

export default async function createSearchFormController(
  req: Request,
  res: Response,
) {
  const parsed = searchFormSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid search form data',
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const createdReport = await createSearchForm(
      SearchFormDataAccess,
      parsed.data,
    );
    res.status(201).json({
      message: 'Search form report created successfully',
      data: createdReport,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error:
        'Ocurrió un error inesperado. Vuelva a intentarlo en unos minutos.',
    });
  }
}
