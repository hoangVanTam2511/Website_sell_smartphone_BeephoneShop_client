import React from 'react';
import { Link } from 'react-router-dom';
import {formatPrice} from "../../utils/helpers";
import "./Product.scss";

const Product = ({product}) => {
  return (
    <Link to = {`/product/${product?.id}`} key = {product?.id}>
      <div className='product-item bg-white'>
        <div className='category' style={{ backgroundColor: `#128DE2`}}>Giảm 40%</div>
        <div className='product-item-img'>
          <img className='img-cover' src = {product?.images[0]} alt = {product.title} />
        </div>
        <div className='product-item-info fs-14'>
          <div className='brand'>
            <span className='fw-7' style={{ fontSize: '18px'}}>{product?.title}</span>
          </div>
          <div className='price flex align-center justify-center'>
            <span className='old-price'>
              4.000.000 đ
            </span>
            <span className='new-price'>
              3.000.000 đ
            </span>
            <span className='discount fw-6' style={{ color:`#128DE2` }}>
              (40% Off)
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Product