import { createSearchForm } from '@/use-cases/members-only/createSearchForm';
import type { Request, Response } from 'express';
import { SearchFormDataAccess } from '@infrastructure/data-access/searchForm.data-access';

export default async function createSearchFormController(
  req: Request,
  res: Response,
) {
  try {
    const searchFormData = req.body;
    const createdReport = await createSearchForm(
      SearchFormDataAccess,
      searchFormData,
    );
    res.status(201).json({
      message: 'Search form report created successfully',
      data: createdReport,
    });
  } catch (err: unknown) {
    console.error(err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error: 'Error creating search form report',
      details: errorMessage,
    });
  }
}
