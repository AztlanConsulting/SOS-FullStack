const PetInfoSection = () => {
  return (
    <section className="bg-white overflow-hidden border-b border-border-gray">
      <div className="max-w-[414px] mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-black text-center mb-6 tracking-[0.40px]">
          Cuéntanos de tu mascota
        </h2>

        <img
          src="/dog-lies-legs-owner-man-pink-shirt-his-beloved-woman-admire-their-white-pet 1.png"
          alt="Tu mascota"
          className="w-full h-[220px] rounded-lg shadow-[2px_3px_4px_#F9CD48] mb-6 object-cover"
        />

        <div className="text-center">
          <p className="text-base text-gray font-normal leading-6">
            Déjanos la información de tu mascota para comenzar la búsqueda
          </p>
        </div>
      </div>
    </section>
  );
};

export default PetInfoSection;
