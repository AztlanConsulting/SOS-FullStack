const PetInfoSection = () => {
  return (
    <section className="bg-white overflow-hidden border-b border-border-gray py-8 lg:py-16">
      <div className="w-full px-4">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-black text-center mb-6 lg:mb-10 tracking-[0.40px]">
          Cuéntanos de tu mascota
        </h2>

        <div className="max-w-3xl mx-auto">
          <img
            src="/dog-lies-legs-owner-man-pink-shirt-his-beloved-woman-admire-their-white-pet 1.png"
            alt="Tu mascota"
            className="w-full h-[220px] lg:h-[320px] xl:h-[400px] rounded-lg mb-6 lg:mb-8 object-cover"
          />
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-base lg:text-lg text-gray font-normal leading-6 lg:leading-7">
            Déjanos la información de tu mascota para comenzar la búsqueda
          </p>
        </div>
      </div>
    </section>
  );
};

export default PetInfoSection;
