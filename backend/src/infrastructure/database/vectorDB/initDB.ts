import vectorDB from '@infrastructure/database/vectorDB/vectorDatabase';
import { petConfig } from '@domain/models/vector/petSchema';
import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

// ========= Configuration =============
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PROJECT_ROOT = resolve(__dirname, '../../../../../');
const baseRoute = path.join(PROJECT_ROOT + '/vectorDatabase/');

// =====================================
// ===== Start of the function =========
// =====================================
async function main() {
  const args = process.argv.slice(2);
  let fn = args[0] == 'populate' ? populate : insertImages;
  if (args[0] == 'rename') {
    console.log('renaming files, no interaction to the database being made');
    await readDirectory(baseRoute, renameFiles);
  } else {
    try {
      console.log('Inserting images to the database');
      await startVectorDB();
      await readDirectory(baseRoute, fn);
      console.log('Images inserted into the database successfully');
    } catch (error) {
      console.error('======= Docker container not started =======');
      console.log(error);
    }
  }
}

// ========= Search files in base folder =============
async function readDirectory(
  directoryPath: string,
  fn: (directoryPath: string, thisPath: string, idx: number) => void,
) {
  await fs.readdir(directoryPath, async (err, files) => {
    await files.forEach(async (f, idx) => {
      const thisPath = `${directoryPath}/${f}`;

      if (fs.lstatSync(thisPath).isDirectory())
        await readDirectory(thisPath, fn);
      else await fn(directoryPath, thisPath, idx);
    });
  });
}

// ========= VectorDB init =============
async function startVectorDB() {
  await vectorDB.schema.deleteAll();

  await vectorDB.schema.classCreator().withClass(petConfig).do();

  const schemaRes = await vectorDB.schema.getter().do();
  console.log(schemaRes);
}

const locations = ['Querétaro', 'CDMX', 'Chile', 'Argentina'];
const colors = ['cafe', 'negro', 'blanco', 'blanco manchas negras', 'amarillo'];

// ========= Insert images into vector DB =============
async function insertImages(
  directoryPath: string,
  thisPath: string,
  idx: number,
) {
  const img = await fs.readFileSync(thisPath);
  const baseName = directoryPath.split('/').at(-1);
  const imgb64 = img.toString('base64');
  await vectorDB.data
    .creator()
    .withClassName('Pet')
    .withProperties({
      refId: `test_${baseName}_${idx}`,
      image: imgb64,
      species: baseName,
      color: colors[Math.floor(Math.random() * colors.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
    })
    .do();
}

// ========= Rename photos to top folder name =============
async function renameFiles(
  directoryPath: string,
  thisPath: string,
  idx: number,
) {
  const img = await fs.readFileSync(thisPath);
  const baseName = directoryPath.split('/').at(-1);
  await fs.writeFileSync(directoryPath + `/${baseName}_${idx}.jpg`, img);
  await fs.rm(thisPath, (err) => {
    if (err) console.log(err);
  });
}

async function populate(_baseUrl: string, thisPath: string, _idx: number) {
  const img = await fs.readFileSync(thisPath);
  const imgb64 = img.toString('base64');

  const validPayload = {
    species: 'Perro',
    date: '2024-03-15',
    breed: 'Labrador',
    sex: 'Macho',
    color: 'Dorado',
    size: 'Mediana: 11 a 25 kg',
    description: 'Perro amigable con collar rojo',
    location: 'Parque Central',
    locationCoords: [19.43376836020933, -99.12842362266052],
    defaultLocation: {
      coords: [19.43376836020933, -99.12842362266052],
      displayName: 'Querétaro',
      properties: {
        city: 'Querétaro',
        country: 'México',
        state: 'Querétaro',
      },
    },
    contactName: 'Juan Perez',
    phoneNumber: '+521234567890',
    email: 'juan@example.com',
    images: [imgb64],
  };

  const res = await axios.post('http://localhost:3000/found-pets/report', {
    ...validPayload,
  });

  if (res.status !== 201)
    throw Error('Error in creating new found pet reports');

  // console.log(res.data);
}

await main().then(() =>
  console.log('Vector Database finished being initialized'),
);
