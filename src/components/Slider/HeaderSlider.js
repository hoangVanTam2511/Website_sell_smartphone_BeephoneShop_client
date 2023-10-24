import React from 'react';
import "./HeaderSlider.scss";
import "./styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Col, Row } from 'antd';
import Carousel from './carousel';

const HeaderSlider = () => {
  let settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
        <div className='container'>
      <Row>
       <Col span={16}>
          <div className='slider-content overflow-x-hidden' style={{  padding:`10px`, height:422}}>
              {/* <Slider {...settings} style={{ height:422}}>
                <div className='slider-item' style={{ height:422}}> 
                  <img src = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/banner-nthu-loa-jbl-v60-sliding.jpg' alt = "" style={{ height:422}} />
                </div>
                <div className='slider-item' style={{ height:422}}>
                  <img src = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/690x300-sliding-ultra-l20.png' alt = "" style={{ height:422}} />
                </div>
              </Slider> */}
              <Carousel/>
            </div>
       </Col>
       <Col span={8}>
          <img className='banner-slider' src = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/ipad-chinh-hang-right-thang10-neww.png'  />
          <br/>
          <img className='banner-slider' src = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/690-300-max-Banner-sliding-deal.jpg'  />

       </Col>
     </Row>
        {/* <div className='slider-content overflow-x-hidden'>
          <Slider {...settings}>
            <div className='slider-item'>
              <img src = {sliderImgs[0]} alt = "" />
            </div>
            <div className='slider-item'>
              <img src = {sliderImgs[1]} alt = "" />
            </div>
          </Slider>
        </div> */}
      </div>
  )
}

export default HeaderSlider