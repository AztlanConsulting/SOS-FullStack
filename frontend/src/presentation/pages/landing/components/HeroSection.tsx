import { ChevronRight } from './icons';

const HeroSection = () => {
  return (
    <section className="relative bg-[rgba(249,205,72,0.20)] min-h-[670px] md:min-h-auto overflow-hidden">
      <div className="max-w-[414px] mx-auto px-4 py-8 relative">
        <img
          src="/a9b7513d-555d-45ad-ab13-c11750d8d120 1.png"
          alt="Mascota"
          className="w-[215px] h-[283px] mx-auto rounded-lg shadow-[0px_4px_4px_#F9CD48] mb-6"
        />

        <div className="text-center">
          <h1 className="text-[32px] font-medium text-dark leading-[36px] mb-4">
            Te ayudamos a buscar tu mascota
          </h1>
          <p className="text-base text-gray font-normal leading-6 tracking-[0.20px] mb-8">
            Publica anuncios, difunde la búsqueda y utiliza nuestros servicios
            para reunir a tu mascota con su familia.
          </p>
        </div>

        <div className="flex flex-col gap-3 px-2">
          <button className="w-full h-[47.48px] bg-primary-yellow text-white rounded-[20px] font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            Perdí mi mascota
            <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
          </button>

          <button className="w-full h-[47.48px] bg-white text-primary-yellow rounded-[20px] font-semibold text-base border-2 border-primary-yellow flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            Encontré una mascota
            <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
          </button>
        </div>

        <div className="absolute right-0 top-[471px]">
          <div className="w-[30px] h-[104px] bg-primary-yellow rounded-tl-[8px] rounded-bl-[8px] flex items-end justify-center py-4">
            <span className="text-sm font-medium text-black rotate-[-90deg] whitespace-nowrap tracking-[0.16px]">
              Síguenos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
