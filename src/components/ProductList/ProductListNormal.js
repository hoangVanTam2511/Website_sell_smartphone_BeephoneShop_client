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
    <div
     style= {{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    }}
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
    </ div>
  )
}

export default ProductList