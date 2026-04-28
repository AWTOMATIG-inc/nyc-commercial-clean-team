"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonSolid from "../ButtonSolid";
export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="container mt-8 sm:mt-16">
      <div className="relative overflow-hidden">
        {isMobile ? (
          <Image
            src="/images/videoplaceholder.webp"
            alt="Commercial cleaning services in NYC - professional office and facility cleaning"
            className="rounded-[20px] w-full object-cover h-100 xs:h-85 sm:h-full"
            fetchPriority="high"
            loading="eager"
            width={500}
            height={400}
          />
        ) : (
          <video
            poster="/images/videoplaceholder.webp"
            autoPlay
            muted
            loop
            playsInline
            className="rounded-[20px] w-full object-cover h-100 xs:h-85 sm:h-full"
          >
            <source src="/videos/city-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {/* <Image
          src={cleaningNyc}
          alt="cleaningNyc"
          className="rounded-lg w-full h-100 sm:h-auto object-cover max-h-100 sm:max-h-100 md:max-h-208.5"
        /> */}
        <div className="w-full h-full bg-black/20 backdrop-blur-xs  absolute top-0 left-0   rounded-[20px]">
          <div className="text-white flex flex-col items-center justify-center text-center h-full px-2 sm:px-4">
            <h1 className="text-[32px] sm:text-5xl lg:text-[56px] leading-[120%] ">
              Commercial cleaning <br /> services in NYC
            </h1>
            <p className="md:text-lg my-6 md:my-9">
              Reliable. Insured. Professional. We handle the work so you can
              focus on what matters.
            </p>
            <div className="flex flex-col-reverse xs:flex-row gap-4  items-center xs:gap-5 sm:gap-8">
              <Link href="/contact">
                <ButtonSolid>Get a Free Quote</ButtonSolid>
              </Link>
             
              <a href="tel:+1 (631) 381-7252">
                <ButtonSolid color="white">Call Now</ButtonSolid>
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
