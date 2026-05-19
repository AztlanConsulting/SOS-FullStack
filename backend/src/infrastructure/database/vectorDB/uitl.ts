import { petConfig } from '@/domain/models/vector/petSchema';
import vectorDB from './vectorDatabase';

// ========= VectorDB init =============
async function startVectorDB() {
  await vectorDB.schema.deleteAll();

  await vectorDB.schema.classCreator().withClass(petConfig).do();

  const schemaRes = await vectorDB.schema.getter().do();
  console.log(schemaRes);
}

export default startVectorDB;
