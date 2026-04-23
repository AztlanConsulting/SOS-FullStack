import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

import { UserModel } from '@domain/models/user.model';
import { RoleModel } from '@domain/models/role.model';
import { PermissionModel } from '@domain/models/permission.model';
import { ResourcesModel } from '@domain/models/resource.model';

async function initAuthDB() {
  const resource = await ResourcesModel.create({
    name: 'users',
    description: 'User resource',
  });

  const permission = await PermissionModel.create({
    resourceId: resource._id,
    actions: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  });

  const role = await RoleModel.create({
    role: 'admin',
    permissions: [permission._id],
  });

  const hashedPassword = await bcrypt.hash('123456', 10);

  await UserModel.create({
    _id: new Types.ObjectId(),
    username: 'test',
    email: 'test@test.com',
    password: hashedPassword,
    roleId: role._id,
    active: true,
  });
}

export default initAuthDB;
