const PublicationSection = () => {
  return (
    <section className="bg-white overflow-hidden p-8 lg:p-16">
      <div className="w-full px-4">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="">
            <img
              src="/Screenshot 2026-03-05 at 12.22.27 p.m. 1.png"
              alt="Publicación"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1 lg:order-2">
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-medium text-dark mb-4 lg:mb-6">
              Tu publicación/anuncio estará visible dentro de un minuto
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;
