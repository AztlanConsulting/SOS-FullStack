import { createSearchForm } from '@/use-cases/members-only/createSearchForm';
import type { Request, Response } from 'express';
import { SearchFormDataAccess } from '@infrastructure/data-access/searchForm.data-access';
import { z } from 'zod';

const searchFormSchema = z.object({
  species: z.enum(['Dog', 'Cat', 'Other']),
  size: z.enum(['Small', 'Medium', 'Large']),
  approximateAge: z.number(),
  sex: z.enum(['Male', 'Female']),
  sterilized: z.enum(['Yes', 'No']),
  collarTag: z.enum(['Yes', 'No']),
  physicalCondition: z.string(),

  visualReferences: z.string(),
  zoneType: z.enum(['Residential', 'Rural', 'City', 'Highway']),
  additionalCircumstances: z.string(),

  personality: z.string(),
  canBeCaught: z.enum(['Yes', 'No', 'Depends']),
  noiseReaction: z.enum(['Scared', 'Flees', 'Ignores', 'Other']),
  noiseReactionOther: z.string().optional(),
  respondsToName: z.enum(['Yes', 'No', 'Sometimes']),
  usedToGoingOut: z.enum(['Yes', 'No']),
  hasEscapedBefore: z.enum(['Yes', 'No']),
  whatHappenedWhenEscaped: z.string().optional(),
  fears: z.string(),
  easilySocializes: z.enum(['Yes', 'No']),

  helpCount: z.enum(['Several people', '1-2 people', 'Alone']),
  nearbyFeatures: z.string(),
  streetAnimals: z.enum(['Many', 'Few', 'None', 'Unknown']),
  trafficLevel: z.enum(['High', 'Medium', 'Low']),
  zoneFamiliarity: z.enum(['Very familiar', 'Somewhat', 'Not at all']),

  attachedTo: z.string(),
  toyBlanket: z.string(),
  favoriteFood: z.string(),
  whatBringsBack: z.string(),
  favoritePlace: z.string(),

  vaccinationCard: z.string(),
});

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
    console.error(err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error:
        'Ocurrió un error inesperado. Vuelva a intentarlo en unos minutos.',
    });
  }
}
