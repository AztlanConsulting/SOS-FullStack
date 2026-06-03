import type {
  PartialResourceWithId,
  ResourceRepository,
} from '@/domain/repositories/resource.repository';
import { ManualDataAccess } from '@/infrastructure/data-access/manual.data-access';
import { WorkshopDataAccess } from '@/infrastructure/data-access/workshop.data-access';
import {
  resourceSearchQuery,
  updateResourceSchema,
} from '@/types/resource.types';
import updateResourceUC from '@/use-cases/resources/updateResourceUC.usecase';
import { type Request, type Response } from 'express';

async function updateResource(req: Request, res: Response) {
  try {
    const query = resourceSearchQuery.safeParse(req.query);
    const body = updateResourceSchema.safeParse(req.body);

    if (query.error || body.error) throw query.error ?? body.error;

    const resourceDA = getResourceDA(query.data.resource);
    if (!resourceDA)
      return res
        .status(401)
        .send("Couldn't find repository. Query must be [workshop | manual]");

    const result = await updateResourceUC(
      resourceDA,
      body.data as PartialResourceWithId,
    );

    if (result.error) {
      console.error(result.error);
      return res.status(404).send("Couldn't find object");
    }

    return res.status(200).send('success');
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

function getResourceDA(resource?: string): ResourceRepository | null {
  if (!resource) return null;
  if (resource == 'manual') return ManualDataAccess;
  else return WorkshopDataAccess;
}

export default updateResource;
