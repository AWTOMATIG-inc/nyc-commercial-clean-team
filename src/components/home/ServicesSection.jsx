import glassClean from "@/assets/home/services/clean-man.jpg";
import { services } from "@/constant/home/services";
import Image from "next/image";
import Link from "next/link";
import ButtonSolid from "../ButtonSolid";
import CommonHeading from "../CommonHeading";
import { GreenSignIcon } from "../Icon";
export default function ServicesSection() {
  return (
    <section className="bg-[linear-gradient(114.32deg,#F5FCFF_4.47%,#DBF3FA_25.06%,#B7E9F7_51.47%,#92DFF3_98.36%,#7AD7F0_121.91%)] ">
      <div className="container mt-8 sm:mt-16 py-8 sm:py-16">
        <div className=" grid lg:grid-cols-2 gap-6 xl:gap-32">
          <div className="lg:sticky top-24 h-fit">
            <CommonHeading
              title="Services"
              heading="What We are Offering to Our Potential Client"
              subHeading="Professional commercial cleaning solutions for offices, retail spaces, and facilities throughout the New York City metropolitan area, managed by our dedicated local team."
            />
            <div className="mt-6 bg-white p-2.5 rounded-xl">
              <div className="grid grid-cols-2 gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <GreenSignIcon />
                  <h6 className="sm:text-lg md:text-xl font-medium text-gray-800">
                    Eco Friendly
                  </h6>
                </div>
                <div className="flex items-center gap-2">
                  <GreenSignIcon />
                  <h6 className="sm:text-lg md:text-xl font-medium text-gray-800">
                    Fully Insured
                  </h6>
                </div>
                <div className="flex items-center gap-2">
                  <GreenSignIcon />
                  <h6 className="sm:text-lg md:text-xl font-medium text-gray-800">
                    Fast Response
                  </h6>
                </div>
                <div className="flex items-center gap-2">
                  <GreenSignIcon />
                  <h6 className="sm:text-lg md:text-xl font-medium text-gray-800">
                    Certified Staff
                  </h6>
                </div>
              </div>
              <div className="mt-5">
                <Image
                  height={216}
                  width={553}
                  src={glassClean}
                  alt="Professional office cleaning service with certified staff"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full max-h-54 rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
          <div className="space-y-5 ">
            {services.map((item) => (
              <div
                key={item.id}
                className="bg-white grid grid-cols-2 p-4 rounded-xl relative group"
              >
                <div>
                  <div className="bg-[#FCD9D9] w-fit p-2.5 rounded-xl group-hover:-scale-x-100">
                    <item.icon className="size-11 sm:size-12 md:size-15" />
                  </div>
                  <div>
                    <div className="min-h-56 xs:min-h-54 sm:min-h-48 mt-10">
                      <div className="py-2 rounded-r-xl absolute bg-white w-[85%] z-20">
                        <h5 className="heading-5 font-bold  my-3 before:w-0 hover:before:w-full before:h-px before:absolute before:bg-black before:-bottom-1 before:left-0 before:transition-all before:duration-300  relative w-fit cursor-pointer">
                          {item.heading}
                        </h5>
                        <p className="mb-4 text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base text-justify pr-3">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <Link href={`/services/${item.slug}`}>
                      <ButtonSolid color="white" className="text-nowrap">
                        Learn more
                      </ButtonSolid>
                    </Link>
                  </div>
                </div>
                <div className="h-93.75  rounded-xl overflow-hidden">
                  <Image
                    height={216}
                    width={553}
                    src={item.image}
                    alt={`${item.heading} - Professional commercial cleaning service`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-full rounded-lg object-cover group-hover:scale-110 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
