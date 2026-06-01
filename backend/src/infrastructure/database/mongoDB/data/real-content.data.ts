import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BlogModel } from '@domain/models/blog.model';
import { ManualModel } from '@domain/models/manual.model';
import { MembersOnlyModel } from '@domain/models/membersOnly.model';
import { WorkshopModel } from '@domain/models/workshop.model';
import type { ContentBlock } from '@validation/content.types';

const REAL_CONTENT_PRICE_MXN = 50;
const BLOG_WORDS_PER_MINUTE = 200;
const MANUALS_ROUTE = '../../../../../uploads/manuals/';
const WORKSHOP_ROUTE = '../../../../../uploads/workshop/';
const BLOGS_ROUTE = '../../../../../uploads/blogs/';
const MEMBERS_ONLY_ROUTE = '../../../../../uploads/members-only/';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const sourceAssetsDir = [
  path.join(currentDir, 'real-files'),
  path.join(
    process.cwd(),
    'src',
    'infrastructure',
    'database',
    'mongoDB',
    'data',
    'real-files',
  ),
].find((candidate) => fs.existsSync(candidate));

const uploadsDir = path.join(process.cwd(), 'uploads');

type ProductContentSeed = {
  name: string;
  description: string;
  detail: string;
  imageFileName: string;
  materialFileName?: string;
  materialUrl?: string;
};

type BlogSeed = {
  name: string;
  description: string;
  entry: string;
  imageFileName: string;
};

type MembersOnlySeed = {
  name: string;
  description: string;
  detail?: string;
  imageFileName: string;
  materialFileName: string;
};

const manualSeeds: ProductContentSeed[] = [
  {
    name: 'Manual de primeros auxilios',
    description:
      'Con este manual aprenderás qué medidas tomar ante una emergencia para actuar de forma rápida y segura, ayudando a mantener las constantes vitales mientras llega la atención profesional.',
    detail: `Cuando se trata de salvar una vida, actuar rápido y con conocimiento puede marcar la diferencia.
En una emergencia, cada segundo cuenta. Saber qué hacer —y qué evitar— puede ayudar a mantener estable a tu mascota mientras recibe atención profesional.

Este manual fue creado para orientar a cualquier persona que desee aprender a reaccionar correctamente ante situaciones de emergencia con perros o gatos. También es una herramienta de gran apoyo para cuidadores, rescatistas y tutores de mascotas.

¿Qué encontrarás en este manual?
Aspectos importantes de primeros auxilios
Cómo mantener la calma y actuar correctamente
Recomendaciones básicas ante una emergencia
Cómo armar un botiquín para mascotas
Antisépticos y productos de uso tópico
Medicamentos y productos de uso oral
Utensilios básicos indispensables
Uso del bozal
Cuándo utilizarlo
Cómo hacer un bozal provisional
Transportación segura
Formas adecuadas de transportar a tu mascota lesionada
Recomendaciones especiales para gatos
Síntomas y tratamiento en emergencias comunes
Picaduras de araña o abeja
Mordedura de serpiente
Sangrado
Hinchazón y torsión gástrica
Quemaduras
Deshidratación
Congelamiento
Golpe de calor
Envenenamiento
Asfixia
Apertura de vías respiratorias
Maniobra de Heimlich para mascotas
Lesiones
Esguinces y distensiones
Fracturas
Dislocaciones articulares
Lesiones traumáticas
Espalda lesionada
Accidentes automovilísticos
Shock
Shock leve
Shock grave
Shock terminal
Técnicas de RCP
Reanimación cardiopulmonar básica para mascotas
Información de emergencia
Datos importantes que debes tener siempre a la mano`,
    imageFileName: MANUALS_ROUTE + 'mock-ManualPA.png',
    materialFileName:
      MANUALS_ROUTE + 'PRIMEROS AUXILIOS - SOS Encontrando - EL MANUAL.pdf',
  },
  {
    name: 'Manual de busqueda',
    description:
      'Una guía práctica y emocional para ayudarte a actuar rápidamente cuando tu mascota se pierde. Aprende qué hacer desde el primer momento, cómo organizar la búsqueda y aumentar las probabilidades de encontrarla con estrategias reales y efectivas.',
    detail: `Este manual fue creado para ayudarte a actuar rápidamente, organizar tu búsqueda y aumentar las probabilidades de encontrar a tu mascota. Aquí encontrarás estrategias prácticas, herramientas útiles y orientación paso a paso para que no pierdas tiempo improvisando.

Aprenderás cómo aprovechar redes sociales, carteles, tecnología y métodos de búsqueda efectivos, además de técnicas menos convencionales que pueden ayudarte a ampliar las posibilidades de éxito.

También incluye apoyo emocional y consejos para mantener la claridad mental durante un proceso que puede ser profundamente desgastante.

Porque buscar con dirección siempre es mejor que buscar desde el caos.

2. Detalle
¿Qué encontrarás en este manual?

🐾 Qué hacer desde el primer minuto
Aprende cuáles son las acciones más importantes al detectar la desaparición de tu mascota y cuáles errores evitar.

📍 Estrategias de búsqueda organizadas
Métodos prácticos para buscar según el tipo de mascota, personalidad, zona y tiempo transcurrido.

📲 Uso inteligente de redes sociales y tecnología
Cómo crear publicaciones efectivas, aprovechar grupos, mapas, ubicación y difusión digital.

🖨️ Carteles y materiales de búsqueda
Consejos para diseñar anuncios visibles y útiles que realmente ayuden a generar reportes.

👃 Técnicas alternativas de búsqueda
Ideas menos conocidas relacionadas con olores, rutinas, comportamiento animal e intuición.

🤝 Organización de apoyo y voluntarios
Cómo coordinar familiares, amigos y vecinos sin duplicar tareas ni desperdiciar energía.

🧠 Apoyo emocional durante la búsqueda
Herramientas para manejar el estrés, mantener la claridad y sostener la esperanza.

💡 Consejos basados en experiencia real
Recomendaciones creadas desde la experiencia en casos reales de mascotas perdidas.

Cada minuto bien utilizado puede marcar una gran diferencia.
Tener una guía clara te permite actuar con más enfoque, calma y dirección desde el inicio.

👉 Consíguelo hoy mismo y comienza tu búsqueda con herramientas reales, organización y esperanza.`,
    imageFileName: MANUALS_ROUTE + 'mock-ManualBusqueda.png',
    materialFileName: MANUALS_ROUTE + 'SOS - Manual de busqueda.pdf',
  },
];

const workshopSeeds: ProductContentSeed[] = [
  {
    name: 'Duelo y amor: atravesando la pérdida de tu mascota',
    description:
      'A través de un taller grabado y un manual de apoyo emocional, encontrarás herramientas, ejercicios y contención para comprender tu duelo, honrar el vínculo con tu amor peludo y comenzar a sanar desde el amor.',
    detail: `La pérdida de una mascota puede dejar un vacío profundo y muchas veces incomprendido por quienes nos rodean.
Duelo y Amor nace como un espacio de acompañamiento emocional para ayudarte a atravesar este proceso con mayor comprensión, sensibilidad y herramientas prácticas.
Este taller incluye un enfoque humano y terapéutico para ayudarte a resignificar el amor, el vínculo y la despedida de tu compañero peludo.
¿Qué incluye este taller?
💜 Taller grabado
Accede al contenido en video y míralo las veces que necesites, a tu ritmo y en el momento que más lo necesites.
📖 Manual de apoyo emocional
“Superando el duelo incomprendido”, con reflexiones, ejercicios prácticos y herramientas para acompañar tu proceso de sanación.
🧠 Acompañamiento terapéutico profesional
Contenido desarrollado junto a la psicoterapeuta Mar Chávez García Silva, especializada en terapia cognitivo-conductual y trabajo emocional.
🌱 Herramientas para sanar el corazón
Ejercicios y recursos para comprender tus emociones, procesar la pérdida y encontrar formas amorosas de honrar a tu mascota.
🐾 Un espacio donde tu duelo sí es válido
Porque perder a una mascota también es perder familia, rutina, compañía y amor.

Sobre la terapeuta
Mar Chávez García Silva es psicoterapeuta especializada en terapia cognitivo-conductual con un enfoque profundo en las emociones. Su amor y conexión con los animales la llevaron a participar en este taller con la intención de acompañar a quienes atraviesan el dolor de perder a un compañero peludo, ofreciendo herramientas de apoyo, comprensión y esperanza.

✨ Esperamos que este taller te brinde contención, claridad y compañía en un momento tan sensible, ayudándote a transformar el dolor en un proceso de amor y resignificación.`,
    imageFileName: WORKSHOP_ROUTE + 'Duelo taller SOS Encontrando Mascotas.png',
    materialUrl:
      'https://us06web.zoom.us/rec/share/8VwqYU-uPq9f6VO_p1xBO3Pn5O2bCICin_jxsbhTs61lQ_vrWHs7o1W5N0BDR1W8.gtRGOwXeEdD8XqCg?startTime=1779484752000',
  },
];

const blogSeeds: BlogSeed[] = [
  {
    name: 'Tu Bienestar: Clave para Encontrar a tu Mascota Perdida',
    description:
      'Te compartimos consejos y estrategias para cuidar de ti mismo mientras continúas la búsqueda.',
    entry: `La Importancia del Autocuidado

Tu bienestar es una prioridad: En este difícil momento, recuerda que tu bienestar es fundamental. Al cuidarte, estás asegurando que tengas la energía y la claridad necesarias para seguir buscando a tu querida mascota. Tu amor por él se refleja en cada esfuerzo que haces para mantenerte fuerte y esperanzado.

Cuidarte es un acto de amor: Dedicar tiempo a tu bienestar no solo es un acto de cuidado hacia ti mismo, sino también hacia tu amor peludo. Al mantener tu mente y cuerpo saludables, estás mejor preparado para encontrarlo y traerlo de vuelta a casa. Tu fortaleza y resiliencia son la mayor prueba de tu amor incondicional.

Eres importante: En medio de la angustia y la desesperación, es vital que recuerdes tu propia importancia. Cuidar de ti mismo te permitirá mantener la esperanza y la energía para seguir adelante. Tu mascota te necesita en tu mejor versión, y cada paso que das hacia tu bienestar es un paso hacia su regreso.

La fuerza del amor: El amor que sientes por tu peludito es inmenso, y esa misma fuerza te ayudará a cuidarte y a seguir buscando. Permítete descansar, comer bien y encontrar momentos de paz. Tu bienestar es esencial para mantener viva la esperanza y para que cada día sea una nueva oportunidad de reencuentro.

Tu salud emocional es crucial: Es natural sentirte abrumado y triste, pero recuerda que tu salud emocional es crucial para enfrentar este desafío. Buscar apoyo, hablar de tus sentimientos y encontrar consuelo en pequeñas rutinas te dará la fuerza necesaria para continuar. Cuidarte es una manera de demostrar tu amor y compromiso con tu perrito.

Estrategias para Mantener el Bienestar
Acepta tus Emociones: Permítete sentir tus emociones sin juzgarlas. Es natural sentirse triste, ansioso o desesperado. Reconocer y aceptar tus sentimientos es el primer paso para manejarlos.

Frase: "Es natural sentirme así porque amo a mi mascota profundamente. Mis emociones son una expresión de ese amor."

Establece una Rutina: Mantén una estructura diaria que te dé una sensación de control y normalidad.

Frase: "Mi rutina me ayuda a mantenerme fuerte y enfocado en la búsqueda."

Busca Apoyo Social: Habla con amigos, familiares o únete a grupos de apoyo en línea. Compartir tu experiencia y escuchar a otros puede ser muy reconfortante.

Frase: "No estoy sola en esto, y cada ayuda que recibo me fortalece."

Mantente Activa: Realiza actividad física, como caminar, correr o practicar yoga. El ejercicio libera endorfinas, que pueden mejorar tu estado de ánimo.

Frase: "Cada paso que doy es un paso más cerca de encontrar a mi peludo."

Practica Técnicas de Relajación: Dedica unos minutos a la meditación o a la respiración profunda. Estas técnicas pueden ayudarte a reducir la ansiedad.

Frase: "Con cada respiración, me calmo y me lleno de energía para continuar la búsqueda."

Visualiza el Reencuentro: Imagina con claridad el momento en que vuelvas a ver a tu mascota. Visualiza cada detalle y siente la alegría en tu corazón.

Frase: "Estoy haciendo todo lo posible para encontrar a mi amor peludo, y tengo fe en que lo lograré."

Consejo
Realiza este ejercicio antes de salir a buscar a tu mascota o durante la búsqueda si te sientes agobiado/a.
La respiración profunda es una técnica simple pero poderosa para reducir la ansiedad y recuperar la calma. Aquí te ofrecemos un ejercicio fácil que puedes realizar en cualquier momento para centrar tu mente y aliviar el estrés:

Instrucciones Paso a Paso:

Encuentra un lugar tranquiloBusca un lugar donde puedas estar cómodo, de pie o sentado. Relaja los hombros y mantén una postura erguida pero sin tensiones.

Inhala profundamente por la nariz (4 segundos)

Cierra los ojos si te sientes cómodo/a.

Inhala lentamente por la nariz contando mentalmente hasta 4.

Mientras inhalas, siente cómo el aire llena tus pulmones y expande tu abdomen, no solo el pecho.

Imagina que el aire es energía calmante que entra en tu cuerpo.

Sostén la respiración (4 segundos)

Mantén el aire en tus pulmones contando mentalmente hasta 4.

Usa este momento para sentir la calma que el oxígeno trae a tu cuerpo.

Exhala lentamente por la boca (6 segundos)

Exhala despacio por la boca, como si estuvieras soplando suavemente, contando mentalmente hasta 6.

Al exhalar, siente cómo desaparece la tensión de tu cuerpo. Imagina que estás soltando todo el estrés y la ansiedad con cada exhalación.

Repite el ciclo

Repite el ciclo (inhala, sostén, exhala) de 5 a 10 veces o hasta que sientas que tu mente y cuerpo se han relajado.

Si sientes que tu mente se distrae, simplemente vuelve a enfocarte en la respiración.

Mantener tu bienestar es fundamental no solo para ti, sino también para tu amado perrito. Al cuidarte, estás asegurando que tengas la energía, la esperanza y la fortaleza necesarias para seguir buscándolo y atraerlo de vuelta a tu vida. Tu bienestar es una expresión de tu amor y compromiso, y es esencial para superar este desafío con la mayor claridad y fuerza posible.

Recuerda que está bien pedir ayuda si te sientes abrumado. Hablar con un terapeuta puede proporcionarte apoyo adicional y herramientas para manejar tus emociones. Tu bienestar es importante, y cuidarte te ayudará a mantener la energía y la esperanza necesarias para seguir buscando a tu querido perrito.

Queremos que sepas que entendemos cuánto amas a tu mascota y cuánto te duele su ausencia. Es fundamental que te cuides para poder seguir buscándola con energía y esperanza. Mantenerte bien no solo te ayudará a ti, sino que aumentará las posibilidades de reunir a tu familia peluda. No estás solo en esto; estamos aquí para apoyarte. 💜🤗`,
    imageFileName: BLOGS_ROUTE + 'Blog - Bienestar.png',
  },
  {
    name: 'Protege tu búsqueda: fraudes comunes en mascotas extraviadas',
    description:
      'Conoce las formas más comunes de fraude durante la búsqueda de mascotas perdidas y aprende cómo protegerte para evitar ser víctima de estafadores en un momento tan vulnerable.',
    entry: `Atención a todos los dueños de mascotas
Hemos detectado nuevas modalidades de estafa dirigidas a personas que están buscando a sus mascotas perdidas. Algunos delincuentes incluso están utilizando herramientas de inteligencia artificial (IA) para manipular fotografías publicadas en redes sociales y hacer más creíbles sus engaños.
Sabemos que perder a una mascota es un momento de angustia, miedo y desesperación. Precisamente por eso, estas personas buscan aprovecharse emocional y económicamente de las familias.
Queremos ayudarte a mantenerte alerta y protegerte.

¿Cómo funciona esta estafa?
Los delincuentes toman las fotografías de tu mascota publicadas en redes sociales y las modifican con IA para crear imágenes falsas en otros lugares o contextos. Después, te contactan asegurando que encontraron a tu mascota y solicitan dinero para devolverla.
En muchos casos:

Piden depósitos para transporte, gasolina o veterinario.

Dicen que enviarán a la mascota en Uber.

Aseguran que están fuera de la ciudad.

Evitan enviar fotos o videos recientes.

Utilizan la información de tu publicación para sonar convincentes.

🚨 Recomendaciones importantes
💜 Marca tus fotografías
Agrega marcas de agua, texto o detalles difíciles de editar.
💜 Solicita pruebas reales
Pide videollamadas o videos donde se vea claramente a tu mascota.
💜 Nunca hagas depósitos sin evidencia
No envíes dinero si no tienes pruebas claras y verificables.
💜 Haz preguntas trampa
Pregunta características falsas de tu mascota para detectar mentiras.
Ejemplo:
"¿Podría confirmarme que tiene un lunar rosa grande en la panza?"
Si la persona afirma que sí, probablemente está mintiendo.
💜 Verifica cualquier llamada sospechosa
Algunos delincuentes incluso se hacen pasar por SOS Encontrando Mascotas.
Si recibes una llamada “de nuestra parte”, escríbenos directamente por WhatsApp para confirmar la información.
💜 Reporta los intentos de fraude
Ayuda a prevenir más casos compartiendo números y reportando a las autoridades.

Modus operandi más comunes
1. Se hacen pasar por rescatistas o por nuestro equipo
Dicen haber encontrado a tu mascota y solicitan dinero para transporte, medicamentos o cuidados.
2. Inventan que salieron de la ciudad
Comentan que recogieron a tu mascota, pero ya viajaron a otra ciudad y necesitan dinero para regresarla.
3. Piden dinero para Uber o gasolina
Aseguran que enviarán a la mascota contigo, pero solicitan depósitos pequeños “urgentes”.
4. Utilizan historias emocionales
Algunos dicen que el perro no quiere comer, que tuvieron que llevarlo al veterinario o que son personas mayores sin acceso a cámara.

🐾 Recuerda
Los delincuentes suelen repetir exactamente las características que tú publicaste en el anuncio. Eso no significa que realmente tengan a tu mascota.
Mantén la esperanza, pero también actúa con precaución.
👉 Nunca realices depósitos sin pruebas reales y verificables.

💜 Gracias por compartir esta información y ayudar a proteger a más familias.`,
    imageFileName: BLOGS_ROUTE + 'Alerta.png',
  },
];

const membersOnlySeeds: MembersOnlySeed[] = [
  {
    name: 'Checklist para salir a buscar a tu mascota',
    description:
      'No pierdas tiempo cuando cada minuto cuenta. Descarga esta lista y asegúrate de llevar todo lo necesario para una búsqueda efectiva',
    imageFileName:
      MEMBERS_ONLY_ROUTE + 'Checklist para salir a buscar a tu mascota.png',
    materialFileName:
      MEMBERS_ONLY_ROUTE + 'checklist-para-salir-a-buscar-a-tu-mascota.pdf.pdf',
  },
  {
    name: 'Manual de busqueda',
    description:
      'Una guía práctica y emocional para ayudarte a actuar rápidamente cuando tu mascota se pierde.',
    imageFileName: MEMBERS_ONLY_ROUTE + 'Manual de Busqueda.png',
    materialFileName: MEMBERS_ONLY_ROUTE + 'SOS - Manual de busqueda.pdf',
  },
  {
    name: 'El alma también entra en modo búsqueda',
    description:
      'Perder a una mascota no solo activa una búsqueda física, también emocional. En esta nota compartimos formas de acompañarte, sostener tu esperanza y honrar el vínculo profundo con tu compañero peludo durante su ausencia.',
    detail: `¿Qué encontrarás en este PDF?

🐾 Acompañamiento emocional durante la búsqueda
Herramientas para sostenerte emocionalmente mientras buscas a tu mascota.

💜 Prácticas simbólicas de conexión
Pequeños ejercicios y rituales para ayudarte a mantener esperanza, calma y conexión emocional.

✨ Frases de apoyo y contención
Mensajes para ayudarte a atravesar el miedo, la ansiedad y la incertidumbre.

🧠 Cómo transformar la angustia en acción
Consejos para convertir la preocupación en pasos concretos y organizados durante la búsqueda.

🌱 Herramientas para manejar el miedo y la ansiedad
Ejercicios simples para regresar al presente y recuperar claridad mental.

🔥 Reflexiones sobre el vínculo humano-animal
Una mirada emocional y consciente sobre el amor, la presencia y el significado de buscar a un compañero peludo.

🫶 Ejercicios breves de calma y conexión
Prácticas sencillas de respiración, enfoque emocional y autocuidado.

🐕 Un espacio donde tu dolor y tu amor son válidos
Porque buscar a una mascota también es atravesar un proceso profundamente emocional.`,
    imageFileName: MEMBERS_ONLY_ROUTE + 'Regresa cuando puedas.png',
    materialFileName: MEMBERS_ONLY_ROUTE + 'SOS - Manual de busqueda.pdf', // COMENTAR A LA SOCIA DE PDF FALTANTE, ESTE ES SOBRE EL MANUAL DE BUSQUEDA
  },
];

function getBaseUrl(): string {
  return (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findUploadByBaseName(fileName: string): string | undefined {
  if (!fs.existsSync(uploadsDir)) return undefined;

  const pending = [uploadsDir];

  while (pending.length > 0) {
    const currentPath = pending.pop();
    if (currentPath === undefined) continue;

    for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
      const entryPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        pending.push(entryPath);
        continue;
      }

      if (entry.name === fileName) return entryPath;
    }
  }

  return undefined;
}

function resolveSourcePath(fileName: string): string {
  const trimmedFileName = fileName.trim();
  const safeSourceName = path.basename(trimmedFileName);
  const candidates = [
    path.isAbsolute(trimmedFileName) ? trimmedFileName : undefined,
    path.resolve(currentDir, trimmedFileName),
    path.resolve(process.cwd(), trimmedFileName),
    sourceAssetsDir !== undefined
      ? path.join(sourceAssetsDir, safeSourceName)
      : undefined,
    findUploadByBaseName(safeSourceName),
  ].filter((candidate): candidate is string => candidate !== undefined);

  const sourcePath = candidates.find((candidate) => fs.existsSync(candidate));

  if (sourcePath === undefined) {
    throw new Error(
      `Falta el archivo ${safeSourceName}. Búscalo en real-files o en backend/uploads.`,
    );
  }

  return sourcePath;
}

function copyAssetToUploads(
  fileName: string,
  uploadSubdir: string,
  destinationBaseName: string,
): string {
  const sourcePath = resolveSourcePath(fileName);
  const extension = path.extname(sourcePath).toLowerCase();
  const destinationName = `${slugify(destinationBaseName)}${extension}`;
  const destinationDir = path.join(uploadsDir, uploadSubdir);
  const destinationPath = path.join(destinationDir, destinationName);

  fs.mkdirSync(destinationDir, { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);

  return destinationName;
}

function publicUploadUrl(
  fileName: string,
  destinationBaseName: string,
): string {
  const copiedName = copyAssetToUploads(
    fileName,
    path.join('content', 'public'),
    destinationBaseName,
  );

  return `${getBaseUrl()}/uploads/content/public/${copiedName}`;
}

function membersOnlyFileUrl(
  fileName: string,
  destinationBaseName: string,
): string {
  const copiedName = copyAssetToUploads(
    fileName,
    'members-only',
    destinationBaseName,
  );

  return `/members-only/file/${copiedName}`;
}

function textBlocks(...parts: Array<string | undefined>): ContentBlock[] {
  return parts
    .flatMap((part) => (part ?? '').split(/\n{2,}/))
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((content) => ({ type: 'text', content }));
}

function calculateReadingMinutes(...parts: string[]): number {
  const wordCount =
    parts.join(' ').match(/\p{L}[\p{L}\p{N}_-]*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(wordCount / BLOG_WORDS_PER_MINUTE));
}

async function deleteContentOutsideRealImport(): Promise<void> {
  await ManualModel.deleteMany({
    name: { $nin: manualSeeds.map((manual) => manual.name) },
  });
  await WorkshopModel.deleteMany({
    name: { $nin: workshopSeeds.map((workshop) => workshop.name) },
  });
  await BlogModel.deleteMany({
    name: { $nin: blogSeeds.map((blog) => blog.name) },
  });
  await MembersOnlyModel.deleteMany({
    name: { $nin: membersOnlySeeds.map((item) => item.name) },
  });
}

export async function importRealContentDB(): Promise<void> {
  const manualDocs = manualSeeds.map((manual) => ({
    name: manual.name,
    price: REAL_CONTENT_PRICE_MXN,
    content: textBlocks(manual.description, manual.detail),
    imageUrl: publicUploadUrl(manual.imageFileName, `${manual.name}-image`),
    pdfUrl:
      manual.materialFileName !== undefined
        ? publicUploadUrl(manual.materialFileName, `${manual.name}-pdf`)
        : undefined,
  }));

  const workshopDocs = workshopSeeds.map((workshop) => ({
    name: workshop.name,
    description: workshop.description,
    price: REAL_CONTENT_PRICE_MXN,
    content: textBlocks(workshop.description, workshop.detail),
    category: ['duelo', 'apoyo emocional', 'mascotas'],
    imageUrl: publicUploadUrl(workshop.imageFileName, `${workshop.name}-image`),
    videoUrl: workshop.materialUrl,
  }));

  const blogDocs = blogSeeds.map((blog) => ({
    name: blog.name,
    duration: calculateReadingMinutes(blog.description, blog.entry),
    content: textBlocks(blog.description, blog.entry),
    imageUrl: publicUploadUrl(blog.imageFileName, `${blog.name}-image`),
  }));

  const membersOnlyDocs = membersOnlySeeds.map((item) => ({
    name: item.name,
    duration: calculateReadingMinutes(item.description, item.detail ?? ''),
    content: textBlocks(item.description, item.detail)
      .map((block) => block.content)
      .join('\n\n'),
    imageUrl: membersOnlyFileUrl(item.imageFileName, `${item.name}-image`),
    pdfUrl: membersOnlyFileUrl(item.materialFileName, `${item.name}-pdf`),
  }));

  await deleteContentOutsideRealImport();

  for (const manual of manualDocs) {
    await ManualModel.updateOne(
      { name: manual.name },
      { $set: manual },
      { upsert: true },
    );
  }

  for (const workshop of workshopDocs) {
    await WorkshopModel.updateOne(
      { name: workshop.name },
      { $set: workshop },
      { upsert: true },
    );
  }

  for (const blog of blogDocs) {
    await BlogModel.updateOne(
      { name: blog.name },
      { $set: blog },
      { upsert: true },
    );
  }

  for (const item of membersOnlyDocs) {
    await MembersOnlyModel.updateOne(
      { name: item.name },
      { $set: item },
      { upsert: true },
    );
  }
}

export default importRealContentDB;
