import type { Workshop } from '@domain/models/workshop.model';
import { WorkshopModel } from '@domain/models/workshop.model';
import type {
  CreateWorkshop,
  WorkshopRepository,
} from '@domain/repositories/workshop.repository';

export const WorkshopDataAccess: WorkshopRepository = {
  /**
   * Get a list of workshops
   * @param page - page of query / skip
   * @returns a list of workshops
   */
  getWorkshops: async function (page: number): Promise<Workshop[]> {
    const workshops = await WorkshopModel.find()
      .skip(page * 10)
      .limit(10)
      .exec();
    return workshops;
  },
  /**
   * Get a specific workshop by its id
   * @param id - id of a specific workshop
   * @returns Workshop
   */
  getWorkshopById: async function (id: string): Promise<Workshop | null> {
    const workshop = await WorkshopModel.findById(id).exec();
    return workshop;
  },
  /**
   * Get a list of workshops
   * @param categories: an array of the selected categories
   * @returns a list of workshops
   */
  getWorkshopByCategory: async function (
    categories: string[],
    page: number,
  ): Promise<Workshop[]> {
    const workshops = await WorkshopModel.find({
      category: { $all: categories },
    })
      .skip(page * 10)
      .limit(10)
      .exec();

    return workshops;
  },
  /**
   * Get a list of workshops
   * @param workshop: Workshop object
   * @returns status success or error
   */
  createWorkshop: async function (workshop: Workshop): Promise<CreateWorkshop> {
    const response = await WorkshopModel.create(workshop);
    if (response.errors !== undefined) {
      return { workshopId: null, error: response.errors.toString() };
    }
    return { workshopId: response._id.toString(), error: null };
  },
};
