import janitorial from "@/assets/services/support/janitorial.webp";
import { Icon } from "@iconify/react";
import Image from "next/image";
import ArrowButton from "../ArrowButton";
import CommonHeading from "../CommonHeading";
export default function ExpertiseSection() {
  return (
    <section className="container mt-16">
      <div className="">
         <CommonHeading
            title="Who We Are"
            heading="Commercial Cleaning Built on Accountability"
            subHeading="We serve offices, retail spaces, medical facilities, and commercial properties across New York City."
          />
      </div>
      
      <div className="grid lg:grid-cols-[1.2fr_1fr] items-start gap-8 mt-8">
        <div>         
          <div className="relative">
            <Image
              src={janitorial}
              alt="floor"
              width={668}
              height={415}
              className="rounded-t-xl rounded-br-xl w-full max-h-[415px]"
            />
            <div className="absolute bottom-0 left-0 bg-white px-4 pt-6 flex flex-col-reverse sm:flex-row items-center gap-4 mt-6 rounded-tr-4xl">
              <ArrowButton >Discover More</ArrowButton>
              <div className="flex items-center gap-4">
                <h5 className="text-4xl">4.8</h5>
                <div>
                  <div className="flex text-red">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon
                        key={index}
                        icon="material-symbols-light:star"
                        width="24"
                        height="24"
                        className="size-4 md:size-5 lg:size-6"
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm md:text-base">base on user reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 justify-between">
          <div className="sm:h-104 shadow-sm rounded-xl">
            <div className="h-47.75 rounded-xl flex flex-col items-center justify-center bg-[linear-gradient(114.32deg,#F5FCFF_4.47%,#DBF3FA_25.06%,#B7E9F7_51.47%,#92DFF3_98.36%,#7AD7F0_121.91%)]">
              <h1 className="heading-1 font-bold">98%</h1>
             <span
                className="w-[80%] my-1 mx-auto bg-black rounded-full border border-transparent [border-image:linear-gradient(90deg,#FFFFFF_-4.54%,rgba(23,38,80,0.46)_46.64%,#FFFFFF_108.06%)_1]"
              ></span>
              <p className="font-medium lg:text-lg">Client retention rate</p>
            </div>
            <div className="h-[191px] flex flex-col items-center justify-center">
              <p className="font-medium lg:text-lg text-center">Years of Work Experience</p>
              <h1 className="text-6xl md:text-7xl lg:text-[96px] font-bold text-red">15</h1>
            </div>
          </div>
          <div className="sm:h-104 shadow-sm rounded-xl">
            <div className="h-47.75 rounded-xl flex flex-col items-center justify-center bg-[linear-gradient(114.32deg,#F5FCFF_4.47%,#DBF3FA_25.06%,#B7E9F7_51.47%,#92DFF3_98.36%,#7AD7F0_121.91%)]">
              <h1 className="heading-1 font-bold">100%</h1>
             <span
                className="w-[80%] my-1 mx-auto bg-black rounded-full border border-transparent [border-image:linear-gradient(90deg,#FFFFFF_-4.54%,rgba(23,38,80,0.46)_46.64%,#FFFFFF_108.06%)_1]"
              ></span>
              <p className="font-medium lg:text-lg">Insured & Background-Checked</p>
            </div>
            <div className="h-[191px] flex flex-col items-center justify-center">
              <p className="font-medium lg:text-lg text-center"> Boroughs Served</p>
              <h1 className="text-6xl md:text-7xl lg:text-[96px] font-bold text-red">5</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
