import React from 'react'
import './HeaderSlider.scss'
import './styles.css'
import { Col, Row } from 'antd'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const HeaderSlider = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }

  return (
    <div className='container'>
      <Row style={{ width: '103%' }}>
        <Col span={16}>
          <div
            className='slider-content overflow-x-hidden'
            style={{ height: 355 }}
          >
            <Carousel
              additionalTransfrom={0}
              showDots={false}
              arrows={true}
              autoPlaySpeed={2000}
              autoPlay={true}
              centerMode={false}
              className='slider'
              containerClass='container-with-dots'
              dotListClass='dots'
              draggable
              focusOnSelect={false}
              infinite
              itemClass='carousel-top'
              keyBoardControl
              minimumTouchDrag={20}
              renderButtonGroupOutside={false}
              renderDotsOutside
              responsive={responsive}
              style={{ height: `100%!important` }}
            >
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Main_PC-copy_4651280813112023.jpg'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
        
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Manin_31916160916112023.png'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Main-PC-(1155-x-510-px)_75027332221112023.png'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
            </Carousel>
          </div>
        </Col>
        <Col span={8}>
          <div className='banner-slider'>
          <Carousel
              additionalTransfrom={0}
              showDots={false}
              arrows={true}
              autoPlaySpeed={2000}
              autoPlay={true}
              centerMode={false}
              className='slider'
              containerClass='container-with-dots'
              dotListClass='dots'
              draggable
              focusOnSelect={false}
              infinite
              itemClass='carousel-top'
              keyBoardControl
              minimumTouchDrag={20}
              renderButtonGroupOutside={false}
              renderDotsOutside
              responsive={responsive}
              style={{ height: `100%!important` }}
            >
              <div>
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Tecno-T11-Goc-phai_32244461609112023.jpg'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
              </div>
              <div>
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Goc-phai-(4)_99239571621112023.png'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
              </div>
              <div>
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Main_PC-copy_71749400817112023.jpg'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
              </div>
            </Carousel>
          </div>

          <div className='banner-slider'>
          <Carousel
              additionalTransfrom={0}
              showDots={false}
              arrows={true}
              autoPlaySpeed={2000}
              autoPlay={true}
              centerMode={false}
              className='slider'
              containerClass='container-with-dots'
              dotListClass='dots'
              draggable
              focusOnSelect={false}
              infinite
              itemClass='carousel-top'
              keyBoardControl
              minimumTouchDrag={20}
              renderButtonGroupOutside={false}
              renderDotsOutside
              responsive={responsive}
              style={{ height: `100%!important` }}
            >
              <div>
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/g%C3%B3c-ph%E1%BA%A3i-3_62447000922112023.png'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
              </div>
              <div>
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Banner-vtsss_86254530922112023.jpg'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
              </div>
              <div>
                <img
                  src='https://cdn2.viettelstore.vn/images/Advertises/Goc-phai-(4)_86535332231102023.png'
                  style={{ height: `100%`, marginLeft: -6 }}
                />
              </div>
            </Carousel>
          </div>
        
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
