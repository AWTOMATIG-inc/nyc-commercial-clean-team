"use client"
import { ourStandards } from "@/constant/home/ourStandarts";
import { useState } from "react";
import ArrowButton from "../ArrowButton";
import CommonHeading from "../CommonHeading";

export default function StandardsSection() {
  const [step, setStep] = useState(0)
  return (
    <section className="bg-[linear-gradient(114.32deg,#F5FCFF_4.47%,#DBF3FA_25.06%,#B7E9F7_51.47%,#92DFF3_98.36%,#7AD7F0_121.91%)]">
      <div className="container py-16">
        <div>
          <CommonHeading
            title="Standards"
            heading="How we work"
            subHeading="Every detail matters in commercial cleaning."
          />
        </div>
        <div className="mt-20">
          <div className="relative py-10">
            <div className="border-t-2 relative border-black">
              <span className="size-3.5 bg-black inline-block absolute top-/2 left-0 -translate-y-1/2 rounded-full"></span>
              <span className="size-3.5 bg-black inline-block absolute top-/2 right-0 -translate-y-1/2 rounded-full"></span>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-evenly">
              <button onMouseOver={()=>setStep(1)} onMouseOut={()=>setStep(0)} className="bg-white h-13 px-8 rounded-full hover:bg-slate hover:text-white">
                Step One
              </button>
              <button onMouseOver={()=>setStep(2)} onMouseOut={()=>setStep(0)} className="bg-white h-13 px-8 rounded-full hover:bg-slate hover:text-white">
                Step Two
              </button>
              <button onMouseOver={()=>setStep(3)} onMouseOut={()=>setStep(0)} className="bg-white h-13 px-8 rounded-full hover:bg-slate hover:text-white">
                Step Three
              </button>
            </div>
          </div>
          <div className="mt-28 border border-white rounded-xl pt-20 pb-30 px-10 relative ">
            <div className="grid grid-cols-3 gap-8">
              {ourStandards.map((item) => (
                <div key={item.id}>
                  <div className="max-w-79.5 mx-auto">
                    <div className={` p-3 w-fit mx-auto rounded-xl border ${step===item.id?"bg-gray-400 border-black":"bg-skyblue-light  border-skyblue-light"}`}>
                      <item.Icon />
                    </div>

                    <h5 className="heading-5-bold mt-4.5 mb-2">{item.title}</h5>
                    <p className="">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-260 w-full  bg-white rounded-full flex items-center p-1.5 absolute -bottom-8 left-1/2 -translate-x-1/2">
              <input
                className="w-full h-full focus:outline-none px-4 flex-1"
                placeholder="Elevate Your Space with Professional Cleaning"
              />
              <ArrowButton>Discover More</ArrowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
