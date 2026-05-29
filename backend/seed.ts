import mongoose, { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/your_db';
const ROLE_ID = process.env.ROLE_ID ?? '000000000000000000000001'; // replace with a real roleId from your DB
const COUNT = parseInt(
  process.argv.find((a) => a.startsWith('--count='))?.split('=')[1] ?? '50',
);

const UserSchema = new mongoose.Schema(
  {
    roleId: { type: Types.ObjectId, ref: 'Roles', required: true },
    permissions: [{ type: Types.ObjectId, ref: 'Permissions' }],
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String },
    fbUser: { type: String },
    conversation: { type: String },
    active: { type: Boolean, default: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

const PetSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: 'Users', required: true },
    name: { type: String },
    species: { type: String, required: true },
    dateMissing: { type: Date, required: true },
    breed: { type: String },
    sex: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    description: { type: String },
    photos: [{ type: String }],
    location: {
      coords: { type: [Number], required: true },
      displayName: { type: String, required: true },
      properties: {
        city: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
      },
    },
  },
  { timestamps: true },
);

const PurchasedPlanSchema = new mongoose.Schema(
  {
    petId: { type: Types.ObjectId, ref: 'Pets', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    radius: { type: Number, required: true },
    features: [{ type: String }],
    active: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['continua', 'casi expira', 'expirado', 'RIP', 'encontrado'],
      default: 'continua',
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const PurchaseSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    paymentId: { type: String, required: true },
    productId: { type: Types.ObjectId },
    productType: { type: String, default: 'plan' },
  },
  { timestamps: true },
);

const PaymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: { type: String, default: 'paypal' },
    status: { type: String, default: 'succeeded' },
    clientSecret: { type: String, default: 'temp_client_secret' },
  },
  { timestamps: true },
);

const UserModel = mongoose.models.Users ?? mongoose.model('Users', UserSchema);
const PetModel = mongoose.models.Pets ?? mongoose.model('Pets', PetSchema);
const PurchasedPlanModel =
  mongoose.models.PurchasedPlans ??
  mongoose.model('PurchasedPlans', PurchasedPlanSchema);
const PurchaseModel =
  mongoose.models.Purchases ?? mongoose.model('Purchases', PurchaseSchema);
const PaymentModel =
  mongoose.models.Payments ?? mongoose.model('Payments', PaymentSchema);

const PLAN_OPTIONS = [
  { name: 'Básico', price: 23, duration: 7, radius: 10 },
  { name: 'Estándar', price: 49, duration: 15, radius: 30 },
  { name: 'Premium', price: 93, duration: 30, radius: 60 },
];

const SPECIES = ['Perro', 'Gato'];
const SIZES = [
  'Mini: 1 a 4 kg',
  'Pequeño: 5 a 10 kg',
  'Mediana: 11 a 25 kg',
  'Grande: 26 kg+',
];
const SEXES = ['Macho', 'Hembra'];
const STATUSES = [
  'continua',
  'casi expira',
  'expirado',
  'RIP',
  'encontrado',
] as const;
const COUNTRIES = ['Mexico', 'United States', 'Colombia', 'Argentina', 'Spain'];
const MEXICAN_STATES = ['Jalisco', 'CDMX', 'Nuevo León', 'Querétaro', 'Puebla'];

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱 Connecting to MongoDB...`);
  await mongoose.connect(MONGO_URI);
  console.log(`Connected\n`);

  console.log(`Seeding ${COUNT} clients...\n`);

  const hashedPassword = await bcrypt.hash('password123', 10);
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < COUNT; i++) {
    try {
      const email = faker.internet.email().toLowerCase();

      const exists = await UserModel.exists({ email });
      if (exists) {
        skipped++;
        continue;
      }

      const user = await UserModel.create({
        roleId: new Types.ObjectId(ROLE_ID),
        username: faker.person.fullName(),
        password: hashedPassword,
        email,
        phone: faker.phone.number('+52##########'),
        active: true,
        conversation: Math.random() > 0.4 ? faker.internet.url() : undefined,
        notes: Math.random() > 0.5 ? faker.lorem.sentence() : '',
      });

      const country = randomItem(COUNTRIES);
      const pet = await PetModel.create({
        userId: user._id,
        name: faker.person.firstName(),
        species: randomItem(SPECIES),
        dateMissing: faker.date.past({ years: 1 }),
        breed: faker.animal.dog(),
        sex: randomItem(SEXES),
        color: faker.color.human(),
        size: randomItem(SIZES),
        description: faker.lorem.sentence(),
        photos: [],
        location: {
          coords: [
            parseFloat(faker.location.longitude().toString()),
            parseFloat(faker.location.latitude().toString()),
          ],
          displayName: faker.location.city(),
          properties: {
            city: faker.location.city(),
            state: randomItem(MEXICAN_STATES),
            country,
          },
        },
      });

      const planTemplate = randomItem(PLAN_OPTIONS);
      const status = randomItem(STATUSES);

      const daysAgo =
        status === 'expirado'
          ? planTemplate.duration + faker.number.int({ min: 1, max: 30 })
          : faker.number.int({ min: 1, max: planTemplate.duration - 1 });

      const planCreatedAt = new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000,
      );

      const plan = await PurchasedPlanModel.create({
        petId: pet._id,
        name: planTemplate.name,
        price: planTemplate.price,
        duration: planTemplate.duration,
        radius: planTemplate.radius,
        features: ['GPS tracking', 'Email alerts', 'Social media posts'],
        active: true,
        status,
        createdAt: planCreatedAt,
      });

      const orderId = faker.string.alphanumeric(17).toUpperCase();

      const payment = await PaymentModel.create({
        orderId,
        amount: planTemplate.price,
        currency: 'USD',
        method: randomItem(['paypal', 'stripe', 'card']),
        status: 'succeeded',
        clientSecret: 'temp_client_secret',
      });

      await PurchaseModel.create({
        userEmail: email,
        paymentId: orderId,
        productId: plan._id,
        productType: 'plan',
      });

      created++;
      if (created % 10 === 0) {
        process.stdout.write(`\rCreated ${created}/${COUNT} clients...`);
      }
    } catch (err: any) {
      if (err.code === 11000) {
        skipped++;
        continue;
      } // duplicate email
      console.error(`\n Error on client ${i + 1}:`, err.message);
    }
  }

  console.log(`\n\n Done!`);
  console.log(`   Created : ${created}`);
  console.log(`   Skipped : ${skipped} (duplicate emails)`);
  console.log(`   Total   : ${created + skipped}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
