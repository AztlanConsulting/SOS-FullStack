import type { Workshop } from '@/domain/models/workshop.model';
import type {
  CreateManualInput,
  ManualRepository,
} from '@/domain/repositories/manual.repository';
import type {
  PartialResourceWithId,
  ResourceRepository,
} from '@/domain/repositories/resource.repository';
import { Resource } from '@/domain/repositories/resource.repository';
import type { WorkshopRepository } from '@/domain/repositories/workshop.repository';

async function updateResourceUC(
  {
    ManualDataAccess,
    WorkshopDataAccess,
  }: {
    ManualDataAccess: ManualRepository;
    WorkshopDataAccess: WorkshopRepository;
  },
  update: PartialResourceWithId,
  resource: string,
): Promise<{ error: null | string; success: boolean }> {
  switch (resource) {
    case 'workshop':
      const workshopResult =
        await WorkshopDataAccess.updateResourceById(update);

      if (workshopResult) return { success: true, error: null };

      const manual = await ManualDataAccess.getManualById(update._id);

      if (!manual) {
        return {
          success: false,
          error: 'Manual not found',
        };
      }

      const workshopChangeset: Omit<Workshop, '_id'> = {
        name: update.name ?? manual.name,
        price: update.price ?? manual.price,
        imageUrl: update.imageUrl ?? manual.imageUrl,
        content: update.content ?? manual.content,

        description: update.description ?? '',
        category: update.category ?? [],

        videoUrl: update.resourceUrl,
        emailContent: update.emailContent ?? manual.emailContent,
      };

      const deletedManual = await ManualDataAccess.deleteManual(update._id);
      const newWorkshop =
        await WorkshopDataAccess.createWorkshop(workshopChangeset);

      return { success: true, error: null };
      break;
    case 'manual':
      const manualResult = await ManualDataAccess.updateResourceById(update);

      if (manualResult) return { success: true, error: null };

      const workshop = await WorkshopDataAccess.getWorkshopById(update._id);

      if (!workshop) {
        return {
          success: false,
          error: 'Manual not found',
        };
      }

      const manualChangeset: Omit<CreateManualInput, '_id'> = {
        name: update.name ?? workshop.name,
        price: update.price ?? workshop.price,
        imageUrl: update.imageUrl ?? workshop.imageUrl!,
        content: update.content ?? workshop.content,

        pdfUrl: update.resourceUrl ?? workshop.videoUrl,
      };

      const deletedWorkshop = await WorkshopDataAccess.deleteWorkshop(
        update._id,
      );

      const newManual = await ManualDataAccess.createManual(manualChangeset);

      return { success: true, error: null };
      break;
    default:
      return { success: false, error: 'Something went really wrong' };
  }
}

export default updateResourceUC;
