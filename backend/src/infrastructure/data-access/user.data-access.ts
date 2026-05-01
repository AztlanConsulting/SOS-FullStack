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
                  { $limit: 1 },
                ],
                as: 'plans',
              },
            },
            {
              $addFields: {
                pet: { $arrayElemAt: ['$pets', 0] },
                plan: { $arrayElemAt: ['$plans', 0] },
              },
            },
            { $project: { password: 0, pets: 0, plans: 0 } },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const clients = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return {
      clients,
      total,
      page,
      totalPages: Math.ceil(total / LIMIT),
    };
  },
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
      { $project: { password: 0 } },
    ]);

    return client ?? null;
  },
};
