import Marquee from "react-fast-marquee";

export default function MarqueHighlightText({ marqueeText }) {
  const textArray = Array.isArray(marqueeText) ? marqueeText : [marqueeText];
  return (
    <div className="mt-16">
      <Marquee speed={50} gradient={false} autoFill={true}>
        {textArray.map((text,id) => (
          <p key={id} className="text-3xl sm:text-5xl md:text-[54px] text-center overflow-hidden py-4">
            {text}
          </p>
        ))}
      </Marquee>
    </div>
  );
}
