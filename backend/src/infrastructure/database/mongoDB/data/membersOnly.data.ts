import { MembersOnlyModel } from '@domain/models/membersOnly.model';
import fs from 'fs';
import path from 'path';

const MOCK_FILES_DIR = path.join(__dirname, 'mock-files');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'members-only');

function copyToUploads(srcName: string, destName: string): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  fs.copyFileSync(
    path.join(MOCK_FILES_DIR, srcName),
    path.join(UPLOADS_DIR, destName),
  );
}

const items = [
  {
    name: 'A - Primer Recurso de Búsqueda',
    duration: 5,
    content: 'Recurso ancla para ordenamiento ascendente por nombre.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Acuarios y Mascotas Perdidas',
    duration: 12,
    content:
      'Guía especial para dueños de peces y animales acuáticos extraviados.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Aviso en Redes Sociales',
    duration: 10,
    content:
      'Cómo publicar de forma efectiva en Facebook, Instagram y grupos locales.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Carteles y Flyers de Búsqueda',
    duration: 15,
    content:
      'Diseña carteles llamativos con foto, descripción y datos de contacto.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Checklist de Búsqueda',
    duration: 15,
    content:
      'Contar con un checklist claro te ayuda a no perder pasos importantes cuando el estrés de la situación puede nublarte la mente.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Colaboración con Refugios',
    duration: 18,
    content:
      'Cómo contactar y colaborar con refugios y protectoras de animales locales.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Comportamiento Animal Bajo Estrés',
    duration: 22,
    content:
      'Entiende cómo reaccionan los animales cuando están perdidos o asustados.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Denuncia y Registro Oficial',
    duration: 8,
    content:
      'Pasos para registrar la pérdida de tu mascota ante las autoridades locales.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Estrategias de Búsqueda Nocturna',
    duration: 20,
    content:
      'Técnicas y precauciones para buscar a tu mascota durante la noche.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Fotografía para Identificación',
    duration: 10,
    content:
      'Cómo tomar y usar fotografías claras para identificar a tu mascota perdida.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Guía de Primeros Auxilios',
    duration: 25,
    content: 'Qué hacer si encuentras a tu mascota herida o en mal estado.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Herramientas Digitales de Búsqueda',
    duration: 14,
    content: 'Apps y plataformas online especializadas en mascotas perdidas.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Identificación con Microchip',
    duration: 16,
    content:
      'Cómo funciona el microchip y por qué es la mejor forma de identificar a tu mascota.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Manejo del Estrés del Dueño',
    duration: 12,
    content:
      'Consejos para mantener la calma y la eficacia durante la búsqueda.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Manual de Búsqueda',
    duration: 20,
    content:
      'Las primeras horas tras la pérdida de tu mascota son las más cruciales. La rapidez con la que actúes puede marcar la diferencia entre encontrarla o no.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Prevención de Fugas en Casa',
    duration: 18,
    content:
      'Medidas para asegurar tu hogar y evitar que tu mascota escape nuevamente.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Protocolo de Reunificación',
    duration: 10,
    content: 'Qué hacer cuando alguien dice haber encontrado a tu mascota.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Rastreo con Voluntarios',
    duration: 30,
    content:
      'Cómo organizar grupos de voluntarios para ampliar el área de búsqueda.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Recompensas y Motivación',
    duration: 8,
    content: 'Cómo y cuándo ofrecer recompensas para incentivar la búsqueda.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Registro de Vacunación y Salud',
    duration: 12,
    content:
      'Mantén actualizado el historial médico de tu mascota para facilitar su identificación.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Señales de Avistamiento',
    duration: 10,
    content: 'Cómo reportar y procesar avistamientos de mascotas perdidas.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Trampas Humanas de Captura',
    duration: 20,
    content:
      'Uso seguro de trampas para capturar mascotas asustadas que huyen del contacto.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Uso del Olfato Canino',
    duration: 22,
    content:
      'Cómo trabajar con perros rastreadores para encontrar mascotas perdidas.',
    imageFile: 'Checklist.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Veterinarios y Clínicas Aliadas',
    duration: 14,
    content:
      'Red de veterinarios que colaboran en la identificación y reunificación de mascotas.',
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Z - Ultimo Recurso de Búsqueda',
    duration: 5,
    content: 'Recurso ancla para ordenamiento descendente por nombre.',
    imageFile: 'ManualPA.png',
    pdfFile: 'Checklist.pdf',
  },
];

export async function initMembersOnlyDB() {
  const docs = items.map((item) => {
    const imgDest = `mock-${item.imageFile}`;
    const pdfDest = `mock-${item.pdfFile}`;

    copyToUploads(item.imageFile, imgDest);
    copyToUploads(item.pdfFile, pdfDest);

    return {
      name: item.name,
      duration: item.duration,
      content: item.content,
      imageUrl: `/members-only/file/${imgDest}`,
      pdfUrl: `/members-only/file/${pdfDest}`,
    };
  });

  await MembersOnlyModel.insertMany(docs);
}

export default initMembersOnlyDB;
