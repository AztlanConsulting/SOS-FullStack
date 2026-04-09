const ServicesSection = () => {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[414px] mx-auto px-4 py-4">
        <h2 className="text-2xl font-medium text-dark text-center mb-8">
          ¿Cómo te podemos ayudar?
        </h2>

        <div className="relative mx-auto w-[263px] h-[215px] mb-8">
          <div className="absolute inset-0 bg-primary-yellow rounded-xl"></div>
          <div className="absolute -inset-4 bg-white rounded-xl outline-4 outline-white outline-offset-[-8px]"></div>
          <img
            src="/image 7.png"
            alt="Servicios"
            className="absolute w-[198px] h-[190px] left-4 top-2 rounded-lg border-[1.8px] border-white"
          />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-medium text-dark mb-4">
            Ingresa la información de <br />
            tu mascota
          </h3>
          <p className="text-base text-gray font-normal leading-6">
            Compártenos el nombre de tu mascota, dónde se perdió, y algunas
            fotos para los anuncios en Facebook
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
