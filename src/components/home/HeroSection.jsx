"use client";
import { trackCtaClick, trackPhoneClick } from "@/lib/gtm";
import Link from "next/link";
import ButtonSolid from "../ButtonSolid";
export default function HeroSection() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div className="relative overflow-hidden">
        <video
          poster="/images/videoplaceholder.webp"
          autoPlay
          muted
          loop
          playsInline
          className="rounded-[20px] w-full object-cover h-100 xs:h-85 sm:h-full sm:hidden"
        >
          <source src="/videos/city-video-mobile.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          poster="/images/videoplaceholder.webp"
          autoPlay
          muted
          loop
          playsInline
          className="rounded-[20px] w-full object-cover h-100 xs:h-85 sm:h-full hidden sm:block"
        >
          <source src="/videos/city-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* <Image
          src={cleaningNyc}
          alt="cleaningNyc"
          className="rounded-lg w-full h-100 sm:h-auto object-cover max-h-100 sm:max-h-100 md:max-h-208.5"
        /> */}
        <div className="w-full h-full bg-black/20 backdrop-blur-sm  absolute top-0 left-0   rounded-[20px]">
          <div className="text-white flex flex-col items-center justify-center text-center h-full px-2 sm:px-4">
            <h1 className="text-[32px] sm:text-5xl lg:text-[56px] leading-[120%] ">
              Commercial cleaning <br /> services in NYC
            </h1>
            <p className="md:text-lg my-6 md:my-9 max-w-250">
              Reliable, professional commercial cleaning for offices, retail,
              medical, and high-traffic facilities across New York City. No
              shortcuts. Just consistent results.
            </p>
            <div className="flex flex-col-reverse xs:flex-row gap-4  items-center xs:gap-5 sm:gap-8">
              <Link href="/contact" onClick={() => trackCtaClick("Get a Free Quote", "hero_section")}>
                <ButtonSolid>Get a Free Quote</ButtonSolid>
              </Link>

              <a href="tel:+16313817252" onClick={() => trackPhoneClick("hero_cta")}>
                <ButtonSolid color="white">Call Now</ButtonSolid>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
