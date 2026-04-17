import type { GetWorkshop } from './../../domain/repositories/workshop.repository';
import { WorkshopModel } from '@domain/models/workshop.model';
import { WorkshopDataAccess } from '@interfaces/data-access/workshop.data-access';
// Mock the Mongoose model to isolate the data access logic from the database.
jest.mock('@domain/models/workshop.model');

/**
 * Unit tests for the WorkshopDataAccess layer.
 * Focuses on verifying that the repository correctly interacts with the Mongoose model
 * and handles various database response scenarios.
 */
describe('Workshop unit-test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Verifies that getPlans successfully retrieves and returns all plan documents
   * when the database query is successful.
   */
  test('Get workshops - returns list of workshops', async () => {
    const mockWorkshops = [
      {
        name: 'Taller de entrenar perros para que no se escapen',
        description: 'Perros bien portados',
        price: 100, // MXN;
        content: 'Este es el contenido que se muestra con el taller',
        category: ['perros', 'gatos', 'duelo'],
        imageUrl:
          'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.tXOFLzddTwGOR91qug-GDAHaFw%3Fpid%3DApi&f=1&ipt=6ff6e19c1da5466b08ec7fff5af5532289ba77e2d94d5d9aca08862cd1a6b3e8&ipo=images',
      },
      {
        name: 'Taller de entrenar perros para que no se escapen',
        description: 'Perros bien portados',
        price: 100, // MXN;
        content: 'Este es el contenido que se muestra con el taller',
        category: ['perros', 'gatos', 'duelo'],
        imageUrl:
          'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.tXOFLzddTwGOR91qug-GDAHaFw%3Fpid%3DApi&f=1&ipt=6ff6e19c1da5466b08ec7fff5af5532289ba77e2d94d5d9aca08862cd1a6b3e8&ipo=images',
      },
      {
        name: 'Taller de entrenar perros para que no se escapen',
        description: 'Perros bien portados',
        price: 100, // MXN;
        content: 'Este es el contenido que se muestra con el taller',
        category: ['perros', 'gatos', 'duelo'],
        imageUrl:
          'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.tXOFLzddTwGOR91qug-GDAHaFw%3Fpid%3DApi&f=1&ipt=6ff6e19c1da5466b08ec7fff5af5532289ba77e2d94d5d9aca08862cd1a6b3e8&ipo=images',
      },
    ];

    const getWorkshop: GetWorkshop = {
      page: 0,
      searchTerm: '',
      sortOption: 'Nombre (A-Z)',
    };

    (WorkshopModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockWorkshops),
    });
    const result = await WorkshopDataAccess.getWorkshops(getWorkshop);

    expect(WorkshopModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockWorkshops);
  });

  /**
   * Ensures the repository returns an empty array rather than null or undefined
   * when no records exist in the collection.
   */
  test('getWorkshops returns empty array and 0 if no workshops have been saved', async () => {
    (WorkshopModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    });
    const getWorkshop: GetWorkshop = {
      page: 0,
      searchTerm: '',
      sortOption: 'Nombre (A-Z)',
    };

    const result = await WorkshopDataAccess.getWorkshops(getWorkshop);
    expect(result).toEqual([]);
  });

  /**
   * Validates error propagation by ensuring that database-level exceptions
   * are correctly thrown upwards through the repository.
   */
  test('getWorkshops throws error', async () => {
    const mockError = new Error('Database error');

    const getWorkshop: GetWorkshop = {
      page: 0,
      searchTerm: '',
      sortOption: 'Nombre (A-Z)',
    };

    (WorkshopModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(mockError),
    });

    await expect(WorkshopDataAccess.getWorkshops(getWorkshop)).rejects.toThrow(
      'Database error',
    );
  });

  /**
   * Returns the amount of documents
   */
  test('getWorkshops throws error', async () => {
    const mockTotal: number = 3;
    const getWorkshop: GetWorkshop = {
      page: 0,
      searchTerm: '',
      sortOption: 'Nombre (A-Z)',
    };
    (WorkshopModel.countDocuments as jest.Mock).mockResolvedValue(mockTotal);
    const result = await WorkshopDataAccess.getTotalWorkshops(getWorkshop);

    expect(result).toEqual(mockTotal);
  });
});
