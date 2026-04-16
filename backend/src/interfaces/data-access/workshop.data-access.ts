import type { Workshop } from '@domain/models/workshop.model';
import { WorkshopModel } from '@domain/models/workshop.model';
import type {
  CreateWorkshop,
  GetWorkshop,
  WorkshopRepository,
} from '@domain/repositories/workshop.repository';
import type { SortOrder } from 'mongoose';

const limit = 6;
export const WorkshopDataAccess: WorkshopRepository = {
  /**
   * Get a list of workshops
   * @param page - page of query / skip
   * @returns a list of workshops
   */
  getWorkshops: async function ({
    page = 0,
    sortOption,
    searchTerm,
  }: GetWorkshop): Promise<Workshop[]> {
    const sort: Record<string, { [key: string]: SortOrder }> = {
      'Nombre (A-Z)': { name: 1 },
      'Nombre (Z-A)': { name: -1 },
      'Precio: menor a mayor': { price: 1 },
      'Precio: mayor a menor': { price: -1 },
    };

    const workshops = await WorkshopModel.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .skip(page * limit)
      .limit(limit)
      .sort(sort[sortOption])
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
      .skip(page * limit)
      .limit(limit)
      .exec();

    return workshops;
  },

  /**
   * Get the total amount of workshops for pagination
   * @returns number of records
   */
  getTotalWorkshops: async function ({ searchTerm }): Promise<number> {
    const totalWorkshops = await WorkshopModel.countDocuments({
      name: { $regex: searchTerm, $options: 'i' },
    });
    return totalWorkshops;
  },

  /**
   * Create a workshop
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
