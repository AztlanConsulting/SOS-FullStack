import { BlogModel } from '@/domain/models/blog.model';

export async function initBlogDB() {
  const blog = {
    name: 'Guia completa para el cuidado de perros',
    duration: 10,
    content: [
      {
        content:
          'Cuidar a un perro implica mucho más que alimentarlo. Es fundamental brindarle atención, ejercicio diario, revisiones veterinarias periódicas y un entorno seguro donde pueda desarrollarse adecuadamente.',
        type: 'text',
      },
      {
        content:
          'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200&auto=format&fit=crop',
        type: 'image',
      },
      {
        content:
          'El ejercicio es clave para mantener la salud física y mental de tu mascota. Paseos diarios, juegos interactivos y entrenamiento ayudan a prevenir problemas de comportamiento.',
        type: 'text',
      },
      {
        content:
          'Una alimentación balanceada debe adaptarse a la edad, tamaño y nivel de actividad del perro. Consultar con un veterinario es siempre la mejor opción para elegir el alimento adecuado.',
        type: 'text',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&auto=format&fit=crop',
  };

  const blogCat = {
    ...blog,
    name: 'Cuidados esenciales para gatos',
    content: [
      {
        content:
          'Los gatos son animales independientes pero requieren cuidados específicos para mantenerse saludables. Su alimentación debe ser rica en proteínas y siempre deben tener acceso a agua fresca.',
        type: 'text',
      },
      {
        content:
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&auto=format&fit=crop',
        type: 'image',
      },
      {
        content:
          'Es importante mantener limpia su caja de arena y proporcionar espacios donde puedan trepar y descansar. Esto mejora su bienestar emocional.',
        type: 'text',
      },
      {
        content:
          'Las visitas al veterinario ayudan a detectar enfermedades a tiempo y mantener al día su esquema de vacunación.',
        type: 'text',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&auto=format&fit=crop',
  };

  const blogTraining = {
    ...blog,
    name: 'Entrenamiento efectivo para cachorros',
    content: [
      {
        content:
          'El entrenamiento desde temprana edad es fundamental para desarrollar buenos hábitos en los cachorros. La constancia y la paciencia son claves.',
        type: 'text',
      },
      {
        content:
          'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=1200&auto=format&fit=crop',
        type: 'image',
      },
      {
        content:
          'El refuerzo positivo, como premios y caricias, ayuda a que el perro asocie comportamientos correctos con experiencias agradables.',
        type: 'text',
      },
      {
        content:
          'Evita castigos severos, ya que pueden generar miedo y ansiedad en tu mascota.',
        type: 'text',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=800&auto=format&fit=crop',
  };

  const blogVet = {
    ...blog,
    name: 'Importancia del veterinario en mascotas',
    content: [
      {
        content:
          'Las visitas regulares al veterinario son esenciales para prevenir enfermedades y asegurar una vida larga y saludable para tu mascota.',
        type: 'text',
      },
      {
        content:
          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&auto=format&fit=crop',
        type: 'image',
      },
      {
        content:
          'Las vacunas, desparasitaciones y chequeos generales deben formar parte de la rutina de cuidado.',
        type: 'text',
      },
      {
        content:
          'Un diagnóstico temprano puede marcar la diferencia en el tratamiento de muchas enfermedades.',
        type: 'text',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop',
  };

  const blogBirds = {
    ...blog,
    name: 'Cuidados para aves domesticas',
    content: [
      {
        content:
          'Las aves requieren un ambiente limpio, amplio y seguro. Es importante proporcionarles estimulación diaria.',
        type: 'text',
      },
      {
        content:
          'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1200&auto=format&fit=crop',
        type: 'image',
      },
      {
        content:
          'Su dieta debe incluir semillas, frutas y verduras dependiendo de la especie.',
        type: 'text',
      },
      {
        content:
          'Mantener su jaula limpia previene enfermedades y mejora su calidad de vida.',
        type: 'text',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&auto=format&fit=crop',
  };

  const blogFish = {
    ...blog,
    name: 'Guia para acuarios en casa',
    content: [
      {
        content:
          'Tener peces en casa requiere mantener un equilibrio en el ecosistema del acuario.',
        type: 'text',
      },
      {
        content:
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&auto=format&fit=crop',
        type: 'image',
      },
      {
        content:
          'Controlar la temperatura, el pH del agua y la limpieza del tanque es esencial.',
        type: 'text',
      },
      {
        content:
          'Un buen sistema de filtrado ayuda a mantener el agua en condiciones óptimas.',
        type: 'text',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop',
  };

  const blogs = new Array(20).fill(blog);

  blogs.push(blogCat);
  blogs.push(blogTraining);
  blogs.push(blogVet);
  blogs.push(blogBirds);
  blogs.push(blogFish);

  await BlogModel.insertMany(blogs);
}

export default initBlogDB;
