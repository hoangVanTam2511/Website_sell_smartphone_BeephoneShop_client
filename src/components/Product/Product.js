import React from 'react'
import { Link } from 'react-router-dom'
import './Product.scss'

const Product = ({ product }) => {

  const formatMoney = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
  }

  return (
    <Link to={`/product/` + product.id} >
      <div
        className='product-item bg-white'
        style={{
          width: '230px',
          height: '330px'
        }}
      >
        {product.donGiaSauKhuyenMai === 0 ? (
          <>
           <div
              className='category'
              style={{
                backgroundColor: `#128DE2`,
                position: 'relative',
                width: '40%',
                top: '1px',
                borderTopLeftRadius: `8px`,
                borderTopRightRadius: `20px`,
                borderBottomRightRadius: `20px`,
                fontWeight: '600',
                opacity: 0
              }}
            >
              Giảm{' '}
              {((product.donGiaSauKhuyenMai / product.donGia) * 100).toFixed(0)}
              %
            </div>
          </>
        ) : (
          <>
            <div
              className='category'
              style={{
                backgroundColor: `#128DE2`,
                position: 'relative',
                width: '40%',
                top: '1px',
                borderTopLeftRadius: `8px`,
                borderTopRightRadius: `20px`,
                borderBottomRightRadius: `20px`,
                fontWeight: '600'
              }}
            >
              Giảm{' '}
              {(((product.donGia - product.donGiaSauKhuyenMai) / product.donGia) * 100).toFixed(0)}
              %
            </div>
          </>
        )}

        <div className='product-item-img'>
          <img
            style={{ width: '86%', margin: '0px auto' }}
            src='https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s22-ultra-12gb-256gb.png'
            alt=''
          />
        </div>
        <div className='product-item-info fs-14'>
          <div className='brand'>
            <span className='fw-8' style={{ fontSize: '14px' }}>
              {product.tenSanPham + ' ' + product.dungLuongRom + ' GB'}
            </span>
          </div>

          <div className='price flex align-center justify-center'>
            <span className='new-price' style={{ color: 'rgb(18, 141, 226)' }}>
              {formatMoney(product.donGiaSauKhuyenMai === 0 ? product.donGia : product.donGiaSauKhuyenMai)}
            </span>
            {
              product.donGiaSauKhuyenMai === 0 ? (
                <></>
              ) : (
              <span className='old-price'>{formatMoney(product.donGia)}</span>
              )
            }
          </div>

          <div style={{ color: 'yellow' }}>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <span style={{ color: 'gray' }}>(5000)</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Product
