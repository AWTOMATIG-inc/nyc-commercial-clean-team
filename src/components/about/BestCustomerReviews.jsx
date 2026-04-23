"use client";
import femaleAvatar from "@/assets/about/female-avatar.png";
import maleAvatar from "@/assets/about/male-avatar.png";
import glassClean from "@/assets/home/services/glass-clean.webp";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeading from "../CommonHeading";
import Counter from "../Counter";
const reviews = [
  
  {
    id: 2,
    name: "Priya Mehta",
    location: "Brooklyn",
    rating: 5,
    comment:
      "Our retail space sees heavy foot traffic. NYC Clean Team keeps it in excellent shape without us having to follow up. They handle it.",
    image: femaleAvatar,
  },
  {
    id: 1,
    name: "David Park",
    location: "Manhattan",
    rating: 5,
    comment:
      "They've been cleaning our office building for over two years. The standard has never dropped — same team, same results, every week. That consistency is rare.",
    image: maleAvatar,
    
  },
  {
    id: 3,
    name: "Angela Torres",
    location: "Queens",
    rating: 5,
    comment:
      "Compliance matters in a medical setting. They understand that and execute accordingly. No reminders needed, no corners cut.",
    image: femaleAvatar,
  },
];
const steps = [
  {
    id: 1,
    score: 500,
    sign:"+",
    title: "Facilities\nServiced",
    image: glassClean,
  },
  {
    id: 2,
    score: 5,
    sign:"",
    title: "NYC\nBoroughs Covered",
    image: glassClean,
  },
  {
    id: 3,
    score: 98,
    sign:"%",
    title: "Client\nRetention Rate",
    image: glassClean,
  },
  {
    id: 4,
    score: 200,
    sign:"+",
    title: "Happy\nCustomers",
    image: glassClean,
  },
];
export default function BestCustomerReviews() {
  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);
  return (
    <section className="container my-8 sm:my-16 py-8 sm:py-16 sm:px-14 md:px-20 bg-[linear-gradient(149.48deg,#212222_-21.76%,#92DFF3_29.38%,#7AD7F0_100.94%)]  rounded-xl">
      <CommonHeading
        center={true}
        title="Client Reviews"
        heading="The Best Customers Says About Our Action
        "
        subHeading="Installations and repairs completed successfully."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 border rounded-xl p-5 gap-8 sm:gap-10 my-8 sm:my-16">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {reviews.map((review, i) => (
            <div  onClick={()=> swiperRef.current.slideTo(i)} key={review.id} className=" rounded-xl relative bg-white h-71.25">
              <Image
                src={review.image}
                alt={review.name}
                className="object-cover rounded-xl absolute top-1/2 left-1/2 -translate-1/2 "
              />
              {active === i && <div className="absolute top-0 left-0 w-full h-full bg-red-500/20  rounded-xl"><span className="flex flex-col justify-end items-center h-full pb-4 text-red-500"><Icon icon="gg:quote" width="48" height="48" /></span></div>}
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
                    <div className="flex text-red relative -left-1">
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
          <Counter value={item.score} sign={item.sign} className="text-4xl sm:text-4xl lg:text-5xl xl:text-7xl whitespace-pre-wrap"/>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
