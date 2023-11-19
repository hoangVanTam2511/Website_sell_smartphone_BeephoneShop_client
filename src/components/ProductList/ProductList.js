import React from 'react';
import "./ProductList.scss";
import Product from "../Product/Product";

const ProductList = ({products}) => {
  return (
    <div className='product-lists flex bg-white my-3' style={{ flexWrap: `wrap`, alignItems: `center`, marginLeft: `19px` }}>
      {
        products.map(product => {
          return (
            <>
             <Product product = {product} />
             <Product product = {product} />
             <Product product = {product} />
            </>
          )
        })
      }
    </div>
  )
}

export default ProductList