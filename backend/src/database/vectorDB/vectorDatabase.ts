import weaviate, { toBase64FromBlob } from "weaviate-ts-client";

// Establecer conexión
const client = weaviate.client({
  scheme: "http",
  host: process.env.VECTOR_DB ?? "localhost:8080",
})

export default client;