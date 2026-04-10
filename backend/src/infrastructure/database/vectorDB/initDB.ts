import vectorDB from '@infrastructure/database/vectorDB/vectorDatabase';
import { petConfig } from '@domain/models/vector/petSchema';

await vectorDB.schema.deleteAll();

await vectorDB.schema.classCreator().withClass(petConfig).do();

const schemaRes = await vectorDB.schema.getter().do();
console.log(schemaRes);
