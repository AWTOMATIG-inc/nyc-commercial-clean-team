"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  altBefore = "Before",
  altAfter = "After",
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback(
    (clientX) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newPosition = ((clientX - rect.left) / rect.width) * 100;

      newPosition = Math.max(0, Math.min(100, newPosition));

      setSliderPosition(newPosition);
    },
    [isDragging]
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => handleMove(e.clientX);

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-[20px] shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <span className="absolute top-5 left-4 z-10 rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white uppercase">
        before
      </span>
      <span className="absolute top-5 right-4 z-10 rounded-full bg-red px-4 py-1.5 text-xs font-bold text-white uppercase">
        after
      </span>

      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={altAfter}
          className="h-full w-full object-cover object-left"
          draggable="false"
        />
      </div>

      <img
        src={beforeImage}
        alt={altBefore}
        className="block h-full w-full object-cover object-left"
        draggable="false"
      />

      <div
        className="absolute top-0 bottom-0 flex w-1.5 cursor-ew-resize items-center justify-center bg-white/80"
        style={{ left: `calc(${sliderPosition}% - 0.375rem)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 ease-in-out ${
            isDragging ? "scale-110 shadow-xl" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate"
          >
            <line x1="15" y1="18" x2="9" y2="12"></line>
            <line x1="9" y1="6" x2="15" y2="12"></line>
          </svg>
        </div>
      </div>
    </div>
  );
}
