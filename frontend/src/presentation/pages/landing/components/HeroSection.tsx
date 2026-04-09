import { ChevronRight } from './icons';

const HeroSection = () => {
  return (
    <section className="relative bg-[rgba(249,205,72,0.20)] overflow-hidden py-8 lg:py-16">
      <div className="w-full px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1 max-w-xl lg:max-w-2xl order-2 lg:order-1 text-left">
            <h1 className="text-[32px] lg:text-4xl xl:text-5xl font-medium text-dark leading-tight lg:leading-[44px] mb-4 lg:mb-6">
              Te ayudamos a buscar tu mascota
            </h1>
            <p className="text-base lg:text-lg text-gray font-normal leading-6 lg:leading-7 tracking-[0.20px] mb-8 lg:mb-10">
              Publica anuncios, difunde la búsqueda y utiliza nuestros servicios
              para reunir a tu mascota con su familia.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 max-w-md">
              <button className="h-[47px] lg:h-[52px] px-6 lg:px-8 bg-primary-yellow text-white rounded-[20px] font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Perdí mi mascota
                <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
              </button>

              <button className="h-[47px] lg:h-[52px] px-6 lg:px-8 bg-white text-primary-yellow rounded-[20px] font-semibold text-base border-2 border-primary-yellow flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                Encontré una mascota
                <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
              </button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <img
              src="/a9b7513d-555d-45ad-ab13-c11750d8d120 1.png"
              alt="Mascota"
              className="w-[215px] h-[283px] lg:w-[300px] lg:h-[380px] xl:w-[350px] xl:h-[440px] rounded-lg"
            />

            <div className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2">
              <div className="w-[30px] h-[104px] bg-primary-yellow rounded-tl-[8px] rounded-bl-[8px] flex items-end justify-center py-4">
                <span className="text-sm font-medium text-black rotate-[-90deg] whitespace-nowrap tracking-[0.16px]">
                  Síguenos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
