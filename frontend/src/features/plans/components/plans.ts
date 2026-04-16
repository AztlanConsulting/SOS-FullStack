import type { PlanCardProps } from './PlanCard';

/**
 * Static configuration for the available service tiers.
 * Each plan includes specific coverage areas, durations, and feature sets.
 */

export const PLANS: PlanCardProps[] = [
  /**
   * Entry-level plan offering essential search tools for a limited time and radius.
   */
  {
    name: 'Básico',
    price: '390',
    duration: '3 días',
    radius: '10 km',
    features: [
      {
        label: 'Anuncio de 3 días en un área de 10km a la redonda',
        included: true,
      },
      { label: 'Publicación en nuestras redes sociales', included: true },
      { label: 'Video y lista de consejos de búsqueda', included: true },
      { label: 'Cartel para imprimir', included: true },
      {
        label: 'Asesor de búsqueda',
        included: false,
        tooltipTitle: '¿Qué es el asesor de búsqueda?',
        tooltip:
          'El asesor de búsqueda te ayudará con tus dudas, te informará sobre el anuncio y te avisará de inmediato si hay noticias de tu mascota, además de revisar otros anuncios para encontrar coincidencias.',
      },
      {
        label: 'Geolocalización dinámica',
        included: false,
        tooltipTitle: '¿Qué es la geolocalización dinámica?',
        tooltip:
          'La geolocalización dinámica permite mover el pin que indica dónde se muestran los anuncios. Si reportan que la mascota fue vista en otra zona o colonia, se puede cambiar la difusión del anuncio a esa ubicación en el momento.',
      },
      {
        label: 'Geolocalización doble',
        included: false,
        tooltipTitle: '¿Qué es la geolocalización doble?',
        tooltip:
          'La geolocalización doble permite colocar un segundo pin de ubicación para mostrar el anuncio en otra zona. Si reportan que la mascota fue vista en otra colonia o área, se puede agregar ese pin para que el anuncio también se difunda allí.',
      },
      { label: 'Instagram Reel', included: false },
    ],
    onSelect: () => {},
  },

  /**
   * Recommended tier featuring a balance of extended coverage and personalized assistance.
   * Marked as the "most popular" choice for users.
   */

  {
    name: 'Estándar',
    price: '840',
    duration: '7 días',
    radius: '30 km',
    highlighted: true,
    badge: 'El más popular',
    features: [
      {
        label: 'Anuncio de 7 días en un área de 30km a la redonda',
        included: true,
      },
      { label: 'Publicación en nuestras redes sociales', included: true },
      { label: 'Video y lista de consejos de búsqueda', included: true },
      { label: 'Cartel para imprimir', included: true },
      {
        label: 'Asesor de búsqueda',
        included: true,
        tooltipTitle: '¿Qué es el asesor de búsqueda?',
        tooltip:
          'El asesor de búsqueda te ayudará con tus dudas, te informará sobre el anuncio y te avisará de inmediato si hay noticias de tu mascota, además de revisar otros anuncios para encontrar coincidencias.',
      },
      {
        label: 'Geolocalización dinámica',
        included: true,
        tooltipTitle: '¿Qué es la geolocalización dinámica?',
        tooltip:
          'La geolocalización dinámica permite mover el pin que indica dónde se muestran los anuncios. Si reportan que la mascota fue vista en otra zona o colonia, se puede cambiar la difusión del anuncio a esa ubicación en el momento.',
      },
      {
        label: 'Geolocalización doble',
        included: false,
        tooltipTitle: '¿Qué es la geolocalización doble?',
        tooltip:
          'La geolocalización doble permite colocar un segundo pin de ubicación para mostrar el anuncio en otra zona. Si reportan que la mascota fue vista en otra colonia o área, se puede agregar ese pin para que el anuncio también se difunda allí.',
      },
      { label: 'Instagram Reel', included: false },
    ],
    onSelect: () => {},
  },

  /**
   * Premium tier with maximum duration, radius, and all advanced geolocation features.
   * Includes high-engagement formats like Instagram Reels.
   */

  {
    name: 'Premium',
    price: '1600',
    duration: '15 días',
    radius: '40 km',
    features: [
      {
        label: 'Anuncio de 15 días en un área de 40km a la redonda',
        included: true,
      },
      { label: 'Publicación en nuestras redes sociales', included: true },
      { label: 'Video y lista de consejos de búsqueda', included: true },
      { label: 'Cartel para imprimir', included: true },
      {
        label: 'Asesor de búsqueda',
        included: true,
        tooltipTitle: '¿Qué es el asesor de búsqueda?',
        tooltip:
          'El asesor de búsqueda te ayudará con tus dudas, te informará sobre el anuncio y te avisará de inmediato si hay noticias de tu mascota, además de revisar otros anuncios para encontrar coincidencias.',
      },
      {
        label: 'Geolocalización dinámica',
        included: true,
        tooltipTitle: '¿Qué es la geolocalización dinámica?',
        tooltip:
          'La geolocalización dinámica permite mover el pin que indica dónde se muestran los anuncios. Si reportan que la mascota fue vista en otra zona o colonia, se puede cambiar la difusión del anuncio a esa ubicación en el momento.',
      },
      {
        label: 'Geolocalización doble',
        included: true,
        tooltipTitle: '¿Qué es la geolocalización doble?',
        tooltip:
          'La geolocalización doble permite colocar un segundo pin de ubicación para mostrar el anuncio en otra zona. Si reportan que la mascota fue vista en otra colonia o área, se puede agregar ese pin para que el anuncio también se difunda allí.',
      },
      { label: 'Instagram Reel', included: true },
    ],
    onSelect: () => {},
  },
];
