import cleanerSpy from "@/assets/serviceArea/cleaner-spy.webp";
import Image from "next/image";
import ButtonSolid from "../ButtonSolid";
import CommonHeading from "../CommonHeading";
import { CycleCircleIcon, GridIcon, ThreeDotIcon } from "../Icon";
import LinkWithArrow from "../LinkWithArrow";
const serviceStep = [
  {
    id: 1,
    image: cleanerSpy,
    name: "Recurring",
    title: "Janitorial services gg",
    desc: "Daily cleaning, restocking, and facility maintenance",
  },
  {
    id: 4,
    icon: ThreeDotIcon,
    title: "Office cleaning",
    desc: "Comprehensive cleaning for corporate and professional spaces",
  },
  {
    id: 2,
    icon: CycleCircleIcon,
   
    title: "Day porter services",
    desc: "On-site support during business hours for immediate needs",
  },
  {
    id: 5,
    image: cleanerSpy,
    name: "Specialty",
    title: "Post-construction cleaning",
    desc: "Complete debris removal and final site preparation",
  },
  {
    id: 3,
    image: cleanerSpy,
    name: "Surfaces",
    title: "Floor and carpet care",
    desc: "Stripping, waxing, and deep cleaning for all floor types.",
  },
  
  
  {
    id: 6,
    icon: GridIcon,
    title: "Window cleaning",
    desc: "Professional glass and facade maintenance for high-rises",
  },
];
export default function Available() {
  return (
    <section className="container mt-20">
      <div>
        <CommonHeading
          title="Available"
          heading="Services in these areas"
          subHeading="We deliver the full range of commercial cleaning solutions"
          center={true}
        />
      </div>
      <div className="mt-20 grid lg:grid-cols-3 gap-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {serviceStep.slice(0,2).map((service) => (
          <div
            key={service.id}
            className={`shadow rounded-lg overflow-hidden`}
          >
            {service.image && (
              <div>
                <Image
                  width={394}
                  height={233}
                  src={service.image}
                  alt="service"
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="p-8">
              {service.icon && <service.icon />}

            <p className="font-semibold capitalize ">{service.name}</p>
            <h4 className="heading-4 mt-6 mb-4">{service.title}</h4>
            <p className="mb-6">{service.desc}</p>

            <LinkWithArrow>learn more</LinkWithArrow>
            </div>
          </div>
        ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {serviceStep.slice(2,4).map((service) => (
          <div
            key={service.id}
            className={`shadow rounded-lg overflow-hidden`}
          >
            {service.image && (
              <div>
                <Image
                  width={394}
                  height={233}
                  src={service.image}
                  alt="service"
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="p-8">
              {service.icon && <service.icon />}

            <p className="font-semibold capitalize ">{service.name}</p>
            <h4 className="heading-4 mt-6 mb-4">{service.title}</h4>
            <p className="mb-6">{service.desc}</p>

            <LinkWithArrow>learn more</LinkWithArrow>
            </div>
          </div>
        ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {serviceStep.slice(4,6).map((service) => (
          <div
            key={service.id}
            className={`shadow rounded-lg overflow-hidden`}
          >
            {service.image && (
              <div>
                <Image
                  width={394}
                  height={233}
                  src={service.image}
                  alt="service"
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="p-8">
              {service.icon && <service.icon />}

            <p className="font-semibold capitalize ">{service.name}</p>
            <h4 className="heading-4 mt-6 mb-4">{service.title}</h4>
            <p className="mb-6">{service.desc}</p>

            <LinkWithArrow>learn more</LinkWithArrow>
            </div>
          </div>
        ))}
        </div>
        
      </div>
      <div className="my-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[32px] sm:text-5xl lg:text-[56px] leading-[120%]">
            Ready to upgrade <br /> Your facility deserves better
          </h1>
          <p className="md:text-lg my-6">
            Let NYC Clean Team handle the details while you focus on running
            your business.
          </p>
          <div className="flex gap-8">
            <ButtonSolid>Quote</ButtonSolid>
            <ButtonSolid color="white">Call</ButtonSolid>
          </div>
        </div>
      </div>
    </section>
  );
}
