import { ChevronRight, ChevronLeft } from './icons';

const TestimonialsSection = () => {
  return (
    <section className="bg-[rgba(249,205,72,0.20)] overflow-hidden py-8">
      <div className="max-w-[414px] mx-auto px-4">
        <h2 className="text-2xl font-medium text-black text-center mb-8 tracking-[0.40px]">
          ¿Qué dicen nuestros clientes?
        </h2>

        <div className="relative bg-white rounded-lg shadow-[2px_3px_4px_#F9CD48] p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-light-gray border-2 border-border-gray flex-shrink-0 overflow-hidden">
              <div className="w-5 h-5 rounded-full border-2 border-border-gray mx-auto mt-2"></div>
            </div>
            <p className="text-base text-gray font-normal leading-6">
              Areceli cisneros
            </p>
          </div>

          <p className="text-base text-gray font-normal leading-6">
            Súper recomendable, siempre atentos y de respuesta rápida. En cuanto
            te comunicas con ellos, comienza a asesorarte. Estoy muy agradecida,
            mi perrito apareció en menos de 48 horas después de publicar en SOS
            encontrando mascotas. Muchas gracias!!! Son un excelente equipo!!
          </p>

          <button className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-10 text-primary-yellow" />
          </button>

          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-10 flex items-center justify-center">
            <ChevronRight className="w-6 h-10 text-primary-yellow" />
          </button>
        </div>

        <div className="flex justify-center">
          <button className="w-[330px] h-[47px] bg-primary-yellow rounded-[54px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
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
