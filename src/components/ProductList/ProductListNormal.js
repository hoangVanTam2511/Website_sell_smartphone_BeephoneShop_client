import React from 'react';
import "./ProductList.scss";
import Product from "../Product/Product";
import "react-multi-carousel/lib/styles.css";


const ProductList = ({products}) => {
  return (
    <div
     style= {{ 
        display: 'flex', 
        alignItems: 'center',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
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