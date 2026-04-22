import { mongoDB } from '@infrastructure/database/mongoDB/mongoDB';
import { Mock } from '@domain/models/mock.model';
import { PlanModel } from '@domain/models/plan.model';
import { BlogModel } from '@domain/models/blog.model';
import { ResourcesModel } from '@domain/models/resource.model';
import { RoleModel } from '@domain/models/role.model';
import { UserModel } from '@domain/models/user.model';
import { PermissionModel } from '@domain/models/permission.model';
import bcrypt from 'bcryptjs';

try {
  await mongoDB();

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

  await BlogModel.insertMany([
    {
      name: 'Introduccion a React',
      duration: 8,
      content: [
        {
          content:
            'React es una libreria de JavaScript para construir interfaces de usuario de manera eficiente.',
          type: 'text',
        },
        {
          content:
            'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200',
          type: 'image',
        },
        {
          content:
            'Con componentes reutilizables y estado local, puedes crear vistas complejas con menos codigo repetido.',
          type: 'text',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    },
    {
      name: 'Guia basica de Node.js',
      duration: 7,
      content: [
        {
          content:
            'Node.js permite ejecutar JavaScript en el servidor usando un modelo no bloqueante.',
          type: 'text',
        },
        {
          content:
            'Tambien destaca por su ecosistema npm, ideal para armar APIs y herramientas de backend rapidamente.',
          type: 'text',
        },
        {
          content:
            'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200',
          type: 'image',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    },
    {
      name: 'Que es TypeScript',
      duration: 6,
      content: [
        {
          content:
            'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200',
          type: 'image',
        },
        {
          content:
            'TypeScript es un superset de JavaScript que anade tipado estatico.',
          type: 'text',
        },
        {
          content:
            'Esto ayuda a detectar errores antes de ejecutar y mejora el autocompletado en proyectos grandes.',
          type: 'text',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
    },
    {
      name: 'Clean Architecture',
      duration: 9,
      content: [
        {
          content:
            'La Clean Architecture separa responsabilidades para lograr codigo mantenible y testeable.',
          type: 'text',
        },
        {
          content:
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200',
          type: 'image',
        },
        {
          content:
            'Una practica comun es aislar casos de uso de frameworks para mantener reglas de negocio independientes.',
          type: 'text',
        },
        {
          content:
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
          type: 'image',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    },
    {
      name: 'Uso de MongoDB con Mongoose',
      duration: 8,
      content: [
        {
          content:
            'Mongoose facilita la interaccion con MongoDB mediante esquemas y modelos.',
          type: 'text',
        },
        {
          content:
            'Con validaciones y middlewares puedes estandarizar la persistencia de datos de forma robusta.',
          type: 'text',
        },
        {
          content:
            'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200',
          type: 'image',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    },
    {
      name: 'Optimizacion en React',
      duration: 10,
      content: [
        {
          content:
            'Puedes optimizar React usando memoizacion, lazy loading y buenas practicas.',
          type: 'text',
        },
        {
          content:
            'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200',
          type: 'image',
        },
        {
          content:
            'Evita renders innecesarios con React.memo y useMemo cuando el costo de calculo sea significativo.',
          type: 'text',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
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

  const userPermissions = await PermissionModel.insertMany(
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
    role: 'admin',
    permissions: adminPermissions.map((p) => p._id),
  });

  const userRole = await RoleModel.create({
    role: 'user',
    permissions: userPermissions.map((p) => p._id),
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

  process.exit(0);
} catch (error) {
  console.error('Error seeding data:', error);
  process.exit(1);
}
