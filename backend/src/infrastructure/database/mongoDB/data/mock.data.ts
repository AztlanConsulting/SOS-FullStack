import dotenv from 'dotenv';
import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';
import { Mock } from '@domain/models/mock.model';
import { PlanModel } from '@domain/models/plan.model';
import { BlogModel } from '@domain/models/blog.model';
import { ResourcesModel } from '@domain/models/resource.model';
import { RoleModel } from '@domain/models/role.model';
import { UserModel } from '@domain/models/user.model';
import { PermissionModel } from '@domain/models/permission.model';
import bcrypt from 'bcryptjs';
import initBlogDB from './blogs.data';
import initWorkshopDB from './workshops.data';
import initManualDB from './manuals.data';

dotenv.config();

try {
  await mongoDB();

  await initWorkshopDB();
  await initManualDB();

  await Mock.deleteMany({});
  await PlanModel.deleteMany({});
  await BlogModel.deleteMany({});
  await UserModel.deleteMany({});
  await RoleModel.deleteMany({});
  await ResourcesModel.deleteMany({});
  await PermissionModel.deleteMany({});

  await Mock.insertMany([
    {
      title: 'Mock Item 1',
      description: 'This is a test item',
      value: 100,
    },
    {
      title: 'Mock Item 2',
      description: 'Another test item',
      value: 200,
    },
    {
      title: 'Mock Item 3',
      description: 'More mock data',
      value: 300,
    },
  ]);

  await PlanModel.insertMany([
    {
      name: 'Básico',
      price: 9.99,
    },
    {
      name: 'Estándar',
      price: 19.99,
    },
    {
      name: 'Premium',
      price: 29.99,
    },
  ]);

  const resources = await ResourcesModel.insertMany([
    { name: 'users', description: 'User management' },
    { name: 'posts', description: 'Posts management' },
    { name: 'products', description: 'Products management' },
  ]);

  const adminPermissions = await PermissionModel.insertMany(
    resources.map((r) => ({
      resourceId: r._id,
      actions: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    })),
  );

  const clientPermissions = await PermissionModel.insertMany(
    resources.map((r) => ({
      resourceId: r._id,
      actions: {
        create: false,
        read: true,
        update: false,
        delete: false,
      },
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

  await UserModel.insertMany([
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

  await initBlogDB();

  process.exit(0);
} catch (error) {
  console.error('Error seeding data:', error);
  process.exit(1);
}
