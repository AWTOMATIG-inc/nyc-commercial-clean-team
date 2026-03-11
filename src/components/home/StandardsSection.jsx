"use client";
import { ourStandards } from "@/constant/home/ourStandarts";
import { useState } from "react";
import ArrowButton from "../ArrowButton";
import CommonHeading from "../CommonHeading";

export default function StandardsSection() {
  const [step, setStep] = useState(0);
  return (
    <section className="bg-[linear-gradient(114.32deg,#F5FCFF_4.47%,#DBF3FA_25.06%,#B7E9F7_51.47%,#92DFF3_98.36%,#7AD7F0_121.91%)]">
      <div className="container py-10 sm:py-12 lg:py-16">
        <div>
          <CommonHeading
            title="Standards"
            heading="How we work"
            center={true}
            subHeading="Every detail matters in commercial cleaning."
          />
        </div>
        <div className="mt-6 sm:mt-10 md:mt-16 lg:mt-20">
          <div className="relative py-10 hidden lg:block">
            <div className="border-t-2 relative border-black">
              <span className="size-3.5 bg-black inline-block absolute top-/2 left-0 -translate-y-1/2 rounded-full"></span>
              <span className="size-3.5 bg-black inline-block absolute top-/2 right-0 -translate-y-1/2 rounded-full"></span>
            </div>
            <div className="flex justify-between lg:px-34 xl:px-44 absolute top-1/2 -translate-y-1/2 left-0 w-full ">
              <button
                onMouseOver={() => setStep(1)}
                onMouseOut={() => setStep(0)}
                className="bg-white h-13 px-8 rounded-full hover:bg-slate hover:text-white"
              >
                Step One
              </button>
              <button
                onMouseOver={() => setStep(2)}
                onMouseOut={() => setStep(0)}
                className="bg-white h-13 px-8 rounded-full hover:bg-slate hover:text-white"
              >
                Step Two
              </button>
              <button
                onMouseOver={() => setStep(3)}
                onMouseOut={() => setStep(0)}
                className="bg-white h-13 px-8 rounded-full hover:bg-slate hover:text-white"
              >
                Step Three
              </button>
            </div>
          </div>
          <div className="lg:mt-28 border border-white rounded-xl p-5 lg:pt-20 lg:pb-30 lg:px-10 relative ">
            <div className="grid lg:grid-cols-3 gap-8">
              {ourStandards.map((item) => (
                <div key={item.id}>
                  <div className="lg:max-w-79.5 mx-auto lg:text-center">
                    <div className="flex justify-between items-center">
                    <div
                      className={` p-2 md:p-3 w-fit lg:mx-auto rounded-xl border ${step === item.id ? "bg-gray-400 border-black" : "bg-skyblue-light  border-skyblue-light"}`}
                    >
                      <item.Icon className="size-8"/>
                    </div>
                    <button
                      onMouseOver={() => setStep(item.id)}
                      onMouseOut={() => setStep(0)}
                      className="text-sm md:text-base lg:hidden bg-white h-8 md:h-13 px-5 md:px-8 rounded-full hover:bg-slate hover:text-white"
                    >
                      Step Three
                    </button>
                    </div>
                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold mt-4.5 mb-2">{item.title}</h5>
                    <p className="text-sm md:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden max-w-260 w-full  bg-white rounded-full lg:flex justify-between items-center p-1.5 absolute -bottom-8 left-1/2 -translate-x-1/2">
              <h6 className="heading-6 text-center w-full flex-1">
                Elevate Your Space with Professional Cleaning
              </h6>
              <ArrowButton>Discover More</ArrowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
