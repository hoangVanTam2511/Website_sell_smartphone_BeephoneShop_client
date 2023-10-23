import React from 'react';
import "./CartPage.scss";
import { useSelector, useDispatch } from 'react-redux';
import { shopping_cart } from '../../utils/images';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { getAllCarts, removeFromCart, toggleCartQty, clearCart, getCartTotal } from '../../store/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const carts = useSelector(getAllCarts);
  const { itemsCount, totalAmount} = useSelector((state) => state.cart);

  if(carts.length === 0){
    return (
      <div className='container my-5'>
        <div className='empty-cart flex justify-center align-center flex-column font-manrope'>
          <img src = {shopping_cart} alt = "" />
          <span className='fw-6 fs-15 text-gray'>Your shopping cart is empty.</span>
          <Link to = "/" className='shopping-btn bg-orange text-white fw-5'>Go shopping Now</Link>
        </div>
      </div>
    )
  }

  return (
    <div className='cart bg-white'>
      <div className='container'>
        <div className='cart-ctable'>

          <div className='cart-chead bg-white'>
            <div className='cart-ctr fw-6 font-manrope fs-15'>
              <div className='cart-cth'>
                <span className='cart-ctxt'>STT</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Sản phẩm</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Giá</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Số lượng</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Tổng tiền</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Hành động</span>
              </div>
            </div>
          </div>

          <div className='cart-cbody bg-white'>
            {
              carts.map((cart, idx) => {
                return (
                  <div className='cart-ctr py-4' key = {cart?.id}>
                    <div className='cart-ctd'>
                      <span className='cart-ctxt'>{idx + 1}</span>
                    </div>
                    <div className='cart-ctd'>
                      <span className='cart-ctxt'>{cart?.title}</span>
                    </div>
                    <div className='cart-ctd'>
                      <span className='cart-ctxt' style={{color: "#128DE2"}}>{formatPrice(cart?.discountedPrice)}</span>
                    </div>
                    <div className='cart-ctd'>
                      <div className='qty-change flex align-center'>
                        <button type = "button" className='qty-decrease flex align-center justify-center' onClick={() => dispatch(toggleCartQty({id: cart?.id, type: "DEC"}))}>
                          <i className='fas fa-minus'></i>
                        </button>

                        <div className='qty-value flex align-center justify-center' >
                          {cart?.quantity}
                        </div>

                        <button type = "button" className='qty-increase flex align-center justify-center' onClick={() => dispatch(toggleCartQty({id: cart?.id, type: "INC"}))}>
                          <i className='fas fa-plus'></i>
                        </button>
                      </div>
                    </div>

                    <div className='cart-ctd'>
                      <span className='cart-ctxt text-orange fw-5' style={{ color: "#128DE2"}}>{formatPrice(cart?.totalPrice)}</span>
                    </div>

                    <div className='cart-ctd'>
                      <button type = "button" className='delete-btn text-dark' onClick={() => dispatch(removeFromCart(cart?.id))}>Delete</button>
                    </div>
                  </div>
                )
              })
            }
          </div>

          <div className='cart-cfoot flex align-start justify-between py-3 bg-white'>
            <div className='cart-cfoot-l'>
              <button type='button' style={{ border: `1px solid #128DE2`, color: `#128DE2`, borderRadius:`14px`, fontSize: `12px`}} className='clear-cart-btn text-danger fs-15 text-uppercase fw-4' onClick={() => dispatch(clearCart())}>
                <i className='fas fa-trash'></i>
                 <span className='mx-1'>Xóa toàn bộ sản phẩm</span>
              </button>
            </div>

            <div className='cart-cfoot-r flex flex-column justify-end'>
              <div className='total-txt flex align-center justify-end'>
                <div className='font-manrope fw-5'>Tổng ({itemsCount}) sản phẩm: </div>
                <span className='text-orange fs-22 mx-2 fw-6' style={{color: `#128DE2`}}>{formatPrice(totalAmount)}</span>
              </div>

              <button style={{ backgroundImage: `linear-gradient(0deg, rgb(0, 102, 204), rgb(0, 153, 204))`, borderRadius:`14px`}} type = "button" className='checkout-btn text-white bg-orange fs-16'>Thanh toán</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CartPage