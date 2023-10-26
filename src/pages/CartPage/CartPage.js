import React from "react";
import "./CartPage.scss";
import { useSelector, useDispatch } from "react-redux";
import { shopping_cart } from "../../utils/images";
import { Link } from "react-router-dom";
import {
  getAllCarts,
  removeFromCart,
  toggleCartQty,
} from "../../store/cartSlice";
import { Divider } from "antd";
import Checkout from './checkout'

const CartPage = () => {
  const dispatch = useDispatch();
  const carts = useSelector(getAllCarts);
  const { itemsCount, totalAmount } = useSelector((state) => state.cart);

  if (carts.length === 0) {
    return (
      <div className="container my-5">
        <div className="empty-cart flex justify-center align-center flex-column font-manrope">
          <img src={shopping_cart} alt="" />
          <span className="fw-6 fs-15 text-gray">Giỏ hàng đang trống.</span>
          <Link to="/" className="shopping-btn bg-orange text-white fw-5">
            Đi tới mua hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-center fw-5" style={{ marginTop: 20 }}>
        Giỏ hàng của bạn
      </h3>
      <Divider />
      <div
        className="cart bg-white"
        style={{ margin: `20px auto`, width: `50%`, borderRadius: "20px" }}
      >
        <div className="container">
          <div className="cart-ctable">
            <div className="cart-cbody bg-white">
              {carts.map((cart, idx) => {
                return (
                  <>
                    <div
                      className="cart-ctr"
                      key={cart?.id}
                      style={{ marginTop: 10 }}
                    >
                      <div className="cart-ctd">
                        <img
                          style={{ width: 112, height: 105 }}
                          src="https://cdn.tgdd.vn/Products/Images/42/235838/Galaxy-S22-Ultra-Black-200x200.jpg"
                        />

                        <button
                          type="button"
                          className="delete-btn text-dark"
                          onClick={() => dispatch(removeFromCart(cart?.id))}
                          style={{
                            color: "#999",
                            position: "relative",
                            right: "-42px",
                            marginTop: "7px",
                          }}
                        >
                          <i class="fa-regular fa-circle-xmark"></i> Xóa
                        </button>
                      </div>
                      <div
                        className="cart-ctd"
                        style={{ position: "relative", top: "0px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: 550,
                            height: 140,
                            marginLeft: 10,
                          }}
                        >
                          <div style={{ width: "127%" }}>
                            <span className="cart-ctxtf fw-7">
                              Laptop Asus TUF Gaming F15 FX506HE i7
                            </span>
                            <br />
                            <span>Màu : đen</span>
                          </div>
                          <div style={{ width: "58%" }}>
                            <span
                              className="cart-ctxt"
                              style={{ color: "red", fontSize: "16px" }}
                            >
                              9.0000.000{" "}
                              <sup>
                                <ins>đ</ins>
                              </sup>
                            </span>
                            <br />
                            <del style={{ color: "#999", fontSize: "16px" }}>
                              9.5000.000{" "}
                              <sup>
                                <ins>đ</ins>
                              </sup>
                            </del>
                          </div>
                        </div>
                      </div>
                      <div className="cart-ctd"></div>
                      <div className="cart-ctd">
                        <div
                          className="qty-change flex align-center"
                          style={{
                            position: `relative`,
                            top: `39px`,
                            right: `171px`,
                          }}
                        >
                          <button
                            type="button"
                            className="qty-decrease flex align-center justify-center"
                            onClick={() =>
                              dispatch(
                                toggleCartQty({ id: cart?.id, type: "DEC" })
                              )
                            }
                          >
                            <i className="fas fa-minus"></i>
                          </button>

                          <div className="qty-value flex align-center justify-center">
                            {cart?.quantity}
                          </div>

                          <button
                            type="button"
                            className="qty-increase flex align-center justify-center"
                            onClick={() =>
                              dispatch(
                                toggleCartQty({ id: cart?.id, type: "INC" })
                              )
                            }
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>

                      <div className="cart-ctd">
                        {/* <span
                          className="cart-ctxt text-orange fw-5"
                          style={{ color: "#128DE2" }}
                        >
                          {formatPrice(cart?.totalPrice)}
                        </span> */}
                      </div>

                      <div className="cart-ctd"></div>
                    </div>
                  </>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: `space-between`,
                width: "90%",
                margin: "0px auto",
                transform: `translateY(24px)`,
              }}
            >
              <div>Tạm tính ({itemsCount} sản phẩm) :</div>
              <div>
                {totalAmount}{" "}
                <sup>
                  <ins>đ</ins>
                </sup>
              </div>
            </div>
            <Divider />
            {/* 
            <div className="cart-cfoot flex align-start justify-between py-3 bg-white">
              <div className="cart-cfoot-l">
                <button
                  type="button"
                  style={{
                    border: `1px solid #128DE2`,
                    color: `#128DE2`,
                    borderRadius: `14px`,
                    fontSize: `12px`,
                  }}
                  className="clear-cart-btn text-danger fs-15 text-uppercase fw-4"
                  onClick={() => dispatch(clearCart())}
                >
                  <i className="fas fa-trash"></i>
                  <span className="mx-1">Xóa toàn bộ sản phẩm</span>
                </button>
              </div>

              <div className="cart-cfoot-r flex flex-column justify-end">
                <div className="total-txt flex align-center justify-end">
                  <div className="font-manrope fw-5">
                    Tổng ({itemsCount}) sản phẩm:{" "}
                  </div>
                  <span
                    className="text-orange fs-22 mx-2 fw-6"
                    style={{ color: `#128DE2` }}
                  >
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                <button
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgb(0, 102, 204), rgb(0, 153, 204))`,
                    borderRadius: `14px`,
                  }}
                  type="button"
                  className="checkout-btn text-white bg-orange fs-16"
                >
                  Thanh toán
                </button>
              </div>
            </div> */}

             <Checkout/>
            <br/>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
