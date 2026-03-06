"use client"
import { clientVoices } from "@/constant/home/client_voices";
import Image from "next/image";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeading from "../CommonHeading";
import LinkWithArrow from "../LinkWithArrow";
export default function ClientVoices() {
  return (
    <section className="container mt-16">
      <div>
        <CommonHeading
          title="Client Voices"
          heading="What our clients say"
          subHeading="From Manhattan to Long Island, we're your local cleaning partner."
        />
      </div>
      <div className="mt-16">
        <Swiper
               spaceBetween={50}
              slidesPerView={3}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 60,
                },
                1280: {
                  spaceBetween: 50,
                  slidesPerView: 3,
                },
              }}
              loop={true}
              autoHeight={true}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              // onSlideChange={() => console.log("slide change")}
              // onSwiper={(swiper) => console.log(swiper)}
              modules={[Autoplay]}
              
              
            >
        {clientVoices.map((item) => (
          <SwiperSlide  style={{ height: "100%" }} key={item.id} className="shadow-custom border border-gray-300  p-10 rounded-xl overflow-hidden ">
          <div >
            <div>
              <item.icon/>
            </div>
            <p className="mt-12 mb-6 md:text-lg">{item.review}</p>
            <div className="flex items-center gap-3  mb-8">
              <Image width={50} height={50} src={item.user.avatar} alt="user" className="size-10 rounded-full"/>
              <div>
                <h5 className="font-bold">{item.user.name}</h5>
                <p>{item.user.prof}</p>
              </div>
            </div>
            <LinkWithArrow className="font-normal flex gap-2">View case study</LinkWithArrow>
          </div>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
    </section>
  );
}
