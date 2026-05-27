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

  const sanitized = { ...parsed.data };
  if (typeof sanitized.physicalCondition === 'string') {
    sanitized.physicalCondition = sanitized.physicalCondition.slice(0, 100);
  }
  if (typeof sanitized.visualReferences === 'string') {
    sanitized.visualReferences = sanitized.visualReferences.slice(0, 200);
  }
  if (typeof sanitized.additionalCircumstances === 'string') {
    sanitized.additionalCircumstances = sanitized.additionalCircumstances.slice(
      0,
      300,
    );
  }
  if (typeof sanitized.personality === 'string') {
    sanitized.personality = sanitized.personality.slice(0, 200);
  }
  if (typeof sanitized.whatHappenedWhenEscaped === 'string') {
    sanitized.whatHappenedWhenEscaped = sanitized.whatHappenedWhenEscaped.slice(
      0,
      300,
    );
  }
  if (typeof sanitized.fears === 'string') {
    sanitized.fears = sanitized.fears.slice(0, 100);
  }
  if (typeof sanitized.nearbyFeatures === 'string') {
    sanitized.nearbyFeatures = sanitized.nearbyFeatures.slice(0, 200);
  }
  if (typeof sanitized.attachedTo === 'string') {
    sanitized.attachedTo = sanitized.attachedTo.slice(0, 40);
  }
  if (typeof sanitized.toyBlanket === 'string') {
    sanitized.toyBlanket = sanitized.toyBlanket.slice(0, 40);
  }
  if (typeof sanitized.favoriteFood === 'string') {
    sanitized.favoriteFood = sanitized.favoriteFood.slice(0, 40);
  }
  if (typeof sanitized.whatBringsBack === 'string') {
    sanitized.whatBringsBack = sanitized.whatBringsBack.slice(0, 200);
  }
  if (typeof sanitized.favoritePlace === 'string') {
    sanitized.favoritePlace = sanitized.favoritePlace.slice(0, 40);
  }

  try {
    const createdReport = await createSearchForm(
      SearchFormDataAccess,
      sanitized,
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
