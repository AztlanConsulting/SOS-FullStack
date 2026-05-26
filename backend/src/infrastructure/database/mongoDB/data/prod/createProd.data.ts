import dotenv from 'dotenv';
import { mongoDB } from '../../mongoDB';
import { PlanModel } from '@/domain/models/plan.model';
import { BlogModel } from '@/domain/models/blog.model';
import { UserModel } from '@/domain/models/user.model';
import { RoleModel } from '@/domain/models/role.model';
import { ResourcesModel } from '@/domain/models/resource.model';
import { PermissionModel } from '@/domain/models/permission.model';
import { PetModel } from '@/domain/models/pet.model';
import { PurchasedPlanModel } from '@/domain/models/purchasedPlan.model';
import { ManualModel } from '@/domain/models/manual.model';
import { WorkshopModel } from '@/domain/models/workshop.model';
import { PurchaseModel } from '@/domain/models/purchase.model';
import { MembersOnlyModel } from '@/domain/models/membersOnly.model';
import createRBAC from './users.data';
import initPlanDB from '../mock/plans.data';
import initMembersOnlyDB from '../mock/membersOnly.data';

dotenv.config();

async function createProdDB() {
  try {
    await mongoDB();

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
    await MembersOnlyModel.deleteMany({});

    await createRBAC();
    await initPlanDB();

    process.exit(0);
  } catch (error) {
    console.error(
      '\x1b[31mError, no se pudo popular la base de datos de producción: ',
      error,
    );
    process.exit(1);
  }
}

export default createProdDB;
