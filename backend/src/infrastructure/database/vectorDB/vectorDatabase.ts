import weaviate from 'weaviate-ts-client';

// Establecer conexión
const vectorDB = weaviate.client({
  scheme: 'http',
  host: process.env.VECTOR_DB ?? 'localhost:8080',
});

export default vectorDB;
