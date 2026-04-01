"use client";
import glassClean from "@/assets/home/services/glass-clean.webp";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeading from "../CommonHeading";
import { QoateIcon } from "../Icon";
const reviews = [
  {
    id: 1,
    name: "John Doe",
    location: "New York",
    rating: 5,
    comment:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a moreIt is a reader will be distracted by the readable",
    image: glassClean,
  },
  {
    id: 2,
    name: "John Doe",
    location: "New York",
    rating: 5,
    comment:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a moreIt is a reader will be distracted by the readable",
    image: glassClean,
  },
  {
    id: 3,
    name: "John Doe",
    location: "New York",
    rating: 5,
    comment:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a moreIt is a reader will be distracted by the readable",
    image: glassClean,
  },
];
const steps = [
  {
    id: 1,
    score: "5000+",
    title: "location",
    image: glassClean,
  },
  {
    id: 2,
    score: "1000+",
    title: "location",
    image: glassClean,
  },
  {
    id: 3,
    score: "98%",
    title: "location",
    image: glassClean,
  },
  {
    id: 4,
    score: "35+",
    title: "location",
    image: glassClean,
  },
];
export default function BestCustomerReviews() {
  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);
  return (
    <section className="container my-16 bg-[linear-gradient(149.48deg,#212222_-21.76%,#92DFF3_29.38%,#7AD7F0_100.94%)] py-14 md:py-20 sm:px-14 md:px-20 rounded-xl">
      <CommonHeading
        center={true}
        title="Client Reviews"
        heading="The Best Customers Says About Our Action
        "
        subHeading="Installations and repairs completed successfully."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 border rounded-xl p-5 gap-10 my-10">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {reviews.map((review, i) => (
            <div  onClick={()=> swiperRef.current.slideTo(i)} key={review.id} className=" rounded-xl relative">
              <Image
                src={review.image}
                alt={review.name}
                className="w-full min-h-50 sm:min-h-71.25 h-full object-cover rounded-xl"
              />
              {active === i && <div className="absolute top-0 left-0 w-full h-full bg-[#92DFF3]/40  rounded-xl"><span className="flex flex-col justify-end items-center h-full pb-4"><QoateIcon /></span></div>}
            </div>
          ))}
        </div>
        <div>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActive(swiper.realIndex)}
          >
            {reviews.map((review, id) => (
              <SwiperSlide key={id}>
                <div>
                  <div>
                    <div className="flex text-red">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Icon
                          key={index}
                          icon="material-symbols-light:star"
                          width="24"
                          height="24"
                        />
                      ))}
                    </div>
                    <span>Rated {review.rating}.0</span>
                  </div>
                  <p className="my-4">{review.comment}</p>
                  <hr className="my-3" />
                  <div>
                    <h4>{review.name}</h4>
                    <p>{review.location}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
         
        </div>
      </div>
      <div className="border grid grid-cols-2 md:grid-cols-4">
        {steps.map((item, id) => (
          <div
            key={item.id}
            className={` flex-col items-center justify-center text-center p-10 ${steps.length - 1 === id ? "" : " border-r border-b md:border-b-0"}`}
          >
            <h1 className="text-4xl sm:text-4xl lg:text-5xl xl:text-7xl">
              {item.score}
            </h1>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
