export interface SearchFormData {
  especie: '' | 'Perro' | 'Gato' | 'Otro';
  tamano: '' | 'Pequeno' | 'Mediano' | 'Grande';
  edadAproximada: number | '';
  sexo: '' | 'Macho' | 'Hembra';
  esterilizado: boolean;
  collarPlaca: boolean;
  condicionFisica: string;

  referenciasVisuales: string;
  tipoZona: '' | 'Residencial' | 'Rural' | 'Ciudad' | 'Carretera';
  circunstanciasAdicionales: string;

  personalidad: string;
  seDejaAgarrar: '' | 'Si' | 'No' | 'Depende';
  reaccionRuidos: '' | 'Se asusta' | 'Huye' | 'Ignora' | 'Otro';
  reaccionRuidosOtro: string;
  respondeNombre: '' | 'Si' | 'No' | 'A veces';
  acostumbradoSalir: boolean;
  haEscapadoAntes: boolean;
  quePasoEscapado: string;
  tieneMiedo: string;
  leFacilSocializar: '' | 'Si' | 'No';

  cuentaAyuda: '' | 'Varias personas' | '1-2 personas' | 'Solo';
  queHayCerca: string;
  animalesCallejeros: '' | 'Muchos' | 'Pocos' | 'Ninguno' | 'No se';
  nivelTrafico: '' | 'Alto' | 'Medio' | 'Bajo';
  familiaridadZona: '' | 'Muy familiar' | 'Poco' | 'Nada';

  apedidoA: string;
  jugueteManta: string;
  comidaFavorita: string;
  queHaceVolver: string;
  lugarFavorito: string;

  cartillaVacunacion: File | null;
}

export const initialSearchFormData: SearchFormData = {
  especie: '',
  tamano: '',
  edadAproximada: '',
  sexo: '',
  esterilizado: false,
  collarPlaca: false,
  condicionFisica: '',

  referenciasVisuales: '',
  tipoZona: '',
  circunstanciasAdicionales: '',

  personalidad: '',
  seDejaAgarrar: '',
  reaccionRuidos: '',
  reaccionRuidosOtro: '',
  respondeNombre: '',
  acostumbradoSalir: false,
  haEscapadoAntes: false,
  quePasoEscapado: '',
  tieneMiedo: '',
  leFacilSocializar: '',

  cuentaAyuda: '',
  queHayCerca: '',
  animalesCallejeros: '',
  nivelTrafico: '',
  familiaridadZona: '',

  apedidoA: '',
  jugueteManta: '',
  comidaFavorita: '',
  queHaceVolver: '',
  lugarFavorito: '',

  cartillaVacunacion: null,
};
