"use client";
import { recurrings } from "@/constant/services/recurring";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../app/swiper-custom.css";
import CommonHeading from "../CommonHeading";
import ServicesBlogCard from "../ServicesBlogCard";
export default function RecurringSection() {
  return (
    <section className="container mt-20">
      <CommonHeading
        center={true}
        title="Recurring"
        heading="Daily cleaning that works"
        subHeading="Scheduled, consistent janitorial and office cleaning — so your facility is always ready."
      />
      <div className="mt-16">
        <Swiper
        slidesPerView={3}
        spaceBetween={50}
        loop={true}
        modules={[Navigation, Pagination,Autoplay]}
        
        pagination={{
            el: ".custom-pagination-recurring",
            clickable: true,
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
        {recurrings.map((item, id) => (
          <SwiperSlide key={id}>
            <ServicesBlogCard key={item.id} blog={item} />
          </SwiperSlide>
        ))}
      </Swiper>
       {/* Pagination OUTSIDE slider */}
        <div className="custom-pagination-recurring flex justify-center mt-6 "></div>
      </div>
      
     
    </section>
  );
}
