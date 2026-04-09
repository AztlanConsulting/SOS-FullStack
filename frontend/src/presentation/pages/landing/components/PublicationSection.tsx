const PublicationSection = () => {
  return (
    <section className="bg-white overflow-hidden py-8">
      <div className="max-w-[414px] mx-auto px-4">
        <div className="relative w-[190px] h-[203px] mx-auto mb-6 rounded-lg overflow-hidden">
          <img
            src="/Screenshot 2026-03-05 at 12.22.27 p.m. 1.png"
            alt="Publicación"
            className="w-full h-full object-cover"
          />
          <div className="absolute left-[45px] top-[90px] w-[95.45px] h-[112.58px] outline-4 outline-primary-yellow outline-offset-[-8px]"></div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-medium text-dark mb-4">
            Tu publicación/anuncio estará visible dentro de un minuto
          </h2>
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;
