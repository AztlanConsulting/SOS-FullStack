const PlansSection = () => {
  return (
    <section className="bg-white py-8 lg:py-16">
      <div className="w-full px-4">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-12">
          <div className="relative w-[200px] h-[196px] lg:w-[280px] lg:h-[260px] xl:w-[350px] xl:h-[320px] flex-shrink-0 order-2 lg:order-2">
            <img
              src="/Screenshot 2026-03-05 at 12.15.07 p.m. 1.png"
              alt="Planes"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 max-w-xl lg:max-w-2xl text-center lg:text-left order-1 lg:order-1">
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-medium text-dark mb-4 lg:mb-6">
              Elige el plan que te acomode
            </h2>
            <p className="text-base lg:text-lg text-gray font-normal leading-6 lg:leading-7">
              En SOS ofrecemos diferentes planes de alcance y seguimiento, para
              que puedas tener un plan personalizado que se ajuste a tus
              necesidades
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
