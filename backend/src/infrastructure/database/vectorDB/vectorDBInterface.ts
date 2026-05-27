import { clean } from 'semver';
import vectorDB from './vectorDatabase';
import { petConfig } from '@/domain/models/vector/petSchema';
import startVectorDB from './uitl';

async function get() {
  const data = await vectorDB.graphql
    .get()
    .withClassName('Pet')
    .withFields(' refId species location color')
    .withLimit(50)
    .do();

  const petIds = data.data.Get.Pet;

  console.log(petIds);
}

async function getIds() {
  const pets = await vectorDB.graphql
    .get()
    .withClassName('Pet')
    .withFields('refId')
    .withLimit(50)
    .do();

  const refIds = pets.data.Get.Pet;

  console.log(refIds);
}

async function start() {
  const method = process.argv[2];
  // console.log(method);
  switch (method) {
    case 'get':
      await get();
      break;
    case 'getId':
      await getIds();
      break;
    case 'clean':
      await startVectorDB();
      console.log('VectorDB clean');
      break;
    default:
      console.log('Error: code not accepted, use - [get, getId, clean]');
      process.exit(1);
  }
}

await start();
