import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import './carousel-slider.css';
// import css
import './styles.css';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';

export default function Carousel() {


  return (
    <>
      <Swiper  navigation={true} modules={[Navigation, Autoplay]} className="mySwiper"   
              autoplay={{ delay : 1000 }}
        >
        <SwiperSlide>
          <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/sliding-iphone15-moban-full--ver2.png'/>
        </SwiperSlide>
        <SwiperSlide>
          <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/sliding-tivi-lg-stand-1.jpg'/>
        </SwiperSlide>
        <SwiperSlide>
          <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/sliding-tcl-40-moban-new.jpg'/>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
