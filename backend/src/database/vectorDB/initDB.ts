import client from "@vectorDB";
import { petConfig } from "../../repository/model/vector/petSchema";

await client.schema.deleteAll();

await client.schema.classCreator().withClass(petConfig).do();

const schemaRes = await client.schema.getter().do();
console.log(schemaRes);
