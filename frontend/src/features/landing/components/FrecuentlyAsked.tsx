import { useState } from 'react';
import { Text } from '../../../shared/components/ui/Text';
import { RiArrowDropDownLine } from "react-icons/ri";

const faqs = [
  {
    question: '¿Cómo trabajamos?',
    answer:
      'Recopilamos la información de tu mascota y utilizamos herramientas para ayudar a encontrar coincidencias y difundirla.',
  },
  {
    question: '¿Por qué cobramos?',
    answer:
      'El costo ayuda a mantener la plataforma, mejorar la visibilidad de las publicaciones y optimizar la búsqueda.',
  },
  {
    question: '¿Solo es para perros o gatos?',
    answer:
      'No, puedes registrar cualquier tipo de mascota perdida o encontrada.',
  },
];

const FrecuentlyAsked = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white overflow-hidden border-b border-border-gray py-8 lg:py-16">
      <div className="w-5/6 mx-auto">
        <div className="text-center mb-6 lg:mb-10">
          <Text as="h3" variant="h3" weight="medium">
            Preguntas frecuentes
          </Text>
        </div>

        {/* FAQ container */}
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-yellow-400 rounded-xl px-5 py-4 cursor-pointer transition-all"
              onClick={() => toggle(index)}
            >
              <div className="flex justify-between items-center">
                <Text variant="body">
                  {faq.question}
                </Text>

                <span
                  className={`transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                <RiArrowDropDownLine 
                className={`text-yellow-400 transition-transform text-3xl ${
                    openIndex === index ? 'rotate-180' : ''}`}
                />
                </span>
              </div>

              {openIndex === index && (
                <div className="mt-3 text-gray-600 text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrecuentlyAsked;