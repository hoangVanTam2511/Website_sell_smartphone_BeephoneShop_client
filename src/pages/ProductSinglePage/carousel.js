import React, { useState } from 'react';
import Slider from 'react-slick';
import './style.css'

export default function App() {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();

  return (
    <div>
      <Slider asNavFor={nav2} ref={(slider1) => setNav1(slider1)} style={{height:`320px`}}>
        <div>
          <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/n/o/note_12-5_1.png' alt='' />
        </div>
        <div>
          <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/n/o/note_12-6_1.png' alt='' />
        </div>
        <div>
          <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/n/o/note_12-3_1.png' alt='' />
        </div>
        <div>
          <img style={{ padding:`8px`, borderRadius:'20px'}} src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/1/0/10_55.jpg' alt='' /> 
        </div>
        <div>
          <img style={{ padding:`8px`, borderRadius:'20px'}} src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/7/_/7_128.jpg' alt='' /> 
        </div>  
      </Slider>
      <Slider
        asNavFor={nav1}
        ref={(slider2) => setNav2(slider2)}
        slidesToShow={3}
        autoplay={true}
        swipeToSlide={true}
        focusOnSelect={true}
        style={{ height:'111px', display:'inline-block'}}
      >
        <div>
          <img style={{ padding:`8px`, borderRadius:'20px'}} src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/n/o/note_12-5_1.png' alt='' />
        </div>
        <div>
          <img  style={{ padding:`8px`, borderRadius:'20px'}} src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/n/o/note_12-6_1.png' alt='' />
        </div>
        <div>
          <img style={{ padding:`8px`, borderRadius:'20px'}} src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/n/o/note_12-3_1.png' alt='' /> 
        </div>
        <div>
          <img style={{ padding:`8px`, borderRadius:'20px'}} src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/1/0/10_55.jpg' alt='' /> 
        </div>
        <div>
          <img style={{ padding:`8px`, borderRadius:'20px'}} src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/7/_/7_128.jpg' alt='' /> 
        </div>
      </Slider>
    </div>
  );
}
