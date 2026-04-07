"use client";
import { coverage } from "@/constant/home/coverage";
import Image from "next/image";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../app/swiper-custom.css";
import CommonHeading from "../CommonHeading";
export default function CoverageSection() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div>
        <CommonHeading
          title="Coverage"
          heading="We serve all five boroughs"
          subHeading="Manhattan, Brooklyn, Queens, the Bronx, and Staten Island — plus Long Island and surrounding areas."
        />
      </div>
      <div className="mt-8 sm:mt-16">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slideToClickedSlide={true}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 25,
            },

            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 500,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="custom-swiper"
        >
          {coverage.map((item, id) => (
            <SwiperSlide key={id} className="">
              <Image
                width={500}
                height={400}
                className="h-100 object-fill rounded-2xl"
                src={item}
                alt="slider"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Pagination OUTSIDE slider */}
        <div className="custom-pagination flex justify-center mt-6"></div>
      </div>
    </section>
  );
}
