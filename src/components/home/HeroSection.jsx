import cleaningNyc from "@/assets/home/cleaning-team.webp";
import Image from "next/image";
import ButtonSolid from "../ButtonSolid";
export default function HeroSection() {
  return (
    <section className="container mt-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[32px] sm:text-5xl lg:text-[56px] leading-[120%]">Commercial cleaning <br /> services in NYC</h1>
        <p className="md:text-lg my-6">
          Reliable. Insured. Professional. We handle the work so you can focus
          on what matters.
        </p>
        <div className="flex gap-8">
          <ButtonSolid>Get a Quote</ButtonSolid>
          <ButtonSolid color="white">Call now</ButtonSolid>
        </div>
      </div>
      <div className="mt-6">
        <Image src={cleaningNyc} alt="cleaningNyc"  className="rounded-lg w-full h-auto object-cover max-h-56 sm:max-h-100 md:max-h-279.5"/>
      </div>
    </section>
  );
}
