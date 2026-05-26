import { PermissionModel } from '@/domain/models/permission.model';
import { ResourcesModel } from '@/domain/models/resource.model';
import { RoleModel } from '@/domain/models/role.model';
import { UserModel } from '@/domain/models/user.model';
import bcrypt from 'bcryptjs';

async function createRBAC() {
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

  await UserModel.insertMany([
    {
      username: 'Priscilla',
      email: 'hola@sosencontrandomascotas.com',
      password: passwordHash,
      roleId: adminRole._id,
      permissions: [],
      phone: '1234567890',
      active: true,
    },
    {
      username: 'admin_1',
      email: 'admin_1@test.com',
      password: passwordHash,
      roleId: adminRole._id,
      permissions: [],
      phone: '1234567890',
      active: true,
    },
    {
      username: 'admin_2',
      email: 'admin_2@test.com',
      password: passwordHash,
      roleId: adminRole._id,
      permissions: [],
      phone: '1234567890',
      active: true,
    },
  ]);
}

export default createRBAC;
