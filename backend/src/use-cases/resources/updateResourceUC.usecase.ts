import type {
  PartialResourceWithId,
  ResourceRepository,
} from '@/domain/repositories/resource.repository';
import { Resource } from '@/domain/repositories/resource.repository';

async function updateResourceUC(
  resrouceDA: ResourceRepository | null,
  update: PartialResourceWithId,
): Promise<{ error: null | string; success: boolean }> {
  const result = await resrouceDA?.updateResourceById(update);

  if (!result)
    return { success: false, error: "Couldn't find or update resource" };
  return { success: true, error: null };
}

export default updateResourceUC;
