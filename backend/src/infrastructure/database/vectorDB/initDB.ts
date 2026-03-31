import client from '@vectorDB';
import { petConfig } from 'src/domain/models/vector/petSchema';

await client.schema.deleteAll();

await client.schema.classCreator().withClass(petConfig).do();

const schemaRes = await client.schema.getter().do();
console.log(schemaRes);
