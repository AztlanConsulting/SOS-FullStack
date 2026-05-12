import { useState } from 'react';
import { Text } from '../../../shared/components/ui/Text';
import { RiArrowDropDownLine } from 'react-icons/ri';

const faqs = [
  {
    question: 'Radio de difusión',
    answer:
      'Es la zona geográfica donde difundimos el anuncio de tu mascota para que personas cercanas puedan verlo, compartirlo y ayudarte en su localización. Mientras más estratégico sea el alcance, mayores serán las posibilidades de recibir reportes útiles.',
  },
  {
    question: 'Asesor de búsqueda',
    answer:
      'Tu asesor de búsqueda te acompaña durante todo el proceso, resolviendo dudas, compartiendo recomendaciones y ayudándote a dar seguimiento a posibles reportes o coincidencias. No tendrás que enfrentar la búsqueda solo.',
  },
  {
    question: 'Garantía',
    answer:
      'Aunque ningún servicio puede garantizar el hallazgo de una mascota, nuestras estrategias de difusión, alcance geolocalizado y experiencia en búsqueda ayudan a aumentar considerablemente las probabilidades de encontrarla.',
  },
];

const FaqSection = () => {
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
              className="border border-purple rounded-lg color-light-purple-bg flex flex-col"
            >
              <div
                className="border-b border-purple rounded-lg px-5 py-4 cursor-pointer transition-all bg-white"
                onClick={() => toggle(index)}
              >
                <div className="flex justify-between items-center">
                  <Text variant="body">{faq.question}</Text>
                  <RiArrowDropDownLine
                    className={`text-purple transition-transform text-3xl ${
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

export default FaqSection;
