const ServicesSection = () => {
  return (
    <section className="bg-white overflow-hidden p-8 lg:p-16">
      <div className="w-full">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-dark text-center mb-8 lg:mb-12">
          ¿Cómo te podemos ayudar?
        </h2>

        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="">
            <img
              src="/image 7.png"
              alt="Servicios"
              className=""
            />
          </div>

          <div className="text-center lg:text-right">
            <h3 className="text-xl lg:text-2xl xl:text-3xl font-medium text-dark mb-4 lg:mb-6">
              Ingresa la información de <br className="hidden lg:block" />
              tu mascota
            </h3>
            <p className="text-base lg:text-lg text-gray font-normal leading-6 lg:leading-7 text-left">
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
