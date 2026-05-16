import { useState } from 'react';
import { Text } from '../../../../shared/components/ui/Text';
import { RiArrowDropDownLine } from 'react-icons/ri';

const faqs = [
  {
    question: '¿Cómo trabajamos?',
    answer:
      'Recopilamos los datos de tu mascota y la difundimos de forma masiva y estratégica en redes sociales, grupos comunitarios y nuestra red de contactos para maximizar las posibilidades de encontrarla.',
  },
  {
    question: '¿Por qué cobramos?',
    answer:
      'Invertimos en publicidad pagada, alcance masivo y herramientas profesionales para que tu búsqueda llegue a miles de personas. Un servicio serio requiere recursos reales.',
  },
  {
    question: '¿Funciona para perros, gatos u otras especies?',
    answer:
      'Sí. Adaptamos las estrategias dependiendo de la especie, personalidad de la mascota y circunstancias de la pérdida. También podemos ayudarte en casos de aves, conejos y otras mascotas, ajustando la difusión y las recomendaciones según cada situación.',
  },
  {
    question: '¿En cuánto tiempo pueden encontrar a mi mascota?',
    answer:
      'Cada caso es diferente, por lo que no existe un tiempo exacto para localizar a una mascota. Algunas aparecen en pocas horas y otras pueden tomar más tiempo. Lo importante es actuar rápido, mantener una búsqueda constante y aumentar la difusión desde el inicio para mejorar las probabilidades de encontrarla.',
  },
  {
    question: '¿En qué ciudades operan?',
    answer:
      'Nuestro servicio es completamente digital, por lo que podemos ayudarte en distintas ciudades y países. La difusión se adapta estratégicamente a la zona donde se perdió tu mascota mediante anuncios geolocalizados y redes sociales.',
  },
  {
    question: '¿Pueden garantizar que encontrarán a mi mascota?',
    answer:
      'No podemos garantizar el hallazgo, ya que cada caso depende de muchos factores. Sin embargo, nuestras estrategias ayudan a aumentar considerablemente las probabilidades de localización.',
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
    <section className="bg-white overflow-hidden py-8 lg:py-16 ">
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
