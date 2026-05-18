import vectorDB from './vectorDatabase';

const data = await vectorDB.graphql
  .get()
  .withClassName('Pet')
  .withFields(' refId species location color')
  .do();

const petIds = data.data.Get.Pet;

console.log(petIds);
