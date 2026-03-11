"use client"
import faqImage from "@/assets/home/faq.webp";
import { faq_questions } from "@/constant/home/faq_questions";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";
import CommonHeading from "../CommonHeading";
export default function FAQs() {
  const [openFaq, setOpenFaq] = useState(1)
  return (
    <section className="container mt-8 md:mt-12 lg:mt-16 mb-16">
      <div className="grid md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1fr_1.3fr] gap-10">
        <div className="flex flex-col lg:justify-between">
        <div>
          <CommonHeading
            title="FAQS"
            heading="Answers to Your Most Common Queries!"
            subHeading="Answers to Your Most Common Queries!"
          />
        </div>
        <Image width={487} height={320} src={faqImage} alt="faq" className="hidden md:block max-h-55 md:max-h-80 object-cover rounded-2xl mt-8" />
      </div>
      <div className="mt-8">
        {faq_questions.map((faq) => (
          <div key={faq.id} className="border-t">
            <div onClick={()=>setOpenFaq(faq.id)} className="flex items-center justify-between cursor-pointer">
              <h6 className="text-lg lg:text-xl py-5 sm:py-6 md:py-8 leading-[140%]">{faq.ques}</h6>
              <Icon icon="material-symbols:play-arrow-rounded" width="24" height="24" className={` ${openFaq===faq.id?"rotate-90 text-red":""}`} />
            </div>
            {<p className={`bg-slate text-sm sm:text-base md:text-lg text-white px-6  rounded-xl transition-transform duration-300 origin-top  ${openFaq===faq.id?"scale-y-100 h-full py-3 mb-4 opacity-100":"scale-y-0 h-0 py-0 mb-0 opacity-0"}`}>{faq.answer}</p>}
            
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
