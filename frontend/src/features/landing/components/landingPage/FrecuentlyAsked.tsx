import { useState } from 'react';
import { Text } from '../../../../shared/components/ui/Text';
import { RiArrowDropDownLine } from 'react-icons/ri';

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
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section className="bg-white overflow-hidden border-b border-border-gray py-8 lg:py-16">
      <div className="w-5/6 mx-auto">
        <div className="text-center mb-6 lg:mb-10">
          <Text as="h2" variant="h2" weight="medium">
            Preguntas frecuentes
          </Text>
        </div>

        {/* FAQ container */}
        <div className=" max-w-2xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-yellow-400 rounded-lg color-secondary-bg flex flex-col"
            >
              <div
                className="border-b border-yellow-400 rounded-lg px-5 py-4 cursor-pointer transition-all bg-white"
                onClick={() => toggle(index)}
              >
                <div className="flex justify-between items-center">
                  <Text variant="body">{faq.question}</Text>
                  <RiArrowDropDownLine
                    className={`text-yellow-400 transition-transform text-3xl ${
                      openIndexes.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {openIndexes.includes(index) && (
                <div className="px-5 py-3">
                  <Text variant="body" className="color-grey-text">
                    {faq.answer}
                  </Text>
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
