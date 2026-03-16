import cleanerTool from "@/assets/serviceArea/cleaner-tool.webp";
import Image from "next/image";
import ButtonSolid from "../ButtonSolid";
import CommonHeading from "../CommonHeading";
const coverageStep = [
  {
    id: 1,
    image: cleanerTool,
    name: "one",
    title: "Long Island",
    desc: "We walk your facility and assess square footage, surface types, traffic patterns, and current conditions. This informs everything that follows.",
  },
  {
    id: 2,
    image: cleanerTool,
    name: "two",
    title: "Long Island",
    desc: "We walk your facility and assess square footage, surface types, traffic patterns, and current conditions. This informs everything that follows.",
  },
  {
    id: 3,
    image: cleanerTool,
    name: "three",
    title: "Long Island",
    desc: "We walk your facility and assess square footage, surface types, traffic patterns, and current conditions. This informs everything that follows.",
  },
  {
    id: 4,
    image: cleanerTool,
    name: "four",
    title: "Long Island",
    desc: "We walk your facility and assess square footage, surface types, traffic patterns, and current conditions. This informs everything that follows.",
  },
];
export default function Coverage() {
  return (
    <section className="container mt-16">
      <div>
        <CommonHeading
          title="Coverage"
          heading="We serve all five boroughs"
          subHeading="NYC Clean Team brings 25+ years of expertise to every facility we service across New York City."
          center={true}
        />
      </div>
      <div style={{height:coverageStep.length*810+"px"}} className="relative mt-20">
        {Array.from({ length: coverageStep.length }).map((_, id) => (
          <div
            style={{
              top: (100 / coverageStep.length) * Number(id) + 1.5 + "%",
            }}
            key={id}
            className=" bg-white size-8 absolute  md:left-1/2 -translate-x-1/2 rounded-full z-10 flex justify-center items-center"
          >
            <span className=" bg-red size-4 rounded-full "></span>
          </div>
        ))}
        <div  className="h-full w-0.75 bg-black absolute  md:left-1/2 top-0 -translate-x-1/2"></div>
        {coverageStep.map((step,id) => (
          <div
            key={step.id}
            style={{
              top: (100 / coverageStep.length) * Number(id) +1 + "%",
            }}
            className="absolute left-6 sm:left-12  md:w-1/2 h-190 bg-white max-w-xl flex flex-col justify-between rounded-md shadow overflow-hidden md:odd:right-[53%] md:even:left-[53%] "
          >
            <div className="p-8">
              <h4 className="heading-4 capitalize">{step.name}</h4>
              <h4 className="heading-4 font-bold mt-6 mb-8">{step.title}</h4>
              <p className="mb-8">{step.desc}</p>
              <ButtonSolid size="small">Next</ButtonSolid>
            </div>
            <div>
              <Image src={step.image} alt="image" height={576} width={576} className="w-full h-full max-h-144" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
