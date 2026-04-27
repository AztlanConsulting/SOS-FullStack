import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { PetRepository } from '@domain/repositories/pet.repository';
import type { PurchasedPlanRepository } from '@domain/repositories/purchasedPlan.repository';
import type { RoleRepository } from '@domain/repositories/role.repository';
import type { Pet, PetCreateInput } from '@domain/models/pet.model';
import type {
  PurchasedPlan,
  PurchasedPlanCreateInput,
} from '@domain/models/purchasedPlan.model';

export interface CreateLostPetReportInput {
  name: string;
  species: string;
  date: string;
  breed: string;
  sex: string;
  color: string;
  size: string;
  description: string;
  location: string;
  locationCoords: [number, number];

  contactName: string;
  phoneNumber: string;
  email: string;

  planName: string;
  planDetails: {
    days: number;
    km: number;
    selectedFeatures: string[];
    totalPrice: number;
  };

  images: string[];
}

interface CreateLostPetReportDependencies {
  userRepository: UserRepository;
  petRepository: PetRepository;
  purchasedPlanRepository: PurchasedPlanRepository;
  roleRepository: RoleRepository;
}

/**
 * Creates a lost pet report by:
 * 1. Finding or creating the associated user
 * 2. Creating the pet record
 * 3. Creating the purchased plan linked to the pet
 *
 * @param deps - Required repositories for data access
 * @param input - Input data for the lost pet report
 * @returns The created pet and purchased plan
 */
export const createLostPetReport = async (
  deps: CreateLostPetReportDependencies,
  input: CreateLostPetReportInput,
): Promise<{
  pet: Pet;
  plan: PurchasedPlan;
}> => {
  const {
    userRepository,
    petRepository,
    purchasedPlanRepository,
    roleRepository,
  } = deps;

  let user = await userRepository.getUserByEmail(input.email);
  let userId: string;

  if (!user) {
    const roleId = await roleRepository.getRoleIdByName('CLIENT');
    const hashedPassword = await bcrypt.hash(input.name, 10);

    if (roleId == null) {
      throw new Error('CLIENT_ROLE_NOT_FOUND');
    }

    userId = await userRepository.createUser({
      username: input.contactName,
      email: input.email,
      phone: input.phoneNumber,
      password: hashedPassword,
      roleId: new Types.ObjectId(roleId as string),
      permissions: [],
    });
  } else {
    userId = user._id.toString();
  }

  const petData = mapToPet(input, userId);
  const planData = mapToPurchasedPlan(input);

  const pet = await petRepository.createPet(petData);

  const plan = await purchasedPlanRepository.createPurchasedPlan({
    ...planData,
    petId: pet._id,
  });

  return { pet, plan };
};

/**
 * Maps input data to a PetCreateInput object.
 *
 * @param input - Raw input data
 * @param userId - Owner user ID
 * @returns PetCreateInput ready for persistence
 */
const mapToPet = (
  input: CreateLostPetReportInput,
  userId: string,
): PetCreateInput => {
  const date = new Date(input.date);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return {
    userId: new Types.ObjectId(userId),
    name: input.name,
    species: input.species,
    dateMissing: date,
    breed: input.breed,
    sex: input.sex,
    color: input.color,
    size: input.size,
    description: input.description,
    photos: input.images,
    placeMissing: input.location,
  };
};

/**
 * Maps input data to a PurchasedPlanCreateInput object (excluding petId).
 *
 * @param input - Raw input data
 * @returns Partial PurchasedPlanCreateInput
 */
const mapToPurchasedPlan = (
  input: CreateLostPetReportInput,
): Omit<PurchasedPlanCreateInput, 'petId'> => {
  return {
    name: input.planName,
    price: input.planDetails.totalPrice,
    duration: input.planDetails.days,
    radius: input.planDetails.km,
    features: input.planDetails.selectedFeatures,
  };
};
