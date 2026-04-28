"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

export default function Counter({ value,className="text-slate text-[28px] md:text-[64px] font-bold pt-2",sign="" }) {
  const ref = useRef(null);
  const [start, setStart] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <h1
      ref={ref}
      className={className}
    >
      {start ? <CountUp end={value} duration={2} /> : value}<span>{sign}</span>
    </h1>
  );
}