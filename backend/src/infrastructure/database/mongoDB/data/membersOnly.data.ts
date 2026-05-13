import { MembersOnlyModel } from '@domain/models/membersOnly.model';

export async function initMembersOnlyDB() {
  const base = {
    name: 'Guia de cuidado para mascotas',
    duration: 30,
    content: 'Contenido del recurso para miembros',
    imageUrl: 'https://example.com/image.png',
    pdfUrl: 'https://example.com/file.pdf',
  };

  const nameA = { ...base, name: 'A - Primer recurso exclusivo' };
  const nameZ = { ...base, name: 'Z - Ultimo recurso exclusivo' };
  const searchable = { ...base, name: 'Recursos sobre acuarios en casa' };

  // 22 base + 3 special = 25 total
  // page=0..3 → 6 items each, page=4 → 1 item
  const items = new Array(22).fill(base);
  items.push(nameA);
  items.push(nameZ);
  items.push(searchable);

  await MembersOnlyModel.insertMany(items);
}

export default initMembersOnlyDB;
