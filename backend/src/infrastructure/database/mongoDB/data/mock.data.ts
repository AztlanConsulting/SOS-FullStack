import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';
import { Mock } from '@domain/models/mock.model';
import { PlanModel } from '@domain/models/plan.model';
import { BlogModel } from '@domain/models/blog.model';
import { ResourcesModel } from '@domain/models/resource.model';
import { RoleModel } from '@domain/models/role.model';
import { UserModel } from '@domain/models/user.model';
import { PermissionModel } from '@domain/models/permission.model';
import { PetModel } from '@/domain/models/pet.model';
import { PurchasedPlanModel } from '@domain/models/purchasedPlan.model';
import { ManualModel } from '@domain/models/manual.model';
import { WorkshopModel } from '@domain/models/workshop.model';
import { PurchaseModel } from '@domain/models/purchase.model';
import initPlanDB from './plans.data';

import bcrypt from 'bcryptjs';
import initBlogDB from './blogs.data';
import initWorkshopDB from './workshops.data';
import initManualDB from './manuals.data';

try {
  await mongoDB();

  await Mock.deleteMany({});
  await PlanModel.deleteMany({});
  await BlogModel.deleteMany({});
  await UserModel.deleteMany({});
  await RoleModel.deleteMany({});
  await ResourcesModel.deleteMany({});
  await PermissionModel.deleteMany({});
  await PetModel.deleteMany({});
  await PurchasedPlanModel.deleteMany({});
  await ManualModel.deleteMany({});
  await WorkshopModel.deleteMany({});
  await PurchaseModel.deleteMany({});

  await initWorkshopDB();
  await initManualDB();
  await initBlogDB();
  await initPlanDB();

  const resources = await ResourcesModel.insertMany([
    { name: 'users', description: 'User management' },
    { name: 'posts', description: 'Posts management' },
    { name: 'products', description: 'Products management' },
  ]);

  const adminPermissions = await PermissionModel.insertMany(
    resources.map((r) => ({
      resourceId: r._id,
      actions: { create: true, read: true, update: true, delete: true },
    })),
  );

  const clientPermissions = await PermissionModel.insertMany(
    resources.map((r) => ({
      resourceId: r._id,
      actions: { create: false, read: true, update: false, delete: false },
    })),
  );

  const adminRole = await RoleModel.create({
    role: 'ADMIN',
    permissions: adminPermissions.map((p) => p._id),
  });

  const userRole = await RoleModel.create({
    role: 'CLIENT',
    permissions: clientPermissions.map((p) => p._id),
  });

  const passwordHash = await bcrypt.hash('12345', 12);

  const createdUsers = await UserModel.insertMany([
    {
      username: 'admin',
      email: 'admin@test.com',
      password: passwordHash,
      roleId: adminRole._id,
      permissions: [],
      phone: '1234567890',
      active: true,
    },
    {
      username: 'user1',
      email: 'user1@test.com',
      password: passwordHash,
      roleId: userRole._id,
      permissions: [],
      phone: '1234567890',
      active: true,
    },
  ]);

  const testUser = createdUsers[1];

  const testPet = await PetModel.create({
    userId: testUser._id,
    name: 'Firulais',
    species: 'Perro',
    dateMissing: new Date('2026-05-01T12:00:00Z'),
    breed: 'Mestizo',
    sex: 'Macho',
    color: 'Café',
    size: 'Mediano',
    description: 'Perrito amigable, llevaba un collar rojo cuando se perdió.',
    photos: [],
    placeMissing: 'Mexico City, Mexico',
  });

  const plans = await PlanModel.find();
  const basicPlan = plans.find((p) => p.name === 'Básico') || plans[0];

  await PurchasedPlanModel.create({
    petId: testPet._id,
    name: basicPlan.name,
    price: basicPlan.price,
    duration: 30,
    radius: 5,
    features: ['Publicación estándar', 'Soporte por email'],
    active: true,
  });

  const realManual = await ManualModel.findOne();
  const realWorkshop = await WorkshopModel.findOne();

  if (realManual && realWorkshop) {
    await PurchaseModel.create([
      {
        userEmail: testUser.email,
        paymentId: 'pay_mock_123',
        productId: realManual._id.toString(),
        productType: 'manual',
      },
      {
        userEmail: testUser.email,
        paymentId: 'pay_mock_456',
        productId: realWorkshop._id.toString(),
        productType: 'workshop',
      },
    ]);
  }

  console.log('Mock data for data base done.');
  process.exit(0);
} catch (error) {
  console.error('Error seeding data:', error);
  process.exit(1);
}
