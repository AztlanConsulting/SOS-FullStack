import createProdDB from './data/prod/createProd.data';
import createMockDB from './data/mock/mock.data';

async function main() {
  const enviroment = process.argv.at(2) ?? null;

  switch (enviroment) {
    case 'production':
      await createProdDB();
      break;
    case 'develop':
      await createMockDB();
      break;
    default:
      console.error('\x1b[31mParámetros válidos: [production | develop]');
  }
}

await main();
