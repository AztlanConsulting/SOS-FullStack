import List from '@shared/components/ui/List';
import MembersOnlyCard from './MembersOnlyCard';
import type { MembersOnlyContent } from '../types/membersOnly.types';
import petAndOwners from '@assets/images/petAndOwners.png';
import members from '@assets/images/members.png';
import dog1 from '@assets/images/dog1.png';
import owner from '@assets/images/owner.png';

export const membersOnlyCards: MembersOnlyContent[] = [
  {
    id: 'guia-busqueda',
    title: 'Guía paso a paso para la búsqueda',
    description:
      'Sigue estos pasos organizados para maximizar las probabilidades de encontrar a tu mascota.',
    imageUrl: petAndOwners,
    content: `La búsqueda de una mascota perdida es un proceso que requiere organización y calma. Aquí te presentamos una guía completa para seguir paso a paso.

Paso 1: Actúa inmediatamente. Los primeros minutos son cruciales. La mayoría de mascotas no se alejan mucho en las primeras horas. Revisa tu casa, jardín, garaje y cualquier rincón donde pueda haberse escondido.

Paso 2: Notifica a vecinos y personas cercanas. Comparte una descripción clara y foto de tu mascota. Cuantas más personas sepan, más ojos estarán buscando.

Paso 3: Utiliza las redes sociales y plataformas de mascotas perdidas. Publica en grupos locales de Facebook, Instagram y en nuestra plataforma SOS Mascotas.

Paso 4: Coloca carteles en la zona con foto, descripción y tu contacto. Incluye lugares clave como parques, tiendas de mascotas y veterinarias cercanas.

Paso 5: No te desanimes. Muchas mascotas se encuentran después de días o incluso semanas. Sigue buscando y mantén la esperanza.`,
  },
  {
    id: 'primeras-24-horas',
    title: 'Qué hacer en las primeras 24 horas',
    description:
      'Las primeras horas son las más importantes. Aprende qué acciones tomar de inmediato.',
    imageUrl: members,
    content: `Las primeras 24 horas después de perder a tu mascota son las más críticas. Aquí te decimos exactamente qué hacer:

Hora 1-2: Busca en un radio de 100 metros. Llama a tu mascota por su nombre con calma. Revisa debajo de autos, en arbustos y espacios cerrados cercanos.

Hora 3-4: Pide ayuda a familiares y vecinos para ampliar la búsqueda. Divide la zona y busca sistemáticamente.

Hora 5-8: Contacta refugios, veterinarias y control animal de tu zona. Proporciona descripción y foto actualizada.

Hora 9-12: Crea y distribuye carteles con información clara. Incluye foto reciente, descripción física, zona donde se perdió y datos de contacto.

Hora 13-24: Publica en redes sociales y grupos locales. Usa plataformas especializadas como SOS Mascotas para mayor alcance.

Recuerda mantener la calma y no dejar de buscar. Muchos casos se resuelven gracias a la persistencia.`,
  },
  {
    id: 'volantes-efectivos',
    title: 'Cómo crear volantes efectivos',
    description:
      'Aprende a diseñar carteles que capten la atención y generen resultados.',
    imageUrl: dog1,
    content: `Un buen volante puede ser la diferencia entre encontrar o no a tu mascota. Sigue estas recomendaciones:

Título grande y visible: Usa "MASCOTA PERDIDA" en letras grandes y llamativas. Debe leerse a distancia.

Foto clara y reciente: Usa la mejor foto disponible, donde se vea claramente la cara y el cuerpo de tu mascota. Evita fotos con filtros o de lejos.

Información esencial: Incluye nombre, raza, color, tamaño, señales particulares (collar, marcas) y zona donde se perdió.

Contacto visible: Tu número de teléfono debe ser grande y legible. Agrega un segundo número de respaldo si es posible.

Diseño simple: No satures el volante con información. Usa colores contrastantes y fuente legible.

Distribución estratégica: Coloca en postes, tiendas, parques, veterinarias y zonas de alto tráfico. Pide permiso cuando sea necesario.

Recuerda actualizar o retirar los carteles cuando encuentres a tu mascota.`,
  },
  {
    id: 'recursos-utiles',
    title: 'Recursos y contactos útiles',
    description:
      'Directorio de instituciones, refugios y organizaciones que pueden ayudarte.',
    imageUrl: owner,
    content: `Cuando pierdes a tu mascota, saber a quién acudir es fundamental. Aquí tienes una lista de recursos útiles:

Veterinarias locales: Contacta todas las veterinarias de tu zona. Muchos animales perdidos son llevados allí por personas que los encuentran.

Refugios municipales: Visita personalmente los refugios al menos cada 2-3 días. Las descripciones por teléfono no siempre son precisas.

Control animal: Registra tu mascota como perdida en la oficina de control animal de tu municipio.

Redes sociales: Grupos de Facebook como "Mascotas Perdidas [tu ciudad]" son muy efectivos para difundir la búsqueda.

Microchip: Si tu mascota tiene microchip, contacta al registrador para reportarla como perdida. Así si alguien la escanea, recibirás una alerta.

Voluntarios: Organizaciones de rescate animal pueden ayudarte con la búsqueda activa y el monitoreo de cámaras trampa.

No estás solo en este proceso. Existen muchas personas y organizaciones dispuestas a ayudarte.`,
  },
];

const MembersOnlyListSection = () => {
  return (
    <section className="color-light-purple-bg w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
        <List<MembersOnlyContent>
          cards={membersOnlyCards}
          component={(card, idx) => <MembersOnlyCard card={card} key={idx} />}
        />
      </div>
    </section>
  );
};

export default MembersOnlyListSection;
