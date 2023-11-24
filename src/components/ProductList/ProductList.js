import React from 'react';
import "./ProductList.scss";
import Product from "../Product/Product";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};


const ProductList = ({products}) => {
  return (
    <Carousel
              additionalTransfrom={0}
              showDots={false}
              arrows={true}
              autoPlaySpeed={2000}
              autoPlay={true}
              centerMode={false}
              className="slider"
              containerClass="container-with-dots"
              dotListClass="dots"
              draggable
              focusOnSelect={false}
              infinite
              itemClass="carousel-top"
              keyBoardControl
              minimumTouchDrag={80}
              renderButtonGroupOutside={false}
              renderDotsOutside
              responsive={responsive}
        style={{  }}
        >
      {
        products.map(product => {
          return (
            <>
             <Product product = {product} />
            </>
          )
        })
      }
    </ Carousel>
  )
}

export default ProductList