import manhattan from "@/assets/serviceArea/1.png";
import brooklyn from "@/assets/serviceArea/2.png";
import queens from "@/assets/serviceArea/3.png";
import bronx from "@/assets/serviceArea/4.png";
import statenIsland from "@/assets/serviceArea/5.png";
import Image from "next/image";
import ButtonSolid from "../ButtonSolid";
import CommonHeading from "../CommonHeading";
const coverageStep = [
  {
    id: 1,
    image: statenIsland,
    name: "one",
    title: "Long Island",
    desc: "Office parks, retail centers, medical facilities, and commercial properties across Nassau and Suffolk Counties — available for recurring and one-time contracts.",
  },
  {
    id: 2,
    image: bronx,
    name: "two",
    title: "Bronx",
    desc: "Commercial cleaning for offices, schools, retail spaces, and facilities throughout the Bronx — scheduled around your business hours.",
  },
  {
    id: 3,
    image: queens,
    name: "three",
    title: "Queens",
    desc: "Medical facilities, logistics warehouses, restaurants, and multi-tenant commercial buildings across Long Island City, Flushing, Jamaica, and beyond.",
  },
  {
    id: 4,
    image: brooklyn,
    name: "four",
    title: "Brooklyn",
    desc: "From DUMBO creative offices to Williamsburg retail to industrial facilities in Sunset Park — professional commercial cleaning across every Brooklyn neighborhood.",
  },
  {
    id: 5,
    image: manhattan,
    name: "Five",
    title: "Manhattan",
    desc: "Office towers, corporate headquarters, law firms, medical practices, and retail — Midtown, Downtown, and everywhere in between.",
  },
];
export default function Coverage() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div>
        <CommonHeading
          title="Where We Work"
          heading="Local Teams Across All Five Boroughs"
          subHeading="NYC Clean Team brings 25+ years of expertise to every facility we service across New York City."
          center={true}
        />
      </div>
      {/* this for dynamic handling height  */}
      {/* style={{height:coverageStep.length*810+"px"}} */}
      <div  className="h-920 sm:h-1160 relative mt-8 sm:mt-16">
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
            className="absolute left-6 sm:left-12  md:w-1/2 sm:h-232 bg-white max-w-xl flex flex-col justify-between rounded-md shadow overflow-hidden md:odd:right-[53%] md:even:left-[53%] "
          >
            <div className="p-8">
              <h4 className="heading-4 capitalize">{step.name}</h4>
              <h4 className="heading-4 font-bold mt-6 mb-8">{step.title}</h4>
              <p className="mb-8">{step.desc}</p>
              <ButtonSolid minWidth="sm:w-28"  >Next</ButtonSolid>
            </div>
            <div>
              <Image src={step.image} alt="image" height={576} width={576} className="w-full h-full max-h-144 object-cover rounded-[20px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
