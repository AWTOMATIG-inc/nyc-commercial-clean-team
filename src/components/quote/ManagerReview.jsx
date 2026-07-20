"use client";
import { timeAgo } from "@/utility/timeAgo";
import { Icon } from "@iconify/react";
import Image from "next/image";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const reviews = [
  {
    id: 1,
    image: "MT",
    name: "Maria T.",
    position: "Operations Manager",
    rating: 5,
    review: `"The most reliable crew we've ever had.
They never miss a night and the floors
look brand new every morning."`,
  },
  {
    id: 2,
    image: "DR",
    name: "David R.",
    position: "Facility Director",
    rating: 5,
    review: `"Professional, insured, and they actually
follow the custom checklist we provided.
Highly recommend for medical offices."`,
  },
  {
    id: 3,
    image: "SK",
    name: "Sarah K.",
    position: "HR Administrator",
    rating: 5,
    review: `"Their eco-friendly products make a huge
difference for our staff. Great
communication with our account
manager."`,
  },
  {
    id: 4,
    image: "MT",
    name: "Maria T.",
    position: "Operations Manager",
    rating: 5,
    review: `"The most reliable crew we've ever had.
They never miss a night and the floors
look brand new every morning."`,
  },
  {
    id: 5,
    image: "DR",
    name: "David R.",
    position: "Facility Director",
    rating: 5,
    review: `"Professional, insured, and they actually
follow the custom checklist we provided.
Highly recommend for medical offices."`,
  },
  {
    id: 6,
    image: "SK",
    name: "Sarah K.",
    position: "HR Administrator",
    rating: 5,
    review: `"Their eco-friendly products make a huge
difference for our staff. Great
communication with our account
manager."`,
  },
];
export default function ManagerReview({ feedbacks }) {
  return (
    <section className="container mt-10 md:mt-14 lg:mt-20">
      <div className="text-center">
        <h2 className="text-slate text-2xl md:text-3xl lg:text-4xl font-bold">
          What NYC Facility Managers Say
        </h2>
        <div className="mt-4">
          {Array(5)
            .fill()
            .map((_, index) => (
              <Icon
                key={index}
                icon="ic:round-star"
                width={20}
                height={20}
                className="inline-block red"
              />
            ))}
        </div>
        <p className="mt-0.5">4.9 out of 5 — based on 200+ reviews</p>
      </div>

      <div className="mt-12 ">
        {feedbacks.length <= 0 ? (
          <p>There is no client say</p>
        ) : (
          <div className="mt-8 sm:mt-16">
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
              {feedbacks.map((item) => (
                <SwiperSlide style={{ height: "100%" }} key={item.id}>
                  <div className="flex  flex-col justify-between  border border-gray-300 p-8 rounded-[20px]  h-92.5 ">
                    <div>
                      <div className="relative right-1">
                        <Icon
                          icon="flat-color-icons:google"
                          width="50"
                          height="50"
                        />
                      </div>
                      <p className="mt-2.5 text-base md:text-sm lg:text-[17.65px] text-justify">
                        {item?.feedback}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <div className="flex items-center gap-3">
                        <Image
                          width={50}
                          height={50}
                          src={`/api/uploads/feedback/${item?.image}`}
                          alt="user"
                          className="size-10 rounded-full"
                        />
                        <div>
                          <h5 className="text-sm sm:text-sm lg:text-[15.69px] font-bold font-inter">
                            {item?.clientName}
                          </h5>
                          <p className="text-sm sm:text-sm lg:text-[15px] font-light">
                            {timeAgo(item?.feedbackDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: item.rating }).map((_, id) => (
                          <Icon
                            key={id}
                            icon="material-symbols:star-rounded"
                            width="18"
                            height="18"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
