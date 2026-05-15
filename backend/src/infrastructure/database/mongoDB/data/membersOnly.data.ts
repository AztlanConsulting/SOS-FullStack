import { MembersOnlyModel } from '@domain/models/membersOnly.model';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    name: 'Manual de Búsqueda',
    duration: 20,
    content: `Las primeras horas tras la pérdida de tu mascota son las más cruciales. La rapidez con la que actúes puede marcar la diferencia entre encontrarla o no.

Lo primero que debes hacer es recorrer el área inmediata a tu hogar, llamando a tu mascota con calma y sin gritar. Los animales asustados tienden a esconderse y los ruidos fuertes pueden alejarlos más.

Avisa de inmediato a tus vecinos más cercanos. Ellos son tus mejores aliados en las primeras horas, ya que conocen el entorno y pueden estar atentos.

Regresa al lugar donde la viste por última vez y busca rastros: pelo, huellas, o cualquier señal de que estuvo ahí recientemente.

Publica en grupos locales de redes sociales con una foto reciente y la última ubicación conocida. Incluye tu número de teléfono y ofrece una recompensa si es posible.

Recuerda: la mayoría de las mascotas perdidas son encontradas dentro de un radio de 2 km de su hogar en las primeras 24 horas.`,
    imageFile: 'ManualBusqueda.png',
    pdfFile: 'Checklist.pdf',
  },
  {
    name: 'Checklist de Búsqueda',
    duration: 15,
    content: `Contar con un checklist claro te ayuda a no perder pasos importantes cuando el estrés de la situación puede nublarte la mente.

Revisa punto por punto cada acción que debes tomar: desde alertar a vecinos y publicar en redes, hasta visitar refugios y colocar carteles en puntos estratégicos.

El checklist incluye recordatorios para las primeras horas, el primer día y los días siguientes, asegurando que tu búsqueda sea constante y organizada.

Descarga el PDF y tenlo a la mano para ir marcando cada paso completado. Compartirlo con familiares o amigos que te ayuden en la búsqueda también puede ser de gran utilidad.`,
    imageFile: 'Checklist.png',
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
