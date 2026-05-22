import type { ClientDetail } from '@/types/client.type';
import type { GetClientsResult } from '@/use-cases/clients/getClients.usecase';
import type {
  User,
  UserWithRole,
  UserCreateInput,
} from '@domain/models/user.model';
import { UserModel } from '@domain/models/user.model';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { PopulatedPermission } from '@validation/auth.types';
import type { UserPermissions } from '@validation/auth.types';
import { Types } from 'mongoose';

export const userDataAccess: UserRepository = {
  /**
   * Retrieves a paginated list of users.
   * Uses fixed pagination (limit = 10).
   *
   * @param page - Page number (1-based)
   * @return List of users for the requested page
   */
  getUsers: async function (page: number): Promise<User[]> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await UserModel.find()
      .lean<User[]>()
      .skip(skip)
      .limit(limit)
      .exec();

    return users;
  },

  /**
   * Finds a user by ID.
   *
   * @param id - User ID
   * @return User if found, otherwise null
   */
  getUserById: async function (id: string): Promise<UserWithRole | null> {
    const user = await UserModel.findById(id)
      .populate({
        path: 'roleId',
        select: 'role',
      })
      .lean<UserWithRole>()
      .exec();

    return user;
  },

  /**
   * Finds a user by username.
   *
   * @param username - Username to search
   * @return User if found, otherwise null
   */
  getUserByName: async function (
    username: string,
  ): Promise<UserWithRole | null> {
    const user = await UserModel.findOne({ username })
      .populate({
        path: 'roleId',
        select: 'role',
      })
      .lean<UserWithRole>()
      .exec();

    return user;
  },

  /**
   * Finds a user by email.
   * Normalizes input to match stored lowercase/trimmed format.
   *
   * @param email - Email to search
   * @return User if found, otherwise null
   */
  getUserByEmail: async function (email: string): Promise<UserWithRole | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
      .populate({
        path: 'roleId',
        select: 'role',
      })
      .lean<UserWithRole>()
      .exec();

    return user;
  },

  /**
   * Resolves effective permissions for a user by combining:
   * - Role-based permissions
   * - User-specific permission overrides
   *
   * @param userId - User ID
   * @return Combined list of permissions
   */
  getUserPermissions: async function (
    userId: string,
  ): Promise<PopulatedPermission[]> {
    const user = await UserModel.findById(userId)
      .populate({
        path: 'roleId',
        populate: {
          path: 'permissions',
          populate: {
            path: 'resourceId',
            select: 'name',
          },
        },
      })
      .populate({
        path: 'permissions',
        populate: {
          path: 'resourceId',
          select: 'name',
        },
      })
      .lean<UserPermissions>();

    if (!user) return [];

    // Extract permissions from role and user-level overrides
    const rolePermissions = user.roleId?.permissions ?? [];
    const userPermissions = user.permissions ?? [];

    return [...rolePermissions, ...userPermissions];
  },

  /**
   * Creates a new user in the database.
   *
   * @param userData - Data required to create the user (excluding id and timestamps)
   * @returns The ID of the newly created user as a string
   */
  createUser: async function (userData: UserCreateInput): Promise<string> {
    const newUser = new UserModel(userData);
    const savedUser = await newUser.save();

    return savedUser._id.toString();
  },

  /**
   * Fetches a paginated list of users, including their primary pet and most recent plan.
   *
   * Highlights:
   * - Uses `$facet` to perform data retrieval and total count in a single database round-trip.
   * - Uses a nested `$lookup` pipeline to find the single most recent plan associated with the user's pets.
   */
  getUsersWithPets: async (
    page: number,
    search?: string,
  ): Promise<GetClientsResult> => {
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;
    const matchStage =
      search != null ? { username: { $regex: search, $options: 'i' } } : {};

    const [result] = await UserModel.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: LIMIT },
            {
              $lookup: {
                from: 'pets',
                localField: '_id',
                foreignField: 'userId',
                as: 'pets',
              },
            },
            {
              $lookup: {
                from: 'purchasedplans',
                let: { petIds: '$pets._id' },
                pipeline: [
                  { $match: { $expr: { $in: ['$petId', '$$petIds'] } } },
                  { $sort: { createdAt: -1 } },
                ],
                as: 'plans',
              },
            },
            {
              $addFields: {
                pet: { $arrayElemAt: ['$pets', 0] },
              },
            },
            { $project: { password: 0, pets: 0 } },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const total = result?.total?.[0]?.count ?? 0;
    const clients = (result?.data ?? []).map((client: any) => {
      if (client.plans && client.plans.length > 0) {
        const sorted = [...client.plans].sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const newest = sorted[0];

        // Evaluate active status only if the ledger hasn't reached terminal parameters
        if (newest.status !== 'RIP' && newest.status !== 'encontrado') {
          const now = new Date();
          let expiresAt: Date;

          // Process time stacking loops if overlapping active plans exist
          if (sorted.length > 1) {
            const prev = sorted[1];
            const prevExpiry = new Date(
              new Date(prev.createdAt).getTime() +
                prev.duration * 24 * 60 * 60 * 1000,
            );
            if (prevExpiry > now) {
              const remaining = prevExpiry.getTime() - now.getTime();
              expiresAt = new Date(
                now.getTime() +
                  remaining +
                  newest.duration * 24 * 60 * 60 * 1000,
              );
            } else {
              expiresAt = new Date(
                new Date(newest.createdAt).getTime() +
                  newest.duration * 24 * 60 * 60 * 1000,
              );
            }
          } else {
            expiresAt = new Date(
              new Date(newest.createdAt).getTime() +
                newest.duration * 24 * 60 * 60 * 1000,
            );
          }

          const ms = expiresAt.getTime() - now.getTime();
          if (ms < 0) newest.status = 'expirado';
          else if (ms < 24 * 60 * 60 * 1000) newest.status = 'casi expira';
          else newest.status = 'continua';
        }

        client.plan = newest;
        delete client.plans;
      }
      return client;
    });

    return {
      clients,
      total,
      page,
      totalPages: Math.ceil(total / LIMIT),
    };
  },

  /**
   * Retrieves full demographic context data mapping for an explicit profile tracking ID.
   * Combines transaction details and billing models completely within a single aggregation step.
   * * @param id - User database Object ID reference string
   * @returns Detailed composite profile payload or null if target account is invalid
   */
  getClientDetail: async (id: string): Promise<ClientDetail | null> => {
    const [client] = await UserModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'pets',
          localField: '_id',
          foreignField: 'userId',
          as: 'pets',
        },
      },
      {
        $lookup: {
          from: 'purchasedplans',
          let: { petIds: '$pets._id' },
          pipeline: [
            { $match: { $expr: { $in: ['$petId', '$$petIds'] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: 'plans',
        },
      },
      {
        $addFields: {
          plans: {
            $map: {
              input: '$plans',
              as: 'p',
              in: {
                $mergeObjects: [
                  '$$p',
                  {
                    status: {
                      $let: {
                        vars: {
                          expiresAt: {
                            $add: [
                              '$$p.createdAt',
                              {
                                $multiply: [
                                  '$$p.duration',
                                  24 * 60 * 60 * 1000,
                                ],
                              },
                            ],
                          },
                          now: '$$NOW',
                        },
                        in: {
                          $cond: {
                            if: {
                              $in: ['$$p.status', ['RIP', 'encontrado']],
                            },
                            then: '$$p.status',
                            else: {
                              $switch: {
                                branches: [
                                  {
                                    case: { $lt: ['$$expiresAt', '$$now'] },
                                    then: 'expirado',
                                  },
                                  {
                                    case: {
                                      $lt: [
                                        '$$expiresAt',
                                        {
                                          $add: ['$$now', 24 * 60 * 60 * 1000],
                                        },
                                      ],
                                    },
                                    then: 'casi expira',
                                  },
                                  {
                                    case: { $gt: ['$$expiresAt', '$$now'] },
                                    then: 'continua',
                                  },
                                ],
                                default: 'RIP',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'purchases',
          localField: 'email',
          foreignField: 'userEmail',
          as: 'purchases',
        },
      },
      {
        $lookup: {
          from: 'payments',
          let: { paymentId: { $arrayElemAt: ['$purchases.paymentId', 0] } },
          pipeline: [
            { $match: { $expr: { $eq: ['$orderId', '$$paymentId'] } } },
            { $limit: 1 },
          ],
          as: 'payments',
        },
      },
      {
        $addFields: {
          paymentMethod: { $arrayElemAt: ['$payments.method', 0] },
        },
      },
      { $project: { password: 0 } },
    ]);
    return client ?? null;
  },

  /**
   * General purpose update method for user records.
   * Primarily used for updating 'conversation' links or 'active' status.
   */
  updateUser: async (id: string, data: Partial<User>): Promise<void> => {
    await UserModel.findByIdAndUpdate(id, { $set: data });
  },

  /**
   * Aggregates demographic metrics based on geographical data extracted from lost pet reports.
   * Returns sorted totals useful for populating global analytics metrics widgets.
   * * @returns Arranged country data metrics mapping name-to-volume parameters
   */
  getClientsByCountry: async (): Promise<{ name: string; value: number }[]> => {
    const result = await UserModel.aggregate([
      {
        $lookup: {
          from: 'pets',
          localField: '_id',
          foreignField: 'userId',
          as: 'pets',
        },
      },
      {
        $addFields: {
          pet: { $arrayElemAt: ['$pets', 0] },
        },
      },
      {
        $match: {
          'pet.location': { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: 'purchasedplans',
          let: { petIds: '$pets._id' },
          pipeline: [
            { $match: { $expr: { $in: ['$petId', '$$petIds'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: 'plans',
        },
      },
      {
        $match: {
          $or: [
            { 'plans.0.status': { $nin: ['expirado', 'RIP', 'encontrado'] } },
            { plans: { $size: 0 } },
          ],
        },
      },
      {
        $addFields: {
          country: {
            $trim: {
              input: {
                $arrayElemAt: [{ $split: ['$pet.location', ','] }, -1],
              },
            },
          },
        },
      },
      {
        $addFields: {
          country: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: {
                    $replaceAll: {
                      input: {
                        $replaceAll: {
                          input: {
                            $replaceAll: {
                              input: { $toLower: '$country' },
                              find: 'é',
                              replacement: 'e',
                            },
                          },
                          find: 'á',
                          replacement: 'a',
                        },
                      },
                      find: 'í',
                      replacement: 'i',
                    },
                  },
                  find: 'ó',
                  replacement: 'o',
                },
              },
              find: 'ú',
              replacement: 'u',
            },
          },
        },
      },
      {
        $group: {
          _id: '$country',
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
      { $sort: { value: -1 } },
    ]);

    return result;
  },

  /**
   * Activates a user account.
   *
   * @param email - Email of the user to activate
   */
  activateUser: async function (email: string): Promise<void> {
    await UserModel.findOneAndUpdate(
      { email },
      { $set: { active: true } },
      { runValidators: true },
    ).exec();
  },
};
