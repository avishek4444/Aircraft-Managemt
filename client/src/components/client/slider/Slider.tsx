import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./swiper.css";
import img1 from "assets/plane.jpg";
import img2 from "assets/plane2.jpg";
import img3 from "assets/plane3.jpg";

const Slider = () => {
  const imgData = [
    {
      id: 1,
      img: img1,
    },
    {
      id: 2,
      img: img2,
    },
    {
      id: 3,
      img: img3,
    },
  ];
  return (
    <>
      <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={true}
        modules={[Pagination, Autoplay]}
        loop={true}
        className="mySwiper"
      >
        {imgData.map((item) => (
          <SwiperSlide key={item.id} className="relative">
            <div className="absolute text-white leading-10 z-10">
              <h1 className="text-[3.5em] font-bold uppercase ">
                Fly With us!
              </h1>
              <h4 className="font-semibold">Easy access your flight Ticket</h4>
            </div>
            <img
              src={item?.img}
              alt=""
              className="w-auto h-auto object-cover brightness-50"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Slider;
