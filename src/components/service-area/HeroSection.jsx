import ButtonSolid from "../ButtonSolid";
export default function HeroSection() {
  return (
    <section className="container mt-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[32px] sm:text-5xl lg:text-[56px] leading-[120%]">Commercial cleaning <br /> services in NYC</h1>
        <p className="md:text-lg my-6">
          NYC Clean Team brings 25+ years of expertise to every facility we service across New York City.
        </p>
        <div className="flex gap-8">
          <ButtonSolid>Get a Quote</ButtonSolid>
          <ButtonSolid color="white">Call now</ButtonSolid>
        </div>
      </div>
    </section>
  );
}

