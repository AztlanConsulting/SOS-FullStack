export const petConfig = {
  class: 'Pet',
  vectorizer: 'img2vec-neural',
  vectorIndexType: 'hnsw',
  moduleConfig: {
    'img2vec-neural': {
      imageFields: ['image'],
    },
  },
  properties: [
    {
      name: 'image',
      dataType: ['blob'],
    },
    {
      name: 'species',
      dataType: ['string'],
    },
  ],
};
