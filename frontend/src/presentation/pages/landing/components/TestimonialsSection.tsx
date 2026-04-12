import { useState } from 'react';
import { ChevronRight, ChevronLeft } from './icons';
import { Text } from '../../../../shared/components/ui/Text';
import { Button } from '../../../../shared/components/ui/Button';
import { CiShare1 } from "react-icons/ci";

const ChevronRightIcon = ({ size = 22 }: { size?: number }) => (
  <ChevronRight className={`w-[${size}px] h-[${size}px]`} />
);

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
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-light-gray border-2 border-border-gray flex-shrink-0 overflow-hidden">
        <div className="w-5 h-5 rounded-full border-2 border-border-gray mx-auto mt-2"></div>
      </div>
      <Text variant="body" weight="medium">
        {name}
      </Text>
    </div>
    <Text variant="body">{text}</Text>
  </div>
);

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = testimonials.length;
  const totalPairs = Math.ceil(totalSlides / 2);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 2) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 2 + totalSlides) % totalSlides);
  };

  const displayedTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % totalSlides],
  ];

  return (
    <section className="bg-[rgba(249,205,72,0.20)] overflow-hidden py-8 lg:py-16">
      <div className="w-full px-4">
        <div className="text-center mb-8 lg:mb-12">
          <Text as="h2" variant="h2" weight="medium">
            ¿Qué dicen nuestros clientes?
          </Text>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-2xl relative">
            {displayedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className={index === 1 ? 'hidden lg:block' : ''}
              >
                <TestimonialCard
                  name={testimonial.name}
                  text={testimonial.text}
                />
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 lg:left-0 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6 text-primary-yellow" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="w-6 h-6 text-primary-yellow" />
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPairs }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 2)}
              className={`w-3 h-3 rounded-full transition-colors ${
                Math.floor(currentIndex / 2) === index
                  ? 'bg-primary-yellow'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button label="Ver más opiniones" icon={CiShare1} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
