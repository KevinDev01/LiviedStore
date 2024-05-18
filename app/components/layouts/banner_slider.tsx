import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "@remix-run/react";

const BannerSlider = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper h-96">
        <SwiperSlide className="bg-sky-400 rounded-3xl">
          <div className="h-full flex flex-col justify-center items-center gap-1">
            <h1 className="text-5xl font-black">
              <span className="text-red-600">%30</span> de descuento
            </h1>
            <p>Oferta especial por inauguración del negocio.</p>
            <p className="font-bold text-lg">
              Codigo -<span className=""> BuenaVibra</span>
            </p>
            <Link
              to={"/promociones"}
              className="w-36 h-12 mt-5 font-semibold text-white bg-amber-500 rounded-md flex justify-center items-center hover:scale-105 transition ease-out">
              Ver productos
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide className="bg-amber-400 rounded-3xl">vapes</SwiperSlide>
      </Swiper>
    </>
  );
};

export default BannerSlider;
