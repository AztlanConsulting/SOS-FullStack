import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { UserModel } from '@domain/models/user.model';
import { Types } from 'mongoose';

jest.mock('@domain/models/user.model');

describe('userDataAccess (Unit Tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Verifies getUsersWithPets returns paginated clients with pet and plan
   */
  test('getUsersWithPets returns paginated clients', async () => {
    const mockResult = [
      {
        data: [
          {
            _id: new Types.ObjectId(),
            username: 'Sebastian',
            email: 'sebastian@test.com',
            pet: { name: 'Pookie', species: 'dog' },
            plan: { name: 'Plan Básico', status: 'continua' },
          },
        ],
        total: [{ count: 1 }],
      },
    ];

    (UserModel.aggregate as jest.Mock).mockResolvedValue(mockResult);

    const result = await userDataAccess.getUsersWithPets(1);

    expect(UserModel.aggregate).toHaveBeenCalledTimes(1);
    expect(result.clients).toHaveLength(1);
    expect(result.clients[0].username).toBe('Sebastian');
    expect(result.page).toBe(1);
    expect(result.total).toBe(1);
  });

  /**
   * Verifies getUsersWithPets returns empty list when no clients
   */
  test('getUsersWithPets returns empty list when no clients', async () => {
    (UserModel.aggregate as jest.Mock).mockResolvedValue([
      {
        data: [],
        total: [],
      },
    ]);

    const result = await userDataAccess.getUsersWithPets(1);

    expect(result.clients).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  /**
   * Verifies getUsersWithPets passes search term to aggregate
   */
  test('getUsersWithPets calls aggregate with search term', async () => {
    (UserModel.aggregate as jest.Mock).mockResolvedValue([
      { data: [], total: [] },
    ]);

    await userDataAccess.getUsersWithPets(1, 'Sebastian');

    const aggregateCall = (UserModel.aggregate as jest.Mock).mock.calls[0][0];
    const matchStage = aggregateCall[0].$match;
    expect(matchStage.username.$regex).toBe('Sebastian');
  });

  /**
   * Verifies getClientDetail returns full client with pets and plans
   */
  test('getClientDetail returns full client detail', async () => {
    const mockId = new Types.ObjectId();
    const mockClient = {
      _id: mockId,
      username: 'Sebastian',
      email: 'sebastian@test.com',
      pets: [{ name: 'Pookie', species: 'dog' }],
      plans: [{ name: 'Plan Básico', status: 'continua' }],
    };

    (UserModel.aggregate as jest.Mock).mockResolvedValue([mockClient]);

    const result = await userDataAccess.getClientDetail(mockId.toString());

    expect(result).not.toBeNull();
    expect(result?.username).toBe('Sebastian');
    expect(result?.pets).toHaveLength(1);
    expect(result?.plans).toHaveLength(1);
  });

  /**
   * Verifies getClientDetail returns null when client not found
   */
  test('getClientDetail returns null when client not found', async () => {
    (UserModel.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await userDataAccess.getClientDetail(
      new Types.ObjectId().toString(),
    );

    expect(result).toBeNull();
  });

  /**
   * Verifies updateUser calls findByIdAndUpdate with correct data
   */
  test('updateUser calls findByIdAndUpdate with correct data', async () => {
    const mockId = new Types.ObjectId().toString();
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    await userDataAccess.updateUser(mockId, {
      conversation: 'https://sos.com',
    });

    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockId, {
      $set: { conversation: 'https://sos.com' },
    });
  });
});
