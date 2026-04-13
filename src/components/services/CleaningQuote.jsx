import cleaningQuote from "@/assets/services/quote/cleaning-quote.webp";
import Image from "next/image";
import ButtonSolid from "../ButtonSolid";
export default function CleaningQuote() {
  return (
    <section className="container my-8 sm:my-16">
      <div className="border rounded-xl p-8 grid md:grid-cols-2  md:gap-2 lg:gap-8 xl:gap-22">
        <div className="order-2 md:order-1 mt-5 md:mt-0 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[60px]">Request your free cleaning quote</h1>
          <p className="mt-6 mb-5">
            Tell us about your facility — space type, square footage, and schedule. We'll assess your needs and deliver a clear, written quote within 24–48 hours.
No obligation. 
          </p>
          <div className="flex gap-8 justify-center sm:justify-start">
            <ButtonSolid>Get a Free Quote</ButtonSolid>
            <ButtonSolid color="white">Call Now</ButtonSolid>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image width={546} height={364} src={cleaningQuote} alt="cleaning-quote" className="rounded-2xl w-full" />
        </div>
      </div>
    </section>
  );
}
