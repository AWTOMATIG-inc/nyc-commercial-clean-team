"use client";

import { speciality } from "@/constant/services/specialty";
import { Icon } from "@iconify/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeading from "../CommonHeading";
import ServicesBlogCard from "../ServicesBlogCard";

export default function SpecialitySection() {
  return (
    <section className="container mt-20">
      <CommonHeading
        center={true}
        title="Specialty"
        heading="Specialized work when it matters"
        subHeading="Demanding projects handled with expertise and precision"
      />
      <div className="mt-21 relative flex gap-1">
        <div className="bg-[#DDE0E8] flex justify-center items-center rounded-sm px-2 sm:hidden">
          <button className="prev-btn z-20 hover:text-red">
            <Icon icon="line-md:arrow-right" width="24" height="24" className="rotate-180"/>
          </button>
        </div>

        <Swiper
          slidesPerView={3}
          spaceBetween={50}
          loop={true}
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
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
        >
          {speciality.map((item, id) => (
            <SwiperSlide key={id}>
              <ServicesBlogCard key={item.id} blog={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="bg-[#DDE0E8] flex justify-center items-center rounded-sm px-2 sm:hidden">
          <button className="next-btn  z-20 hover:text-red">
            <Icon icon="line-md:arrow-right" width="24" height="24" />
          </button>
        </div>
      </div>
    </section>
  );
}
