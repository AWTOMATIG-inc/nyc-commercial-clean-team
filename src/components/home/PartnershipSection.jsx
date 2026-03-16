"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function PartnershipSection() {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const contentRef = useRef([]);

  const sliderItems = [
    {
      id: 1,
      image: "/images/partnership/cleaning-discussion.webp",
      title: "Customized plans",
      desc: "Background-checked staff trained in commercial cleaning best practices and safety protocols.",
    },
    {
      id: 2,
      image: "/images/partnership/coverage-1.jpg",
      title: "Reliable coverage",
      desc: "Our teams are equipped with industry-grade tools and modern cleaning solutions.",
    },
    {
      id: 3,
      image: "/images/partnership/coverage-2.jpg",
      title: "Consistent results",
      desc: "Quality assurance and inspections ensure every space stays spotless.",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=2000",
          scrub: true,
          pin: true,
        },
      });

      // initial state
      imagesRef.current.forEach((img, i) => {
        if (i !== 0) gsap.set(img, { yPercent: 100 });
      });

      contentRef.current.forEach((content, i) => {
        if (i !== 0) gsap.set(content, { autoAlpha: 0 });
      });

      sliderItems.forEach((_, i) => {
        if (i === 0) return;

        tl.to(imagesRef.current[i], {
          yPercent: 0,
          duration: 1,
          ease: "none",
        });

        tl.to(
          contentRef.current[i - 1],
          {
            autoAlpha: 0,
            duration: 0.3,
          },
          "<",
        );

        tl.to(
          contentRef.current[i],
          {
            autoAlpha: 1,
            duration: 0.3,
          },
          "<",
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container mt-20">
      <div className="grid md:grid-cols-2 md:gap-12">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-between py-14">
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold">
              Why NYC Clean Team stands apart
            </h2>
            <p>
              We build lasting relationships with our clients through
              accountability and results.
            </p>
          </div>

          <div className="relative min-h-15 md:min-h-30 mt-8">
            {sliderItems.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => (contentRef.current[i] = el)}
                className="absolute inset-0"
              >
                <h5 className="text-xl font-semibold">{item.title}</h5>
                <p className="mt-4 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IMAGE STACK */}
        <div className="relative h-100 md:h-188 overflow-hidden rounded-xl">
          {sliderItems.map((item, i) => (
            <Image
              key={item.id}
              ref={(el) => (imagesRef.current[i] = el)}
              src={item.image}
              alt="partnership"
              fill
              priority={i === 0}
              className="absolute inset-0 object-cover"
            />
          ))}
        </div>
       
      </div>
    </section>
  );
}
