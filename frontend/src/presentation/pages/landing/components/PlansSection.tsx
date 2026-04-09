const PlansSection = () => {
  return (
    <section className="bg-white py-8">
      <div className="max-w-[414px] mx-auto px-4">
        <div className="relative w-[200px] h-[196px] mx-auto mb-4 rounded-lg overflow-hidden">
          <img
            src="/Screenshot 2026-03-05 at 12.15.07 p.m. 1.png"
            alt="Planes"
            className="w-full h-full object-cover"
          />
          <div className="absolute -inset-4 outline-4 outline-primary-yellow outline-offset-[-8px]"></div>
          <div className="absolute -inset-1 rotate-[-2deg] outline-2 outline-[#FAFAFA] outline-offset-[-2.5px]"></div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-medium text-dark mb-4">
            Elige el plan que te acomode
          </h2>
          <p className="text-base text-gray font-normal leading-6">
            En SOS ofrecemos diferentes planes de alcance y seguimiento, para
            que puedas tener un plan personalizado que se ajuste a tus
            necesidades
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
