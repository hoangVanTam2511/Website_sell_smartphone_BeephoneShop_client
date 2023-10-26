import React from 'react'
import './CartPage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { shopping_cart } from '../../utils/images'
import { Link } from 'react-router-dom'
import {
  getAllCarts,
  removeFromCart,
  toggleCartQty
} from '../../store/cartSlice'
import { Divider } from 'antd'
import Checkout from './checkout'

import Button from '@mui/material/Button'

const CartPage = () => {
  const dispatch = useDispatch()
  const carts = useSelector(getAllCarts)
  const { itemsCount, totalAmount } = useSelector(state => state.cart)

  if (carts.length === 0) {
    return (
      <div className='container my-5'>
        <div className='empty-cart flex justify-center align-center flex-column font-manrope'>
          <img src={shopping_cart} alt='' />
          <span className='fw-6 fs-15 '>Giỏ hàng đang trống.</span>
          <Link to='/' className='shopping-btn text-white fw-5' style={{ backgroundColor:`#128DE2`, border:'1px solid #128DE2', borderRadius:'20px'}}>
            Đi tới trang chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <h3 className='text-center fw-5' style={{ marginTop: 20 }}>
        Giỏ hàng của bạn
      </h3>
      <Divider />
      <div
        className='cart bg-white'
        style={{ margin: `20px auto`, width: `50%`, borderRadius: '20px' }}
      >
        <div className='container'>
          <div className='cart-ctable'>
            <div className='cart-cbody bg-white'>
              {carts.map((cart, idx) => {
                return (
                  <>
                    <div
                      className='cart-ctr'
                      key={cart?.id}
                      style={{ marginTop: 10 }}
                    >
                      <div className='cart-ctd'>
                        <img
                          style={{ width: 112, height: 105 }}
                          src='https://cdn.tgdd.vn/Products/Images/42/235838/Galaxy-S22-Ultra-Black-200x200.jpg'
                        />

                        <button
                          type='button'
                          className='delete-btn text-dark'
                          onClick={() => dispatch(removeFromCart(cart?.id))}
                          style={{
                            color: '#999',
                            position: 'relative',
                            right: '-42px',
                            marginTop: '7px'
                          }}
                        >
                          <i class='fa-regular fa-circle-xmark'></i> Xóa
                        </button>
                      </div>
                      <div
                        className='cart-ctd'
                        style={{ position: 'relative', top: '0px' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: 550,
                            height: 140,
                            marginLeft: 10
                          }}
                        >
                          <div style={{ width: '127%' }}>
                            <span className='cart-ctxtf fw-7'>
                              Laptop Asus TUF Gaming F15 FX506HE i7
                            </span>
                            <br />
                            <span>Màu : đen</span>
                          </div>
                          <div style={{ width: '58%' }}>
                            <span
                              className='cart-ctxt'
                              style={{ color: 'red', fontSize: '16px' }}
                            >
                              9.0000.000{' '}
                              <sup>
                                <ins>đ</ins>
                              </sup>
                            </span>
                            <br />
                            <del style={{ color: '#999', fontSize: '16px' }}>
                              9.5000.000{' '}
                              <sup>
                                <ins>đ</ins>
                              </sup>
                            </del>
                          </div>
                        </div>
                      </div>
                      <div className='cart-ctd'></div>
                      <div className='cart-ctd'>
                        <div
                          className='qty-change flex align-center'
                          style={{
                            position: `relative`,
                            top: `39px`,
                            right: `171px`
                          }}
                        >
                          <button
                            type='button'
                            className='qty-decrease flex align-center justify-center'
                            onClick={() =>
                              dispatch(
                                toggleCartQty({ id: cart?.id, type: 'DEC' })
                              )
                            }
                          >
                            <i className='fas fa-minus'></i>
                          </button>

                          <div className='qty-value flex align-center justify-center'>
                            {cart?.quantity}
                          </div>

                          <button
                            type='button'
                            className='qty-increase flex align-center justify-center'
                            onClick={() =>
                              dispatch(
                                toggleCartQty({ id: cart?.id, type: 'INC' })
                              )
                            }
                          >
                            <i className='fas fa-plus'></i>
                          </button>
                        </div>
                      </div>

                      <div className='cart-ctd'>
                        {/* <span
                          className="cart-ctxt text-orange fw-5"
                          style={{ color: "#128DE2" }}
                        >
                          {formatPrice(cart?.totalPrice)}
                        </span> */}
                      </div>

                      <div className='cart-ctd'></div>
                    </div>
                  </>
                )
              })}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: `space-between`,
                width: '90%',
                margin: '0px auto',
                transform: `translateY(24px)`
              }}
            >
              <div>Tạm tính ({itemsCount} sản phẩm) :</div>
              <div>
                {totalAmount}{' '}
                <sup>
                  <ins>đ</ins>
                </sup>
              </div>
            </div>

            <Divider />

            <Checkout />

            <div
              style={{
                display: 'flex',
                justifyContent: `space-between`,
                width: '90%',
                margin: '0px auto',
                marginTop: '-30px'
              }}
            >
              <div className='fw-6'>Tổng tiền :</div>
              <div style={{ color: 'red' }}>
                {totalAmount}{' '}
                <sup>
                  <ins>đ</ins>
                </sup>
              </div>
            </div>

            <div>
            <Button variant='contained' style={{ width: '90%', marginTop:22, marginLeft:'35px', fontSize: 16 }}>Đặt hàng</Button>
            </div>

            <br />
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
