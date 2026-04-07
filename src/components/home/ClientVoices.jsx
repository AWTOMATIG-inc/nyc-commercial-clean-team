"use client";
import { clientVoices } from "@/constant/home/client_voices";
import { Icon } from "@iconify/react";
import Image from "next/image";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeading from "../CommonHeading";
export default function ClientVoices() {
  return (
    <section className="container mt-8 sm:mt-16">
      <div>
        <CommonHeading
          title="Client Voices"
          heading="What our clients say"
          subHeading="Real feedback from facilities across New York City.
"
        />
      </div>
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
          {clientVoices.map((item) => (
            <SwiperSlide style={{ height: "100%" }} key={item.id}>
              <div className="flex  flex-col justify-between shadow-custom border border-gray-300 p-8 rounded-[20px]  h-92.5 ">
                <div>
                  <div>
                    <Icon
                      icon="flat-color-icons:google"
                      width="50"
                      height="50"
                    />
                  </div>
                  <p className="mt-2.5 text-base md:text-sm lg:text-[17.65px] text-justify">
                    {item.review}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-3">
                    <Image
                      width={50}
                      height={50}
                      src={item.user.avatar}
                      alt="user"
                      className="size-10 rounded-full"
                    />
                    <div>
                      <h5 className="text-sm sm:text-sm lg:text-[15.69px] font-bold font-inter">
                        {item.user.name}
                      </h5>
                      <p className="text-sm sm:text-sm lg:text-[15px] font-light">
                        {item.date}
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
    </section>
  );
}
