"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import CommonHeading from "../CommonHeading";

export default function PartnershipSection() {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const contentRef = useRef([]);

  const sliderItems = [
    {
      id: 1,
      image: "/images/partnership/caution-wet-floor.webp",
      title: "Plans Built Around Your Facility",
      desc: "Every space is different. We assess your facility, traffic patterns, and schedule before building a cleaning plan — then we stick to it.",
    },
    {
      id: 2,
      image: "/images/partnership/businesspeople-standing-city-street-shaking-hands.webp",
      title: "The Same Crew, Every Visit",
      desc: "Our staff are background-checked, uniformed, and trained in commercial protocols. You'll see the same faces — not a new team every week.",
    },
    {
      id: 3,
      image: "/images/partnership/discussing-business-chart.webp",
      title: "Consistent Quality, Verified",
      desc: "We use standardized checklists and supervisory checks on every visit. The first service and the twentieth meet the same standard.",
    },
    {
      id: 4,
      image: "/images/partnership/red-stream.webp",
      title: "Quality inspections",
      desc: "Regular audits ensure standards are met consistently across every visit.",
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

    // The pin's start/end scroll offsets are cached at creation time. If layout
    // above this section shifts afterward (webfont swap reflow, sibling
    // next/dynamic sections settling, async icons/images), those offsets go
    // stale and GSAP pins at the wrong scroll position — causing this section
    // to visually overlap the one above it. Re-sync whenever the page height
    // changes.
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    let resizeTimeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="container mt-8 sm:mt-16">
      <div className="grid md:grid-cols-2 md:gap-12">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-between  md:pt-14 pb-16 md:pb-14">
          <CommonHeading title="Partnership" subHeading="We earn long-term contracts by solving the three problems commercial clients complain about most." heading="Why New York Commercial Clean Team stands apart"/>
         

          <div className="text-center md:text-left relative min-h-14 md:min-h-30 mt-6 sm:mt-8 mb-10">
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
              alt={`Partnership benefit ${i + 1}: ${item.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
              className="absolute inset-0 object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
