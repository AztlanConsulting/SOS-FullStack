import { z } from 'zod';

export const PET_REPORT_SEX_VALUES = [
  'Macho',
  'Hembra',
  'Desconocido',
] as const;

export const PET_REPORT_SIZE_VALUES = [
  'Mini: 1 a 4 kg',
  'Pequeña: 5 a 10 kg',
  'Mediana: 11 a 25 kg',
  'Grande: 26 a 45 kg',
  'Gigante: más de 45 kg',
] as const;

export type PetReportSex = (typeof PET_REPORT_SEX_VALUES)[number];

export type PetReportSize = (typeof PET_REPORT_SIZE_VALUES)[number];

export type CreatePetReportDTO = {
  name: string;
  species: string;
  date: string;
  breed: string;
  sex: PetReportSex;
  color: string;
  size: PetReportSize;
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
};

export type LostPetReport = Omit<
  CreatePetReportDTO,
  'locationCoords' | 'location'
> & {
  location?: string;
  locationCoords?: [number, number];
};

export const createPetReportDTOSchema = z.object({
  name: z.string(),
  species: z.string().min(1, 'La especie es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  breed: z.string(),
  sex: z.enum(PET_REPORT_SEX_VALUES),
  color: z.string().min(1, 'El color es requerido'),
  size: z.enum(PET_REPORT_SIZE_VALUES),
  description: z.string().min(1, 'La descripción es requerida'),
  location: z.string(),
  locationCoords: z.preprocess(
    (val) => (typeof val === 'string' ? JSON.parse(val) : val),
    z.tuple([z.number(), z.number()]),
  ),
  contactName: z.string().min(1, 'El nombre de contacto es requerido'),
  phoneNumber: z.string().min(1, 'El número de teléfono es requerido'),
  email: z.email('El correo electrónico no es válido'),
  planName: z.string().min(1, 'El plan es requerido'),

  planDetails: z.preprocess(
    (val) => (typeof val === 'string' ? JSON.parse(val) : val),
    z.object({
      days: z.number(),
      km: z.number(),
      selectedFeatures: z.array(z.string()),
      totalPrice: z.number(),
    }),
  ),
}) satisfies z.ZodType<CreatePetReportDTO>;

export const getCreatePetReportFieldErrors = (
  error: z.ZodError<CreatePetReportDTO>,
) => {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join('.');
    if (!key) return acc;

    acc[key] ??= [];
    acc[key].push(issue.message);

    return acc;
  }, {});
};

export interface PurchasedResourceResponse {
  id: string;
  name: string;
  type: 'manual' | 'workshop';
  imageUrl: string;
  description?: string;
}
