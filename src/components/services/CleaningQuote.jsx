import cleaningQuote from "@/assets/services/quote/cleaning-quote.webp";
import Image from "next/image";
import ButtonSolid from "../ButtonSolid";
export default function CleaningQuote() {
  return (
    <section className="container my-16">
      <div className="border rounded-xl py-5 md:py-12 px-5 grid md:grid-cols-2  md:gap-10 xl:gap-22">
        <div className="order-2 md:order-1 mt-5 md:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[60px]">Request your free cleaning quote</h1>
          <p className="mt-6 mb-5">
            Let us evaluate your facility and create a customized cleaning plan
            tailored to your space, schedule, and industry requirements. Our
            team will assess your needs, identify high-traffic areas, and design
            a solution that ensures consistent cleanliness and long-term
            efficiency.
          </p>
          <div className="flex gap-8">
            <ButtonSolid>Quote</ButtonSolid>
            <ButtonSolid color="white">Call</ButtonSolid>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image width={546} height={364} src={cleaningQuote} alt="cleaning-quote" className="rounded-2xl " />
        </div>
      </div>
    </section>
  );
}
