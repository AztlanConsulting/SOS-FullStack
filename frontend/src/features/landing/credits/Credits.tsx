import {} from '../../../shared/components/ui/Text';

const Credits = () => {
  return (
    <section className="overflow-hidden py-4 lg:py-8">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="text-left text-black">
          <ul className="space-y-1">
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
