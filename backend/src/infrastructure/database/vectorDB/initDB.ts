import vectorDB from '@infrastructure/database/vectorDB/vectorDatabase';
import { petConfig } from '@domain/models/vector/petSchema';
import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
  if (args[0] == 'rename') {
    console.log('renaming files, no interaction to the database being made');
    await readDirectory(baseRoute, renameFiles);
  } else {
    try {
      console.log('Inserting images to the database');
      await startVectorDB();
      await readDirectory(baseRoute, insertImages);
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
    const _ = await Promise.all(
      files.map(async (f, idx) => {
        const thisPath = `${directoryPath}/${f}`;

        if (fs.lstatSync(thisPath).isDirectory())
          await readDirectory(thisPath, fn);
        else await fn(directoryPath, thisPath, idx);
      }),
    );
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
const details = ['pequeño', 'grande', 'gordito', 'cafe'];
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
      details: details[Math.floor(Math.random() * details.length)],
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

await main().then(() =>
  console.log('Vector Database finished being initialized'),
);
