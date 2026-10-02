"use client";
import { trackCtaClick, trackPhoneClick } from "@/lib/gtm";
import Link from "next/link";
import ButtonSolid from "../ButtonSolid";
export default function HeroSection() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div className="relative overflow-hidden">
        {/* ORIGINAL VIDEO - commented out, do not delete
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
        */}
        <video
          poster="/images/videoplaceholder.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="rounded-[20px] w-full object-cover absolute inset-0 h-full sm:static"
        >
          <source
            src="https://pub-15cceab11b2f454f828f50cb4ba7a3c5.r2.dev/output.webm"
            type="video/webm"
          />
          <source
            src="https://pub-15cceab11b2f454f828f50cb4ba7a3c5.r2.dev/output-compressed.mp4"
            type="video/mp4"
          />
        </video>

        {/* <Image
          src={cleaningNyc}
          alt="cleaningNyc"
          className="rounded-lg w-full h-100 sm:h-auto object-cover max-h-100 sm:max-h-100 md:max-h-208.5"
        /> */}
        <div className="w-full bg-black/10 backdrop-blur-[2px] sm:backdrop-blur-[4px] relative sm:absolute sm:top-0 sm:left-0 sm:h-full rounded-[20px]">
          <div className="text-white flex flex-col items-center justify-center text-center h-full min-h-100 xs:min-h-85 sm:min-h-0 py-10 sm:py-0 px-2 sm:px-4">
            <h1 className="text-[28px] sm:text-5xl lg:text-[56px] leading-[120%] ">
              Commercial Cleaning & Facility <br className="hidden sm:inline" /> Maintenance for NYC Properties
            </h1>
            <p className="md:text-lg my-6 md:my-9 max-w-250">
              Reliable janitorial, porter, floor care, window cleaning and
              specialty maintenance services for offices, retail, medical
              facilities, schools, fitness facilities and commercial
              properties throughout NYC.
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
