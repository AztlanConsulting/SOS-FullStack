import { ChevronRight, ChevronLeft } from './icons';

const testimonials = [
  {
    id: 1,
    name: 'Areceli cisneros',
    text: 'Súper recomendable, siempre atentos y de respuesta rápida. En cuanto te comunicas con ellos, comienza a asesorarte. Estoy muy agradecida, mi perrito apareció en menos de 48 horas después de publicar en SOS encontrando mascotas. Muchas gracias!!! Son un excelente equipo!!',
  },
  {
    id: 2,
    name: 'Juan Pérez',
    text: 'Excelente servicio, me ayudaron a encontrar a mi gato en menos de 24 horas. El equipo es muy profesional y siempre están disponibles para guiarte. Totalmente recomendado.',
  },
  {
    id: 3,
    name: 'María González',
    text: 'Gracias a SOS encontré a mi perrita después de 3 días de búsqueda. La publicación llegó a muchas personas y alguien la reconoció. Servicio increíble.',
  },
  {
    id: 4,
    name: 'Carlos Rodríguez',
    text: 'Muy profesionales, me guiaron en todo el proceso de búsqueda. Mi perro fue encontrado gracias a la difusión. Recommiendo 100%.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[rgba(249,205,72,0.20)] overflow-hidden py-8 lg:py-16">
      <div className="w-full px-4">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-black text-center mb-8 lg:mb-12 tracking-[0.40px]">
          ¿Qué dicen nuestros clientes?
        </h2>

        <div className="relative">
          <div className="overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            <div className="flex lg:grid lg:grid-cols-2 gap-6 snap-x snap-mandatory lg:snap-none">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-[85%] lg:w-auto snap-center bg-white rounded-lg shadow-[2px_3px_4px_#F9CD48] p-6 lg:p-8"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-light-gray border-2 border-border-gray flex-shrink-0 overflow-hidden">
                      <div className="w-5 h-5 rounded-full border-2 border-border-gray mx-auto mt-2"></div>
                    </div>
                    <p className="text-base lg:text-lg font-medium text-gray">
                      {testimonial.name}
                    </p>
                  </div>

                  <p className="text-base lg:text-lg text-gray font-normal leading-6">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <ChevronLeft className="w-6 h-6 text-primary-yellow" />
          </button>

          <button className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <ChevronRight className="w-6 h-6 text-primary-yellow" />
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button className="h-[47px] lg:h-[52px] px-6 lg:px-8 bg-primary-yellow rounded-[54px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-base font-medium text-black">
              Ver más opiniones
            </span>
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
