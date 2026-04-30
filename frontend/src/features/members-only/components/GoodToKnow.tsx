import { useState } from 'react';
import { Text } from '../../../shared/components/ui/Text';
import { Button } from '../../../shared/components/ui/Button';
import { CiShare1 } from 'react-icons/ci';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';

const testimonials = [
  {
    id: 1,
    name: '¿Publicación, anuncio y geolocalización?',
    text: 'Una publicación es un post normal sin alcance masivo. Un anuncio es publicidad pagada que se muestra a un público específico. La geolocalización permite dirigir ese anuncio a personas cercanas a la zona donde se perdió la mascota.',
  },
  {
    id: 2,
    name: 'Actividades 100% digitales',
    text: 'El servicio se realiza completamente en línea e incluye una publicación con anuncio programado. El éxito depende también de seguir las recomendaciones de búsqueda.',
  },
  {
    id: 3,
    name: '¿Cómo revisar tu anuncio?',
    text: 'Puedes verificarlo en la sección “Transparencia de la página” dentro de la biblioteca de anuncios de Facebook.',
  },
];

const TestimonialCard = ({
  name,
  text,
  state,
}: {
  name: string;
  text: string;
  state: 'current' | 'enter-left' | 'enter-right' | 'exit-left' | 'exit-right';
}) => {
  const stateClasses = {
    current: '',
    'enter-left': 'animate-enter-left',
    'enter-right': 'animate-enter-right',
    'exit-left': 'animate-exit-left',
    'exit-right': 'animate-exit-right',
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-[2px_3px_4px_#9D7FAD] p-6 lg:p-8 h-full absolute inset-0 ${stateClasses[state]}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Text variant="body" weight="medium" className="self-center">
          {name}
        </Text>
      </div>
      <Text variant="body">{text}</Text>

      <style>{`
        @keyframes enterLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes enterRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes exitLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
          }
        }

        @keyframes exitRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .animate-enter-left {
          animation: enterLeft 0.6s ease-out forwards;
        }

        .animate-enter-right {
          animation: enterRight 0.6s ease-out forwards;
        }

        .animate-exit-left {
          animation: exitLeft 0.6s ease-out forwards;
        }

        .animate-exit-right {
          animation: exitRight 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const totalSlides = testimonials.length;

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
      setIsAnimating(false);
    }, 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      setIsAnimating(false);
    }, 600);
  };

  const currentTestimonial = testimonials[currentIndex];
  const nextTestimonial =
    direction === 'next'
      ? testimonials[(currentIndex + 1) % totalSlides]
      : testimonials[(currentIndex - 1 + totalSlides) % totalSlides];

  return (
    <section className="color-light-purple-bg  overflow-hidden py-8 lg:py-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <Text as="h2" variant="h2" weight="medium">
            Lo que tienes que saber
          </Text>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-6 w-full max-w-2xl relative h-96 sm:h-60">
            {!isAnimating ? (
              <TestimonialCard
                name={currentTestimonial.name}
                text={currentTestimonial.text}
                state="current"
              />
            ) : (
              <>
                <TestimonialCard
                  name={currentTestimonial.name}
                  text={currentTestimonial.text}
                  state={direction === 'next' ? 'exit-left' : 'exit-right'}
                />
                <TestimonialCard
                  name={nextTestimonial.name}
                  text={nextTestimonial.text}
                  state={direction === 'next' ? 'enter-right' : 'enter-left'}
                />
              </>
            )}

            <button
              onClick={prevSlide}
              className="absolute -left-10 top-1/2 w-12 h-12 -translate-x-1 
                        lg:w-10 lg:h-10 lg:-left-12 lg:translate-x-0 flex 
                        items-center justify-center transition-shadow cursor-pointer"
            >
              <MdNavigateBefore className="w-10 h-10 lg:w-15 lg:h-15 text-purple" />
            </button>

            <button
              onClick={nextSlide}
              className=" absolute -right-10 top-1/2 w-12 h-12 translate-x-1 
              lg:w-10 lg:h-10 lg:-right-12 lg:translate-x-0 flex items-center 
              justify-center transition-shadow cursor-pointer"
            >
              <MdNavigateNext className="w-10 h-10 lg:w-15 lg:h-15 text-purple" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
