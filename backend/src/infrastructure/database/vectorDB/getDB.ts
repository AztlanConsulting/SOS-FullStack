import vectorDB from './vectorDatabase';

const pets = await vectorDB.graphql
  .get()
  .withClassName('Pet')
  .withFields('refId')
  .do();

const refIds = pets.data.Get.Pet;

console.log(refIds);
