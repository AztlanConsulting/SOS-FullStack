import type { Document, Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface SearchFormReport {
  _id: Types.ObjectId;

  especie: 'Perro' | 'Gato' | 'Otro';
  tamano: 'Pequeno' | 'Mediano' | 'Grande';
  edadAproximada: number;
  sexo: 'Macho' | 'Hembra';
  esterilizado: 'Si' | 'No';
  collarPlaca: 'Si' | 'No';
  condicionFisica: string;

  referenciasVisuales: string;
  tipoZona: 'Residencial' | 'Rural' | 'Ciudad' | 'Carretera';
  circunstanciasAdicionales: string;

  personalidad: string;
  seDejaAgarrar: 'Si' | 'No' | 'Depende';
  reaccionRuidos: 'Se asusta' | 'Huye' | 'Ignora' | 'Otro';
  reaccionRuidosOtro: string;
  respondeNombre: 'Si' | 'No' | 'A veces';
  acostumbradoSalir: 'Si' | 'No';
  haEscapadoAntes: 'Si' | 'No';
  quePasoEscapado: string;
  tieneMiedo: string;
  leFacilSocializar: 'Si' | 'No';

  cuentaAyuda: 'Varias personas' | '1-2 personas' | 'Solo';
  queHayCerca: string;
  animalesCallejeros: 'Muchos' | 'Pocos' | 'Ninguno' | 'No se';
  nivelTrafico: 'Alto' | 'Medio' | 'Bajo';
  familiaridadZona: 'Muy familiar' | 'Poco' | 'Nada';

  apedidoA: string;
  jugueteManta: string;
  comidaFavorita: string;
  queHaceVolver: string;
  lugarFavorito: string;

  cartillaVacunacion: string;
}

export interface ISearchForm extends SearchFormReport, Document {}

const searchFormSchema = new Schema<ISearchForm>(
  {
    especie: {
      type: String,
      required: true,
      enum: ['Perro', 'Gato', 'Otro'],
    },
    tamano: {
      type: String,
      required: true,
      enum: ['Pequeno', 'Mediano', 'Grande'],
    },
    edadAproximada: { type: Number, required: true },
    sexo: {
      type: String,
      required: true,
      enum: ['Macho', 'Hembra'],
    },
    esterilizado: { type: String, required: true, enum: ['Si', 'No'] },
    collarPlaca: { type: String, required: true, enum: ['Si', 'No'] },
    condicionFisica: { type: String, required: true },

    referenciasVisuales: { type: String, required: true },
    tipoZona: {
      type: String,
      required: true,
      enum: ['Residencial', 'Rural', 'Ciudad', 'Carretera'],
    },
    circunstanciasAdicionales: { type: String, required: true },

    personalidad: { type: String, required: true },
    seDejaAgarrar: {
      type: String,
      required: true,
      enum: ['Si', 'No', 'Depende'],
    },
    reaccionRuidos: {
      type: String,
      required: true,
      enum: ['Se asusta', 'Huye', 'Ignora', 'Otro'],
    },
    reaccionRuidosOtro: { type: String, required: false },
    respondeNombre: {
      type: String,
      required: true,
      enum: ['Si', 'No', 'A veces'],
    },
    acostumbradoSalir: { type: String, required: true, enum: ['Si', 'No'] },
    haEscapadoAntes: { type: String, required: true, enum: ['Si', 'No'] },
    quePasoEscapado: { type: String, required: true },
    tieneMiedo: { type: String, required: true },
    leFacilSocializar: {
      type: String,
      required: true,
      enum: ['Si', 'No'],
    },

    cuentaAyuda: {
      type: String,
      required: true,
      enum: ['Varias personas', '1-2 personas', 'Solo'],
    },
    queHayCerca: { type: String, required: true },
    animalesCallejeros: {
      type: String,
      required: true,
      enum: ['Muchos', 'Pocos', 'Ninguno', 'No se'],
    },
    nivelTrafico: {
      type: String,
      required: true,
      enum: ['Alto', 'Medio', 'Bajo'],
    },
    familiaridadZona: {
      type: String,
      required: true,
      enum: ['Muy familiar', 'Poco', 'Nada'],
    },

    apedidoA: { type: String, required: true },
    jugueteManta: { type: String, required: true },
    comidaFavorita: { type: String, required: true },
    queHaceVolver: { type: String, required: true },
    lugarFavorito: { type: String, required: true },

    cartillaVacunacion: { type: String, required: true },
  },
  { timestamps: true },
);

export const SearchFormModel = model<ISearchForm>(
  'SearchForm',
  searchFormSchema,
);
