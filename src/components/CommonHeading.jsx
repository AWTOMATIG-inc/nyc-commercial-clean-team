"use client"
export default function CommonHeading({title,heading,subHeading,center,className}) {
  return (
    <div className={`${center?"text-center max-w-3xl mx-auto":"text-justify max-w-3xl mx-auto md:mx-0"} ${className}`}>
      <p className={`font-semibold text-red border px-4.5 py-1 w-fit rounded-full ${center?"text-center max-w-3xl mx-auto":"mx-auto md:mx-0 w-fit"}`}>
        {title}
      </p>
      <h2 className="text-[22px] lg:text-5xl leading-[120%] py-4 pb-6">{heading}</h2>
      <p className="text-sm sm:text-base md:text-lg">
        {subHeading}
      </p>
    </div>
  );
}
