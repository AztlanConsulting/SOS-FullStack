import { Text } from '../../../shared/components/ui/Text';

const Credits = () => {
  return (
    <section className="color-secondary-bg overflow-hidden py-8 lg:py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6 lg:mb-10">
          <Text as="h2" variant="h2" weight="medium">
            Creditos de imagenes
          </Text>
        </div>

        <div className="text-left text-black">
          <ul className="space-y-2">
            <li>
              Dog illustration - Image by{' '}
              <a
                href="https://www.freepik.com/author/freepik"
                className="text-black underline"
              >
                Freepik
              </a>
            </li>
            <li>
              Lost pet poster - Image by{' '}
              <a
                href="https://www.freepik.com/author/rawpixel-com"
                className="text-black underline"
              >
                rawpixel.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Credits;
