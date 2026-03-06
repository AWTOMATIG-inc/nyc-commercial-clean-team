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
    <section className="container my-16">
      <div className="grid lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col justify-between">
        <div>
          <CommonHeading
            title="FAQS"
            heading="Answers to Your Most Common Queries!"
            subHeading="Answers to Your Most Common Queries!"
          />
        </div>
        <Image width={487} height={320} src={faqImage} alt="faq" className="max-h-80 object-cover rounded-2xl" />
      </div>
      <div className="mt-8">
        {faq_questions.map((faq) => (
          <div key={faq.id} className="border-t">
            <div onClick={()=>setOpenFaq(faq.id)} className="flex items-center justify-between cursor-pointer">
              <h6 className="heading-6 py-8">{faq.ques}</h6>
              <Icon icon="material-symbols:play-arrow-rounded" width="24" height="24" className={` ${openFaq===faq.id?"rotate-90 text-red":""}`} />
            </div>
            {openFaq===faq.id&&<p className="bg-slate text-white px-6 py-3 rounded-xl mb-4">{faq.answer}</p>}
            
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
