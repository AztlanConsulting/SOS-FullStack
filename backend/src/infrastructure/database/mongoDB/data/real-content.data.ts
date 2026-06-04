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
  {
    name: 'La pérdida como maestra: desapego, confianza, fe, energía y presencia',
    description:
      'Perder a un ser amado —y más aún, a un animal que nos acompañó con amor incondicional— puede sentirse como una fractura del alma. Su ausencia física nos confronta con el vacío, con la imposibilidad de controlar el curso natural de la vida. Pero también, si logramos mirar más allá del dolor, su partida se transforma en una maestra silenciosa que nos habla de desapego, confianza, fe, energía y presencia.',
    entry: `El desapego no significa olvidar, sino amar sin poseer, agradecer sin retener. Nos enseña que el vínculo verdadero no depende del cuerpo ni del tiempo, sino de la vibración que compartimos. Cuando aprendemos a soltar desde el amor, dejamos de resistir el cambio y permitimos que la energía fluya hacia nuevas formas.

La confianza aparece cuando aceptamos que no todo está bajo nuestro control. Confiar es abrir el corazón a lo desconocido, sabiendo que la conexión no se rompe, solo se transforma. Es permitir que la vida siga su curso con la certeza de que nada realmente se pierde, solo cambia de plano.

La fe es la luz que nos guía cuando no podemos ver. Es la voz interna que nos recuerda que todo tiene un propósito, incluso el dolor. A veces, la pérdida nos invita a reencontrarnos con esa fuerza interior que sostiene, incluso cuando no entendemos el porqué.

La energía de nuestros animales no desaparece; se transforma, se expande, se entrelaza con la nuestra. Su esencia permanece en los espacios, en la naturaleza, en las sincronías que aparecen cuando más los recordamos. Ellos vibran en otra frecuencia, pero siguen acompañando desde un lugar más sutil.

Y finalmente, su partida nos devuelve a la presencia. Nos enseña a valorar cada respiración compartida, cada mirada, cada instante. Nos recuerda que el único lugar real donde podemos encontrarlos —y encontrarnos— es aquí y ahora.

Cuando atravesamos el duelo desde esta conciencia, la pérdida deja de ser un final y se convierte en un portal: un pasaje hacia una forma más amplia de amar, más libre, más eterna.

Lecciones que trascienden el dolor:
💛 Desapego: amar sin poseer, agradecer sin retener.
🌱 Confianza: aceptar que no todo está bajo nuestro control.
🌟 Fe: creer en lo invisible, en lo que sostiene nuestra alma.
⚡ Energía: su esencia no se pierde, solo cambia de plano.🕊️
Presencia: cada instante compartido es un regalo eterno.

Buscar a tu mascota es también recordar quién eres: amor en movimiento, cada búsqueda es también un camino de amor, cada lazo amoroso deja una huella luminosa que sigue guiando nuestros pasos.

La búsqueda se convierte en un espejo

Cuando una mascota se pierde, algo dentro de nosotros se mueve. No solo se trata de salir a buscar por las calles; es como si la vida nos invitara a mirar hacia adentro. Lo que parecía un acto externo —encontrar a quien amamos— se transforma en un reflejo de lo que somos, de cómo amamos, de cómo reaccionamos frente a la incertidumbre.

Cada búsqueda se convierte en un espejo que nos muestra con claridad lo que muchas veces no queremos ver:nuestra paciencia, nuestra resiliencia, nuestra fe, y también nuestras sombras —la desesperación, la frustración, la culpa, el miedo.Pero ese espejo no llega para juzgarnos, sino para mostrarnos dónde estamos emocionalmente y hacia dónde podemos crecer.

El espejo de la paciencia
Buscar a una mascota requiere tiempo, repetición y constancia. Hay días en que parece no haber señales, y sin embargo seguimos.Esa paciencia no es pasividad: es una fuerza suave que sostiene. Nos enseña a confiar en el ritmo de la vida, a aceptar que no todo depende de nuestro control, y a reconocer que el amor verdadero sabe esperar sin rendirse.

El espejo de la resiliencia
La búsqueda nos enfrenta a la frustración y al cansancio. Y aun así, seguimos pegando carteles, preguntando, caminando, publicando.Esa capacidad de levantarnos una y otra vez nos revela una parte nuestra que a veces olvidamos: la fortaleza que nace del amor.La resiliencia nos muestra que el vínculo con nuestra mascota es tan profundo que ni la distancia ni el miedo lo quiebran; al contrario, lo fortalecen.

El espejo de la fe
Cuando no hay noticias, cuando parece que todo se detiene, es la fe la que nos mantiene en movimiento. No se trata de fe ciega, sino de una certeza silenciosa: algo dentro de nosotros sabe que ese amor sigue vivo, que la conexión con nuestra mascota trasciende la distancia.Esa fe nos enseña a confiar no solo en la vida, sino también en nuestra intuición, en las señales y en la energía que une a quienes se aman.

El espejo de la presencia
La búsqueda nos obliga a estar atentos: mirar, escuchar, sentir.Cada paso se convierte en un acto de presencia plena. La mente deja de vagar en “¿y si…?” y se enfoca en el ahora, donde pueden surgir las respuestas.Esa presencia, cultivada en medio de la incertidumbre, se convierte en una herramienta de sanación. Porque no solo buscamos afuera, sino que aprendemos a encontrarnos dentro.

Al mirar ese espejo con honestidad, descubrimos algo más profundo: buscar a tu mascota también es buscarte a ti. Es recordar la ternura que habita en ti, tu capacidad de amar más allá del control, de actuar con el corazón aunque no tengas garantías.Y esa es una lección espiritual enorme: el amor verdadero no pide resultados inmediatos, solo pide entrega, conexión y presencia.

La búsqueda se convierte en un espejo que no solo refleja lo que somos, sino lo que podemos llegar a ser:más compasivos, más conscientes, más humanos.Porque amar y buscar son dos caras del mismo acto sagrado: mantener vivo el lazo que nos une, dentro y fuera.

“Nada que nace del amor puede perderse.”`,
    imageFileName: BLOGS_ROUTE + 'La pérdida como maestra.png',
  },
  {
    name: 'División de Responsabilidades en la Búsqueda de Mascotas Extraviadas',
    description:
      'Es clave asignar tareas individuales según las necesidades específicas de la búsqueda',
    entry: `Impresión y Distribución de Carteles

Responsabilidades:
- Imprimir un gran numero de carteles de busqueda.
- Colocar los carteles en áreas estratégicas, como parques, postes, veterinarias, tiendas, negocios, oficinas y mercados.

Consejos:
- Lleva herramientas como cinta adhesiva resistente, tachuelas o grapas.
- Evita cubrir otros anuncios importantes para generar buena voluntad en la comunidad.

Búsqueda Activa

Responsabilidades:
- Recorrer el vecindario llamando a la mascota por su nombre.
- Revisar lugares donde pueda esconderse, como arbustos, patios y espacios oscuros.
- Documentar los áreas ya cubiertas para evitar redundancias.

Consejos:
-Lleva comida, premios y su juguete favorito para atraerlo.
- Divide las zonas de búsqueda para abarcar más terreno en menos tiempo.

Redes Sociales y Comunicaciones

Responsabilidades:
-Publicar información en plataformas locales como Grupos locales de Facebook, WhatsApp,.
- Monitorear comentarios y responder rápidamente a pistas.
- Actualizar las publicaciones con nuevos detalles o avistamientos.

Consejos:
-Mantén un tono claro y amable para fomentar la colaboración.

Contacto con Vecinos y Veterinarias

Responsabilidades:
- Visitar clínicas, refugios y albergues cercanos con una foto de tu mascota.
- Hablar con vecinos y pedir permiso para revisar patios o cocheras.
- Dejar información de contacto en caso de avistamientos futuros.

Consejos:
- Lleva copias impresas de los carteles para dejarlas en manos de los vecinos.
-Registra los lugares ya visitados para evitar repetir esfuerzos.
- Crea un listado de contactos clave, como veterinarias y refugios cercanos.

Uso del Tiempo

Por la Mañana
Acciones Clave:
Colocar carteles en áreas de alto tráfico.
Contactar veterinarias, refugios y negocios cercanos.

Por la Tarde
Acciones Clave:
Redistribuir carteles en nuevas ubicaciones.
Visitar parques, mercados y áreas concurridas.
Monitorear redes sociales y responder a pistas.

Por la Noche
Acciones Clave:
Realizar búsquedas en zonas tranquilas y menos transitadas.
Usar linternas para inspeccionar lugares oscuros.
Llamar a la mascota con voz calmada para no asustarla.

Revisión y Ajustes

Evaluaciones Periódicas:
Cada 4-6 horas, reúne a los participantes para discutir avances.
Registra pistas nuevas y ajusta las áreas de búsqueda según la información recibida.
Refuerza áreas donde se hayan reportado avistamientos recientes.

Esta organización detallada no solo hará más eficiente la búsqueda, sino que también reducirá el estrés al saber exactamente qué hacer y cómo colaborar de manera efectiva`,
    imageFileName: BLOGS_ROUTE + 'Division de responsabilidades.png',
  },
  {
    name: 'Te compartimos sugerencias  para la búsqueda de tu ave.',
    description:
      'Si has perdido de vista a tu canario vuelve al lugar donde lo viste la última vez. Puedes pedir a tus amigos, vecinos o familiares que te ayuden a buscarlo.',
    entry: `Haz lo mismo que harías en casa: llámalo constantemente con tonos suaves y relajados y búscalo con la mirada haciendo barridos visuales en vertical. Mira sobre todo en las plantas y en los árboles, serán sus lugares favoritos para reposar.

1. Se sugiere colocar unos altavoces hacia el exterior y que el pájaro escuche a través del altavoz un cantar de su misma especie de tal forma que se vea identificado con sus iguales y quiera volver a nuestra casa. De esta manera es posible que esté si está por las inmediaciones de nuestro entorno escuche, se acerque y le podamos ver.

2. Si tras un tiempo con el reclamo puesto, el ave no vuelve, es necesario salir a buscarlo a la calle. Por lo general, las aves suelen posarse en árboles altos, balcones etc. sitios donde no se vean en peligro. Un buen sitio para buscar sería en un parque ya que dispone de gran cantidad de árboles.

3. Otra opción aparte del llamado es el hecho de utilizar a su pareja en el caso de que la tuviera como reclamo. Esto es más efectivo que el propio sonido en sí pero no todos las aves disponen de una pareja para que pueda hacer esta función. Si aparte de su pareja, dispones de un aviario entero, lo más normal es que vuelva debido al ruido que causan todos los pájaros.

4. Cuando tu ave vive con otra ave puedes llevarte a su pareja contigo para que cante y sirva de reclamo. Coloca la jaula en un lugar alto, donde el pájaro fugado pueda verlo y oírlo con facilidad. Es posible que si escucha a su compañero vuele hacia la jaula para reunirse con él.

5. Dentro de las primeras horas el ave no volará muy lejos, por lo que buscarla más allá de un kilómetro y medio resultará innecesario al principio. Dentro de este radio céntrate en parques, jardines, árboles, arbusto.

6. Si han pasado mas de 24 horas debes dejar su jaula cerca de una ventana. Deja abiertas todas las ventanas posibles y espera a que el pájaro vuele cerca de la casa y reconozca su hogar. Esto resulta mucho más eficaz cuando nuestro ave tiene un compañero que le cante en la ventana como reclamo o utilizar el truco de los altavoces.

7. Tenle preparada en la jaula su comida y juguetes favoritos y prueba a dejarle un caminito de comida al estilo Hansel y Gretel que le guíe a casa.

8. Pon alpiste en la calle, en la puerta y en las ventanas y ten fe en que regresará.

9. También es buena idea comprar una trampa y colocarla fuera en la calle, junto a la comida, o colocar una jaula extra en el tejado de casa, también con comida y juguetes.

10. Contacta con emprendimientos de artículos de mascotas de tu ciudad para que te ayuden difundiendo la notica

11. Pide ayuda a personas amantes de las mascotas que tengan muchos seguidores en redes sociales de tu ciudad. Pide que te ayuden compartiendo la búsqueda en sus redes sociales.

Sigue cada una de las pistas.
¡Recuerda que SOS Encontrando Mascotas está para ayudarte!`,
    imageFileName: BLOGS_ROUTE + 'Ave SOS Encontrando Mascotas a.png',
  },
  {
    name: 'Recomendaciones para subir la foto de tu pequeño extraviado.',
    description:
      'Consejos prácticos para que la foto de tu mascota sea lo más efectiva posible en la búsqueda.',
    entry: `1.- Sube la foto de tu mascota lo más parecido a como se te perdió.
2.- Evita subir fotos de tu mascota con ropa si no la llevaba puesta al momento que se perdió.
3.- Si ya tenía el pelo largo trata de subir alguna similar al largo que lo tenía.
4.- Evita subir una recién rasurad@ si no estaba en estas condiciones.
5.- Trata de subir 2 fotos en donde se vea con distintas poses.
6.- Evita subir fotografías con edición y/o texto encima.
7.- Sube la foto de tu mascota en donde aparezca sol@.`,
    imageFileName:
      BLOGS_ROUTE + 'Recomendaciones _ SOS Encontrando Mascotas.png',
  },
  {
    name: '¿Cómo afrontar los traumas de tu mascota después de que regresa a casa?',
    description:
      'Si pasaste por esos terribles momento en donde tu mascota se pierde unas horas, días o incluso meses y tuviste la gran fortuna de tener a tu bebe de nuevo seguro experimentaste momentos traumáticos y sumamente estresantes; Esto no sólo nos pasa a nosotros, si no que a ellos también les afecta, tanto físicamente como emocionalmente, pudiendo dejar secuelas en nuestros compañeros perrunos.',
    entry: `Esto puede provocar daños mentales en los perros. Creando miedo o fobias y produciendo cambios en su carácter y en su comportamiento. Lo que hace que tengas que tener especial cuidado en el trato. Un perro perdido se siente desorientado, asustado, solo, abandonado, triste y hambriento. Y eso hay que tenerlo muy presente para poder ayudarlos de la mejor manera.

Algunas de las secuelas más habituales son:

Hiper apego: necesidad extrema de estar cerca de su compañero humano, de recibir cariño y atención constante e incluso llegar a ponerse tristes durante las ausencias en casa.

Ansiedad por separación: incapacidad para estar solo en casa, no comer cuando no hay nadie con él, aullar o ladrar constantemente e incluso lamerse compulsivamente pudiendo lastimarse en el proceso.

Miedo a los extraños: no sentirse cómodo en compañía de desconocidos, no dejarse acariciar y/o coger por los mismos y desconfiar de todo aquel que no sea de casa.

Malnutrición: pérdida de peso, caída de pelo, problemas estomacales y debilitación del sistema inmune.

Depresión: pueden llegar a ponerse muy tristes y apáticos por haber estado fuera de su zona de confort.

Conducta destructiva: rompen cosas en casa al quedarse solos, como muebles o incluso nuestra propia ropa.

¿Qué debes hacer?

Una vez que tu pequeño vuelva a casa, debes tener paciencia e ir viendo poco a poco cómo le ha afectado el tiempo en la calle y saber cuáles son sus traumas. Tras haberlos averiguado, tienes que tratarlo poco a poco o contactar con un etólogo (especialista en conducta) y/o educador canino, para que te indique cuál el problema de tu perrito y cuál es la mejor forma de ayudarlo.

Lo más importante es tener paciencia, darle mucho cariño y amor y ser muy constante con las pautas que debes seguir para que tu pequeño pueda mejorar.

Hay que formar una estructura jerárquica en casa, demostrar quien el es líder siendo firme (no demasiado duro), y aportándole sensación de seguridad en casa.

A la hora de dejarlo solo en casa, lo mejor es hacerlo gradualmente, intenta que los tiempos sean muy cortos al principio e ir aumentándolos poco a poco.

Si tiene conducta destructiva, busca un premio que le guste (por ejemplo, golosinas para perros) y pueda morder cuando le apetezca.

Sácalo mucho a pasear, haz que corra y haga ejercicio para que llegue más cansado y tranquilo a casa.

Si necesitase medicación, asegúrate de cumplir rigurosamente las dosis durante la terapia y de hacer el descenso de la medicación de forma gradual para que no se desajuste al final del tratamiento.

Si tu pequeño se pierde y vuelve a casa, no dudes en acudir al veterinario para que te ayude a saber qué le sucede exactamente y cual es la mejor forma de ayudarle.

Recuerda que en SOS ENCONTRANDO MASCOTAS estamos para ayudarte.`,
    imageFileName:
      BLOGS_ROUTE +
      'Como afrontar los traumas de tu mascota después de que regresa a casa.png',
  },
  {
    name: 'Que debes hacer en el caso de robo a tu mascota',
    description:
      'Entendemos lo angustiante que debe ser esta situación. Con nuestro servicio, difundimos la noticia de mascotas extraviadas de manera masiva, lo que puede ayudar a aumentar la visibilidad y presión sobre el posible ladrón, sus amigos, familiares o vecinos.',
    entry: `Al difundir ampliamente la información sobre la mascota desaparecida, muchas personas estarán al tanto de la situación y podrán identificar si alguien más intenta reclamarla como propia. Esto puede ejercer una presión adicional sobre el ladrón y su entorno, lo que podría motivarlos a devolver la mascota.

Espero que esta información te sea útil y que pronto puedas recuperar a tu querida mascota. Estamos aquí para ayudarte en todo lo que necesites durante este difícil momento.

Los nervios y la incertidumbre ante el robo de nuestra mascota provocar que nos sintamos perdidos y no sepamos cómo actuar. Tener información previa sobre lo qué debemos hacer en el caso de que esto ocurra y seguir ciertos pasos nos puede ayudar para que se resuelva el incidente de manera satisfactoria. Sin embargo, como siempre, la prevención es lo más importante y tener en cuenta ciertas medidas como, por ejemplo, la identificación de tu mascota y no llevarle suelto por la calle nos ayudará a proteger a nuestra mascota contra el robo o la pérdida.

Te compartimos algunos consejos sobre como actuar:

Nuestra primer recomendación es asesórate correctamente con un Abogado especializado en asesoramiento jurídico en defensa de los animales.

Acude a la Policía Nacional con la cartilla de vacunación de la mascota en cuestión y en caso de que tu mascota tenga chip lleves número de chip a fin de facilitar la identificación de tu mascota. En la denuncia ante las autoridades se deben de indicar nuestros datos personales, la fecha y el lugar dónde lo robaron. Se recomienda en este tipo de casos contactar con un abogado especializado para que éste valore si es mejor llevar el caso por la vía penal o basta con conducirlo por la vía civil. En el caso de que se tengan pruebas de la autoría del robo se puede presentar una querella criminal, una querella de este tipo requiere cumplir una serie de requisitos:

1.- Identificar con todos los datos al querellado (Nombre completo y dirección dónde pueda ser localizado por el Juzgado).

2.- Unir a la querella pruebas suficientes que justifiquen el delito que se le está imputando, todo ello sin perjuicio de las que se practiquen en la instrucción.

3.- Recomiendo aportar el mayor número posible de pruebas fehacientes para unir a la querella, dado que nuestros Tribunales son muy reacios a condenar por maltrato animal.

4.- La querella debe presentarse con abogado y procurador.

Siempre, antes de iniciar el procedimiento, asesorarse debidamente por un abogado.`,
    imageFileName: BLOGS_ROUTE + 'Robo _ Cuidado.png',
  },
  {
    name: 'Primeras 24 horas: qué hacer cuando tu mascota se pierde',
    description:
      'Perder a una mascota es una experiencia profundamente angustiante. En cuestión de minutos, la mente puede llenarse de miedo, culpa, confusión y muchas preguntas: “¿A dónde se fue?”, “¿Estará bien?”, “¿Y si alguien se la llevó?”, “¿Y si no sabe regresar?”.',
    entry: `1.Mantén la calma lo más posible y confirma cómo ocurrió el extravío

Sabemos que no es fácil, pero antes de salir corriendo en muchas direcciones, toma unos minutos para ordenar la información.

Pregúntate:
¿A qué hora se perdió?
¿Desde qué punto exacto salió o fue vista por última vez?
¿Iba caminando, corriendo o asustada?
¿Hubo ruidos fuertes, lluvia, pirotecnia, accidente, persecución o algo que pudo alterarla?
¿Tenía collar, placa, correa, arnés o ropa?
¿Alguien la vio tomar una dirección?
¿Es sociable, miedosa, nerviosa, desconfiada o suele acercarse a personas?

Estos datos ayudan mucho porque una mascota no se mueve igual cuando sale por curiosidad que cuando huye por miedo.

Un perro sociable puede acercarse a personas, negocios o casas.
Un perro asustado puede correr largas distancias y evitar incluso a su propia familia.
Un gato indoor puede esconderse muy cerca del punto de escape y permanecer en silencio.
Un gato con experiencia exterior puede moverse con más seguridad, pero también refugiarse si algo lo asustó.

La búsqueda empieza con una pregunta clave: ¿qué emoción pudo estar sintiendo tu mascota al momento de perderse?

2. Busca primero en el punto de extravío y sus alrededores

Uno de los errores más comunes es alejarse demasiado rápido del lugar donde se perdió. Muchas mascotas, especialmente gatos y perros pequeños o asustados, pueden esconderse cerca.

Durante las primeras horas revisa con mucha atención:
Debajo de autos
Cocheras abiertas
Jardineras
Bodegas
Escaleras
Terrenos baldíos
Pasillos
Azoteas bajas
Patios de vecinos
Locales cercanos
Obras o construcciones
Debajo de puestos, lonas o estructuras
Zonas con sombra, agua o comida
Entradas de edificios o fraccionamientos

No solo mires de pie. Agáchate, ilumina debajo de objetos y revisa rincones pequeños. Una mascota con miedo puede meterse en lugares donde normalmente no entraría.

En el caso de los gatos, especialmente si nunca habían salido, es común que no respondan aunque escuchen la voz de su familia. No significa que no te reconozcan; puede ser una respuesta de miedo. Por eso es importante buscar en silencio, con linterna y con mucha paciencia.

3. No grites su nombre de forma desesperada

Cuando una mascota está perdida y asustada, los gritos pueden aumentar su estrés. Aunque tu intención sea llamarla con amor, si tu voz transmite angustia, puede interpretar el ambiente como peligroso.

Lo ideal es llamarla con voz suave, pausada y familiar.

Puedes decir su nombre como lo harías en casa, usando frases conocidas:
“Ven, mi amor”
“Vamos a casa”
“Muy bien”
“Aquí estoy”
“Ven a comer”

Haz pausas largas para escuchar. Muchas veces las personas llaman sin detenerse y no alcanzan a oír si la mascota se mueve, maúlla, llora o rasca desde algún lugar.

Si la ves, evita correr hacia ella. Incluso una mascota muy amorosa puede huir si está en modo supervivencia.

4. Si la ves, no la persigas

Este punto es muy importante.

Cuando una mascota perdida entra en estado de miedo, perseguirla puede hacer que corra más lejos, cruce calles o se esconda mejor. La reacción natural de la familia es correr hacia ella, pero en muchos casos eso puede complicar el rescate.

Si la ves:
Baja tu cuerpo o siéntate de lado.
Evita mirarla fijamente a los ojos.
Háblale suave.
No hagas movimientos bruscos.
No la rodees con varias personas.
No grites “¡agárrenla!”.
Usa comida con olor fuerte.
Permite que ella se acerque poco a poco.

Si es perro y está muy asustado, puede ayudar caminar en dirección contraria, como invitándolo a seguirte, en lugar de avanzar directo hacia él.

Si es gato, lo más seguro es no intentar atraparlo con rapidez. Es mejor ubicar dónde se esconde, mantener vigilancia y preparar una estrategia tranquila.

5. Usa comida con olor fuerte y objetos con olor familiar

El olfato es una herramienta muy importante para perros y gatos. Durante las primeras 24 horas puedes usar olores conocidos para ayudar a orientar o atraer.

Puedes colocar cerca del punto de extravío:
Una prenda usada por la persona más cercana a la mascota
Su camita o cobija
Un juguete conocido
Comida húmeda
Atún, pollo o alimento con olor fuerte
Agua limpia

Hazlo con cuidado. No coloques comida en lugares peligrosos, junto a avenidas o donde pueda atraer muchos animales sin supervisión.

En gatos, la comida húmeda puede ser útil, especialmente al anochecer o de madrugada. En perros, el olor familiar puede ayudar si siguen en la zona o si regresan por la noche.

6. Organiza la búsqueda por horarios estratégicos

No todas las horas tienen el mismo valor.

Durante el día hay más ruido, tráfico, personas y movimiento. Esto puede hacer que una mascota asustada permanezca escondida. Por eso, además de buscar de día, es muy importante aprovechar horarios tranquilos.

Horarios recomendados

Muy temprano: 4:30 am a 7:00 am
Es uno de los mejores momentos para buscar. Hay menos ruido, menos autos y más posibilidad de escuchar o ver movimiento.

Noche: 8:00 pm a 11:30 pm
También puede ser un horario útil, especialmente para gatos y mascotas nerviosas que se mueven cuando el ambiente está más tranquilo.

Durante el día
Úsalo para hablar con vecinos, revisar cámaras, pegar carteles, preguntar en negocios, contactar veterinarias y difundir.

La búsqueda efectiva combina dos cosas: salir a buscar en horarios tranquilos y mover información durante el día.

7. Habla con vecinos, negocios, vigilancia y personas de la zona

En las primeras 24 horas, la información local puede ser decisiva. Muchas veces alguien vio a la mascota, pero no sabe a quién avisar.

Habla con:
Vecinos
Porteros
Guardias de seguridad
Repartidores
Tiendas
Tortillerías
Farmacias
Gasolineras
Veterinarias
Estéticas caninas
Personas que alimentan animales en la zona
Trabajadores de limpieza
Paseadores de perros
Vendedores ambulantes

Lleva una foto clara y di algo breve:
“Estamos buscando a esta mascota. Se perdió hoy cerca de aquí. Si la ve, por favor no la persiga. Puede mandarnos ubicación, foto o video.”

Es importante pedir que no la correteen. Muchas personas quieren ayudar, pero sin querer pueden asustarla más.

8. Revisa cámaras lo antes posible

Las cámaras pueden ayudarte a saber hacia dónde se dirigió. Esto es especialmente útil durante las primeras horas, antes de que se borren grabaciones o sea más difícil conseguir acceso.

Pregunta en:
Casas cercanas
Negocios
Edificios
Fraccionamientos
Gasolineras
Tiendas
Escuelas
Farmacias
Cámaras de seguridad vecinal

Pide revisar desde unos minutos antes hasta varias horas después del extravío.

No busques solo si “pasó frente a la cámara”. Observa dirección, ritmo, si iba corriendo, si alguien la siguió, si se subió a un auto, si entró a una propiedad o si se escondió cerca.

9. Haz un cartel claro y fácil de leer

El cartel debe ser simple, visible y directo. No necesita tener demasiado texto; necesita entenderse rápido.

Incluye:
Foto clara de la mascota
Nombre
Zona donde se perdió
Fecha
Señas particulares
Teléfono de contacto
Indicación: “No perseguir, reportar ubicación”
Recompensa solo si la familia decide ofrecerla

Evita saturarlo con muchos datos. Las personas deben poder leerlo desde el celular o mientras caminan.

Coloca carteles en puntos estratégicos:
Esquinas
Tiendas
Parques
Veterinarias
Postes permitidos
Entradas de fraccionamientos
Paradas de transporte
Zonas de alto paso peatonal
Lugares donde hubo avistamientos

Si es posible, imprime varios y repártelos en negocios cercanos.

10. Difunde en redes, pero con información clara

Publicar en redes puede ayudar mucho, pero es importante hacerlo con orden. Una publicación confusa puede generar reportes incompletos o poco útiles.

Incluye:
Nombre de la mascota
Foto clara
Fecha de extravío
Zona exacta o aproximada
Ciudad y estado
Características físicas
Teléfono de contacto
Instrucción de no perseguir si está asustada
Solicitud de foto, video o ubicación en caso de avistamiento

Ejemplo:
“Se busca a LUNA. Se extravió el 12 de mayo en la colonia Centro, Querétaro. Es tímida y puede correr si intentan agarrarla. Si la ves, por favor no la persigas. Manda foto, video o ubicación al teléfono…”

También es recomendable publicar en grupos locales, páginas vecinales, chats de colonia y comunidades cercanas.

11. No descartes lugares “demasiado cerca”

Muchas familias piensan: “Ya revisé ahí” o “no puede estar tan cerca”. Pero en búsquedas reales, muchas mascotas aparecen en lugares que parecían obvios o ya revisados.

Una mascota con miedo puede permanecer oculta durante horas. Tal vez la primera vez que pasaste no se movió, no hizo ruido o estaba demasiado escondida.

Por eso conviene volver a revisar:
El punto exacto de escape
Casas contiguas
Patios vecinos
Autos estacionados
Bodegas
Azoteas
Jardines
Locales cerrados
Zonas oscuras o poco transitadas

En gatos indoor, esta revisión cercana es todavía más importante.

12. Crea un registro de reportes y avistamientos

Desde el primer día, anota todo. La memoria puede fallar cuando hay estrés, y los reportes pueden confundirse.

Registra:
Hora del reporte
Persona que reportó
Lugar exacto
Foto o video, si existe
Dirección en la que iba
Comportamiento observado
Si estaba solo o con alguien
Si parecía asustado, tranquilo, herido o desorientado

Con varios reportes puedes empezar a detectar patrones: una zona donde se mueve, una dirección frecuente, horarios de aparición o lugares donde podría estar buscando refugio.

13. Cuidado con fraudes y llamadas falsas

Lamentablemente, cuando se publica una mascota perdida, pueden aparecer personas que intentan aprovecharse del dolor de la familia.

Ten cuidado si alguien:
Pide dinero antes de mostrar pruebas
Dice que tiene a tu mascota pero no manda foto clara
Presiona emocionalmente
No quiere hacer videollamada
Manda imágenes borrosas o sacadas de internet
Se niega a decir ubicación aproximada
Amenaza con hacerle daño
Pide depósitos, recargas o transferencias urgentes

Antes de moverte o pagar, pide:
Foto actual
Video corto
Ubicación aproximada
Seña particular visible
Prueba de que realmente tiene a tu mascota

La urgencia emocional no debe hacerte bajar la guardia.

14. Qué hacer si tu mascota es perro

Los perros pueden reaccionar de maneras muy distintas según su personalidad y la causa del extravío.

Si es sociable
Puede acercarse a personas, casas, negocios o grupos de perros. Pregunta en zonas donde haya comida, parques, veterinarias, tiendas y áreas transitadas.

Si es miedoso o fue espantado
Puede correr sin rumbo al inicio y después esconderse o mantenerse en movimiento. En este caso, no conviene que muchas personas lo persigan. Es mejor recopilar reportes, ubicar patrones y que la persona más cercana emocionalmente intente acercarse con calma.

Si es cachorro
Puede no alejarse demasiado, pero sí desorientarse rápido. Revisa zonas cercanas, casas vecinas y lugares donde pudo ser resguardado.

Si es adulto mayor
Puede avanzar menos distancia o detenerse en lugares tranquilos. Revisa bajo autos, entradas, jardines, cocheras y zonas con sombra.

15. Qué hacer si tu mascota es gato

Los gatos perdidos suelen tener un comportamiento distinto al de los perros.

Un gato que nunca sale de casa puede quedarse cerca, esconderse y no responder. Puede estar muy cerca aunque no lo veas. Busca especialmente en silencio, de noche o muy temprano, con linterna.

Revisa:
Debajo de autos
Motores o llantas
Jardineras
Patios
Azoteas
Bodegas
Huecos pequeños
Casas vecinas
Escaleras
Terrenos baldíos
Árboles bajos
Techos o bardas

No sacudas bolsas ni grites de forma intensa si notas que se asusta. Usa una voz suave y comida con olor fuerte.

Si lo ves, no corras hacia él. Acércate despacio o espera a que se tranquilice.

16. Divide responsabilidades

Cuando toda la familia sale sin plan, puede haber cansancio, confusión y zonas repetidas mientras otras quedan sin revisar.

Organiza tareas:
Una persona revisa el punto de extravío.
Otra habla con vecinos.
Otra busca cámaras.
Otra publica en redes.
Otra imprime carteles.
Otra contesta llamadas y mensajes.
Otra registra reportes.

Esto ayuda a que la búsqueda avance sin depender solo de la emoción del momento.

17. Prioriza seguridad

Aunque la urgencia sea enorme, evita ponerte en riesgo.

No entres a propiedades sin permiso.
No vayas sola o solo a zonas peligrosas de noche.
No te acerques a desconocidos sin verificar.
No corras detrás de tu mascota en avenidas.
No pongas comida en zonas donde pueda cruzar calles peligrosas.
No expongas datos personales innecesarios en redes.

Buscar con estrategia también significa cuidar a quienes están buscando.

18. Qué hacer durante la primera noche

La primera noche puede ser emocionalmente muy difícil. También puede ser un momento clave, porque muchas mascotas se mueven cuando baja el ruido.

Antes de dormir, si es posible:
Haz una última búsqueda tranquila.
Deja agua y olor familiar cerca del punto de escape, si es seguro.
Revisa patios y cocheras con permiso.
Publica nuevamente en grupos locales.
Activa notificaciones del teléfono.
Organiza quién contestará llamadas.
Planea la búsqueda de madrugada.

Si tu mascota se perdió cerca de casa, deja una entrada segura supervisada si es posible, especialmente en gatos. Algunos intentan volver durante la noche.

19. Lo que debes evitar en las primeras 24 horas

Evita perseguirla si la ves.
Evita gritar de forma desesperada.
Evita publicar información confusa.
Evita cambiar de número de contacto en cada publicación.
Evita discutir con personas que intentan ayudar.
Evita confiar en reportes sin verificar.
Evita pagar sin pruebas.
Evita abandonar la zona cercana demasiado pronto.
Evita que muchas personas intenten atraparla sin coordinación.
Evita culparte mientras necesitas actuar.

La culpa paraliza. La estructura ayuda.

20. Acciones concretas para las primeras 24 horas

Aquí tienes una guía práctica para actuar con orden.

Primera hora
Confirma punto exacto y hora de extravío.
Busca alrededor del lugar.
Pregunta a vecinos inmediatos.
Revisa debajo de autos, patios, cocheras y escondites cercanos.
Llama con voz suave.
No corras ni grites.
Prepara una foto clara para difusión.

De la hora 2 a la 6
Haz cartel digital.
Publica en redes y grupos locales.
Pregunta en negocios cercanos.
Solicita cámaras.
Deja tu teléfono visible para reportes.
Organiza a la familia por tareas.
Registra cualquier avistamiento.

De la hora 6 a la 12
Amplía el radio de búsqueda.
Coloca carteles.
Visita veterinarias y negocios.
Revisa zonas de refugio.
Vuelve al punto de extravío.
Valida reportes con foto, video o ubicación.

De la hora 12 a la 24
Busca en horarios tranquilos.
Revisa de madrugada si es seguro.
Actualiza publicaciones.
Contacta más grupos vecinales.
Revisa cámaras pendientes.
Analiza patrones de reportes.
Mantén una persona atenta al teléfono.

21. Señales importantes durante la búsqueda

Pon atención si alguien reporta que la vio:
Caminando pegada a bardas o paredes
Cruzando calles con miedo
Escondida debajo de autos
Entrando a una casa, terreno o edificio
Cerca de comida o basura
Cerca de parques o zonas tranquilas
Siguiendo a otros perros
Maullando de noche
Regresando al punto donde se perdió

Cada señal puede ayudarte a ajustar la búsqueda.

22. Recuerda: no estás buscando a ciegas

Aunque el miedo haga sentir que todo está perdido, una búsqueda puede ordenarse. Las mascotas suelen moverse respondiendo a necesidades básicas: refugio, silencio, comida, agua, seguridad y, en algunos casos, regreso al olor familiar.

No podemos prometer un resultado, pero sí podemos decir algo importante: actuar con calma, información clara y constancia puede aumentar las posibilidades de encontrarla.

Durante las primeras 24 horas, cada acción cuenta.

Busca cerca.
Pregunta.
Difunde.
Revisa cámaras.
Escucha reportes.
No persigas.
Mantén el teléfono atento.
Vuelve a revisar lugares.
Respira.
Continúa.

Tu amor es la fuerza.
La estrategia es el camino.

En SOS Encontrando Mascotas sabemos que este momento puede sentirse muy difícil, pero no tienes que atravesarlo sin guía. La esperanza también necesita estructura, y cada paso dado con claridad puede acercarte a casa.`,
    imageFileName:
      BLOGS_ROUTE + 'Primeras 24 horas _ SOS Encontrando Mascotas.png',
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
    materialFileName: MEMBERS_ONLY_ROUTE + 'SOS - Manual de busqueda.pdf',
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
