import { useState } from 'react';
import { Text } from '../../../../shared/components/ui/Text';
import { Button } from '../../../../shared/components/ui/Button';
import { CiShare1 } from 'react-icons/ci';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';
import { HiOutlineUserCircle } from 'react-icons/hi';

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

const TestimonialCard = ({ name, text }: { name: string; text: string }) => (
  <div className="bg-white rounded-lg shadow-[2px_3px_4px_#F9CD48] p-6 lg:p-8 h-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center">
        <HiOutlineUserCircle strokeWidth={1} className="w-10 h-10 text-black" />
      </div>
      <Text variant="body" weight="medium" className="self-center">
        {name}
      </Text>
    </div>
    <Text variant="body">{text}</Text>
  </div>
);

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = testimonials.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const displayedTestimonials = [testimonials[currentIndex]];

  return (
    <section className="color-secondary-bg overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <Text as="h2" variant="h2" weight="medium">
            ¿Qué dicen nuestros clientes?
          </Text>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-6 max-w-2xl relative">
            {displayedTestimonials.map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`}>
                <TestimonialCard
                  name={testimonial.name}
                  text={testimonial.text}
                />
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute -left-10 top-1/2 w-12 h-12 -translate-x-1 lg:w-10 lg:h-10 lg:-left-12 lg:translate-x-0 flex items-center justify-center transition-shadow"
            >
              <MdNavigateBefore className="w-10 h-10 lg:w-15 lg:h-15 text-[#f9cd48]" />
            </button>

            <button
              onClick={nextSlide}
              className=" absolute -right-10 top-1/2 w-12 h-12 translate-x-1 lg:w-10 lg:h-10 lg:-right-12 lg:translate-x-0 flex items-center justify-center transition-shadow"
            >
              <MdNavigateNext className="w-10 h-10 lg:w-15 lg:h-15 text-[#f9cd48]" />
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-8 lg:w-1/2 max-w-md mx-auto">
          <Button label="Ver más opiniones" icon={CiShare1} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
