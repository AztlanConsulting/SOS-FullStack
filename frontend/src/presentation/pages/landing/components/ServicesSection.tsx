const ServicesSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8 lg:py-16">
      <div className="w-full px-4">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-dark text-center mb-8 lg:mb-12">
          ¿Cómo te podemos ayudar?
        </h2>

        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="relative w-[263px] h-[215px] lg:w-[320px] lg:h-[280px] xl:w-[380px] xl:h-[340px] flex-shrink-0">
            <div className="absolute inset-0 bg-primary-yellow rounded-xl"></div>
            <div className="absolute -inset-4 bg-white rounded-xl outline-4 outline-white outline-offset-[-8px]"></div>
            <img
              src="/image 7.png"
              alt="Servicios"
              className="absolute w-[198px] h-[190px] lg:w-[240px] lg:h-[230px] xl:w-[280px] xl:h-[270px] left-4 top-2 lg:left-5 lg:top-3 rounded-lg border-[1.8px] border-white"
            />
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left">
            <h3 className="text-xl lg:text-2xl xl:text-3xl font-medium text-dark mb-4 lg:mb-6">
              Ingresa la información de <br className="hidden lg:block" />
              tu mascota
            </h3>
            <p className="text-base lg:text-lg text-gray font-normal leading-6 lg:leading-7">
              Compártenos el nombre de tu mascota, dónde se perdió, y algunas
              fotos para los anuncios en Facebook
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
