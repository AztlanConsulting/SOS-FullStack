import { WorkshopModel } from '@/domain/models/workshop.model';

async function initWorkshopDB() {
  const baseContent = [
    {
      type: 'text',
      content:
        'Las mascotas necesitan rutina, cariño y atención diaria para mantenerse felices y saludables.',
    },
    {
      type: 'image',
      content:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      type: 'text',
      content:
        'Un perro bien entrenado no solo es más obediente, también es más seguro y feliz en su entorno.',
    },
  ];

  const workshop = {
    name: 'Taller de entrenar perros para que no se escapen',
    description: 'Perros bien portados',
    price: 100,
    content: baseContent,
    category: ['perros', 'gatos', 'duelo'],
    imageUrl:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.tXOFLzddTwGOR91qug-GDAHaFw%3Fpid%3DApi&f=1&ipt=6ff6e19c1da5466b08ec7fff5af5532289ba77e2d94d5d9aca08862cd1a6b3e8&ipo=images',
  };

  const workshopA = { ...workshop, name: 'A' };
  const workshopZ = { ...workshop, name: 'Z' };
  const workshopExpensive = { ...workshop, price: 5000 };
  const workshopCheap = { ...workshop, price: 50 };
  const workshopSearch = { ...workshop, name: 'Some other thing' };

  const workshops = new Array(30).fill(workshop);

  workshops.push(workshopA);
  workshops.push(workshopZ);
  workshops.push(workshopExpensive);
  workshops.push(workshopCheap);
  workshops.push(workshopSearch);

  await WorkshopModel.insertMany(workshops);
}

export default initWorkshopDB;
