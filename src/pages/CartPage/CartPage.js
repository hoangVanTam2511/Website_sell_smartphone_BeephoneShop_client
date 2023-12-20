import React, { useState, useEffect } from "react";
import "./CartPage.scss";
import { shopping_cart } from "../../utils/images";
import { Link } from "react-router-dom";
import { Divider, Radio } from "antd";
import axios from "axios";
import {
  addToCart,
  SetSelectedCart,
  getSelectedCartDetail,
  changeSelectedProductDetail,
} from "../../store/cartSlice";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/userSlice";
import {
  addProductToCart,
  removeProductToCart,
  deleteProduct,
} from "../../store/cartDetailSlice";
import { ResetItemNavbar } from "../../store/navbarSlice";
import toast, { Toaster } from "react-hot-toast";
import { request, setAuthHeader } from "../../helpers/axios_helper";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const CartPage = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [changeCount, setChangeCount] = useState(new Map());
  const dispatch = useDispatch();
  const user = getUser();
  const navigate = useNavigate();

  // radio cutsom
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkeds, setCheckeds] = useState([]);
  const [isChecked, setIsChecked] = useState(0);

  //loading
  const [isLoading, setIsLoading] = useState(false);

  // redux
  const productDetailsRedux = useSelector((state) => state.cartDetail.products);
  const quantityRedux = useSelector((state) => state.cartDetail.quantity);
  const totalAmountRedux = useSelector((state) => state.cartDetail.totalAmount);
  const newProductAddToCart = getSelectedCartDetail();

  const getProductDetails = async () => {
    if (productDetails.length !== 0) return;
    if (user.id === "") {
      if (
        productDetailsRedux.find(
          (item) => item.data.id === newProductAddToCart?.data.id
        ) !== undefined
      ) {
        setCheckeds([newProductAddToCart]);
        if (productDetailsRedux.length === 1 && user.id === "") {
          setIsCheckedAll(true);
        }
      } else {
        setCheckeds([]);
      }
    } else {
      request(
        "GET",
        `/client/cart-detail/get-cart-details?id_customer=${user.id}`
      )
        .then((res) => {
          setProductDetails(res.data);
          var totalCart = 0;
          if (res.data.length === 0) return;
          checkeds.map((e) => {
            totalCart +=
              Number(
                e.donGiaSauKhuyenMai === 0 ? e?.donGia : e?.donGiaSauKhuyenMai
              ) * Number(e.soLuongSapMua);
          });

          setTotalAmount(totalCart);
          setChangeCount(
            new Map(
              res.data.map((item) => [
                item.idSanPhamChiTiet,
                item.soLuongSapMua,
              ])
            )
          );

          if (
            res.data.find(
              (item) =>
                item.idSanPhamChiTiet === newProductAddToCart?.idSanPhamChiTiet
            ) !== undefined
          ) {
            setCheckeds([newProductAddToCart]);
            if (res.data.length === 1) {
              setIsCheckedAll(true);
            }
          } else {
            setCheckeds([]);
          }
        })
        .catch((res) => console.log(res));
    }
  };

  const countTotalAmountAgain = () => {
    var totalCart = 0;
    if (user.id === "") {
      var temp = [];
      productDetailsRedux.forEach((e) => {
        if (checkeds.find((item) => item.data.id === e.data.id) !== undefined) {
          temp.push(e);
        }
      });

      temp.map((e) => {
        totalCart +=
          Number(
            e?.data.priceDiscount === 0 ? e?.data.price : e?.data.priceDiscount
          ) * Number(e?.quantity);
      });
      // setCheckeds(temp)
    } else {
      checkeds.map((e) => {
        totalCart +=
          Number(
            e?.donGiaSauKhuyenMai === 0 ? e?.donGia : e?.donGiaSauKhuyenMai
          ) * Number(changeCount.get(e.idSanPhamChiTiet));
      });
    }

    setTotalAmount(totalCart);
  };

  useEffect(() => {
    if (user.id !== null || user.id !== "") {
      getProductDetails();
    }
    // countTotalAmountAgain()
    dispatch(addToCart());
    dispatch(SetSelectedCart(1));
    dispatch(ResetItemNavbar());
  }, []);

  useEffect(() => {
    countTotalAmountAgain();
  }, [totalAmount, checkeds.length, isChecked]);

  const formatMoney = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  if (
    user.id === ""
      ? productDetailsRedux.length === 0
      : productDetails.length === 0
  ) {
    return (
      <div className="container my-5">
        <div className="empty-cart flex justify-center align-center flex-column font-manrope">
          <img
            style={{ width: "300px" }}
            src="https://res.cloudinary.com/dqwfbbd9g/image/upload/v1701448962/yy04ozpcgnsz3lv4r2h2.png"
            alt=""
          />
          <span
            className="fw-6 fs-15 text-dark"
            style={{ fontSize: "16px", fontWeight: "550" }}
          >
            Giỏ hàng đang trống.
          </span>
          <Link
            to="/"
            className="shopping-btn text-white fw-5"
            style={{
              backgroundColor: `#128DE2`,
              border: "1px solid #128DE2",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "550",
            }}
          >
            Đi tới trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const handlePlusCart = async (product) => {
    if (user.id === "") {
      if (product.data.quantityInventory < product.quantity + 1) {
        toast.error(
          "Không còn đủ sản phẩm trong kho. Vui lòng chọn sản phẩm khác"
        );
      } else {
        if (product.quantity > 3) {
          toast.error("Vượt quá số lượng cho phép");
        } else {
          dispatch(addProductToCart(product.data));
          setTimeout(() => {
            setIsChecked(isChecked + 1);
          }, 100);
        }
      }
    } else {
      if (
        product.soLuongTonKho <
        changeCount.get(product.idSanPhamChiTiet) + 1
      ) {
        toast.error(
          "Không còn đủ sản phẩm trong kho. Vui lòng chọn sản phẩm khác"
        );
      } else {
        var id = product.idSanPhamChiTiet;
        request(
          "POST",
          `/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${id}&type=plus`
        )
          .then((res) => {
            if (res.status === 200) {
              var temp = Number(changeCount.get(id)) + 1;
              setChangeCount((map) => new Map(map.set(id, temp)));
              countTotalAmountAgain();
            }
          })
          .catch((res) => toast.error("Vượt quá số lượng cho phép"));
      }
      setTimeout(() => {
        dispatch(addToCart());
      }, 200);
    }
  };

  const handleMinusCart = async (product) => {
    if (user.id === "") {
      if (product.quantity === 1) {
        setCheckeds(checkeds.filter((e) => e.data.id !== product.data.id));
      }
      dispatch(removeProductToCart(product.data));
      setTimeout(() => {
        setIsChecked(isChecked + 1);
      }, 100);
    } else {
      var id = product.idSanPhamChiTiet;
      const countOfProductDetail = changeCount.get(product.idSanPhamChiTiet);
      if (countOfProductDetail === 1) {
        deleteCartDetail(product);
        setCheckeds(
          checkeds.filter(
            (e) => e.idSanPhamChiTiet !== product.idSanPhamChiTiet
          )
        );
      } else {
        request(
          "POST",
          `/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${id}&type=minus`
        )
          .then((res) => {
            if (res.status === 200) {
              var temp = Number(changeCount.get(id)) - 1;
              setChangeCount((map) => new Map(map.set(id, temp)));
              countTotalAmountAgain();
            }
          })
          .catch((res) => {});
      }
      setTimeout(() => {
        dispatch(addToCart());
      }, 100);
    }
  };

  const deleteCartDetail = async (product) => {
    if (user.id === "") {
      dispatch(deleteProduct(product));
      setCheckeds(checkeds.filter((e) => e.id !== product.id));
    } else {
      setCheckeds(
        checkeds.filter((e) => e.idSanPhamChiTiet !== product.idSanPhamChiTiet)
      );
      if (productDetails.length === 1) {
        dispatch(addToCart(0));
      }

      if (product.idGioHangChiTiet !== null) {
        request(
          "DELETE",
          `/client/cart-detail/delete-cart-details?id_customer=${user.id}&id_cart_detail=${product.idGioHangChiTiet}`
        )
          .then((res) => {
            setProductDetails(res.data);
            var totalCart = 0;
            if (res.data.length === 0) return;
            checkeds.map((e) => {
              totalCart +=
                Number(
                  e.donGiaSauKhuyenMai === 0 ? e?.donGia : e?.donGiaSauKhuyenMai
                ) * Number(e.soLuongSapMua);
            });
            setTotalAmount(totalCart);
            dispatch(addToCart());
          })
          .catch((res) => console.log(res));
      }
    }
  };

  const changeStateCheckAll = () => {
    var checks = [];

    if (isCheckedAll === false) {
      if (user.id === "") {
        productDetailsRedux.forEach((product) => {
          checks.push(product);
        });
      } else {
        productDetails.forEach((product) => {
          checks.push(product);
        });
      }

      setCheckeds(checks);
      setIsCheckedAll(true);
    } else {
      setCheckeds([]);
      setIsCheckedAll(false);
    }

    setTimeout(() => {
      setIsChecked(isChecked + 1);
    }, 100);
  };

  const handCheckedOne = async (product) => {
    if (user.id === "") {
      if (checkeds.length === 0) {
        setCheckeds([...checkeds, product]);
        var list = [...checkeds, product];
        if (list.length === productDetailsRedux.length) {
          setIsCheckedAll(true);
        }
      } else if (
        checkeds.find((e) => e.data.id === product.data.id) !== undefined
      ) {
        setCheckeds(checkeds.filter((e) => e.data.id !== product.data.id));

        var list = checkeds.filter((e) => e.data.id !== product.data.id);
        setIsCheckedAll(false);
      } else {
        setCheckeds([...checkeds, product]);
        var list = [...checkeds, product];
        if (list.length === productDetailsRedux.length) {
          setIsCheckedAll(true);
        }
      }

      setTimeout(() => {
        setIsChecked(isChecked + 1);
      }, 100);
    } else {
      if (checkeds.length === 0) {
        setCheckeds([...checkeds, product]);
        var list = [...checkeds, product];
        if (list.length === productDetails.length) {
          setIsCheckedAll(true);
        }
      } else if (
        checkeds.find(
          (e) => e.idSanPhamChiTiet === product.idSanPhamChiTiet
        ) !== undefined
      ) {
        setCheckeds(
          checkeds.filter(
            (e) => e.idSanPhamChiTiet !== product.idSanPhamChiTiet
          )
        );

        var list = checkeds.filter(
          (e) => e.idSanPhamChiTiet !== product.idSanPhamChiTiet
        );
        setIsCheckedAll(false);
      } else {
        setCheckeds([...checkeds, product]);
        var list = [...checkeds, product];
        if (list.length === productDetails.length) {
          setIsCheckedAll(true);
        }
      }

      // set total money
      await countTotalAmountAgain();
    }
  };

  const deleteProductSelected = () => {
    if (user.id === "") {
      checkeds.forEach((product) => {
        deleteCartDetail(product.data);
      });

      setTimeout(() => {
        setIsChecked(isChecked + 1);
      }, 100);
    } else {
      checkeds.forEach((product) => {
        deleteCartDetail(product);
      });

      // set total money
      countTotalAmountAgain();
    }
  };

  const buyNow = () => {
    setIsLoading(true);
    var productItemSelected = checkeds;
    if (getQuantityOfCart() > 4) {
      toast.error("Bạn chỉ được chọn 4 sản phẩm");
      setIsLoading(false);
      return;
    }

    if (user.id === "") {
      var temp = [];
      productDetailsRedux.forEach((e) => {
        if (checkeds.find((item) => item.data.id === e.data.id) !== undefined) {
          temp.push(e);
        }
      });
      productItemSelected = temp;
    } else {
      var temp = [];
      productDetails.forEach((e) => {
        if (
          checkeds.find(
            (item) => item.idSanPhamChiTiet === e.idSanPhamChiTiet
          ) !== undefined
        ) {
          temp.push({
            donGia: e.donGia,
            donGiaSauKhuyenMai: e.donGiaSauKhuyenMai,
            dungLuongRam: e.dungLuongRam,
            dungLuongRom: e.dungLuongRom,
            duongDan: e.duongDan,
            idGioHangChiTiet: e.idGioHangChiTiet,
            idSanPhamChiTiet: e.idSanPhamChiTiet,
            soLuongSapMua: changeCount.get(e.idSanPhamChiTiet),
            soLuongTonKho: e.soLuongTonKho,
            tenMauSac: e.tenMauSac,
            tenSanPham: e.tenSanPham,
          });
        }
      });
      productItemSelected = temp;
    }
    changeSelectedProductDetail(productItemSelected);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/check-out");
    }, 100);
  };

  const getQuantityOfCart = () => {
    var count = 0;
    if (user.id !== "") {
      checkeds.map((e) => {
        count += Number(changeCount.get(e.idSanPhamChiTiet));
      });
    } else {
      checkeds.forEach((e) => {
        if (
          productDetailsRedux.find(
            (product) => product.data.id === e.data.id
          ) !== undefined
        ) {
          count += Number(
            productDetailsRedux.find((product) => product.data.id === e.data.id)
              .quantity
          );
        }
      });
    }
    return count;
  };

  return (
    <>
      {isLoading === false ? (
        <> </>
      ) : (
        <div className="custom-spin">
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 40, color: "#126de4", marginLeft: 5 }}
                spin
              />
            }
          />
        </div>
      )}

      <h3
        className="text-center fw-5"
        style={{ marginTop: 20, transform: "translateY(17px)" }}
      >
        <span></span>

        <span style={{ fontWeight: 600 }}>Giỏ hàng của bạn</span>
      </h3>
      <Divider
        style={{ margin: " 20px auto", width: "48%", minWidth: "47%" }}
      />

      <>
        <div
          style={{
            margin: `0px auto`,
            width: `50%`,
            borderRadius: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <input
              id="radio-all"
              class="radio-custom radio-custom-select-all"
              name="radio-group"
              type="checkbox"
              checked={isCheckedAll}
              onChange={() => changeStateCheckAll()}
            />
            <label
              for="radio-all"
              class="radio-custom-label radio-custom-label-select-all "
            >
              <span
                style={{
                  marginLeft: "-4px",
                  fontSize: "18px",
                  transform: `translateY(4px)`,
                  display: "inline-block",
                }}
              >
                Chọn tất cả
              </span>
            </label>
          </div>

          <div
            style={{
              backgroundColor: `transparent`,
              border: `0`,
              color: `#9f9d9d`,
              marginRight: "6px",
            }}
          >
            {checkeds.length === 0 ? (
              <></>
            ) : (
              <div
                onClick={() => deleteProductSelected()}
                style={{
                  cursor: "pointer",
                }}
              >
                <em>Xoá sản phẩm đã chọn</em>
              </div>
            )}
          </div>
        </div>

        <div
          className="cart bg-white"
          style={{ margin: `5px auto`, width: `50%`, borderRadius: "10px" }}
        >
          <div className="container">
            <div className="cart-ctable">
              <div className="cart-cbody bg-white">
                {user.id !== "" &&
                  productDetails.map((product) => {
                    return (
                      <>
                        <div
                          className="cart-ctr"
                          key={product?.idSanPhamChiTiet}
                          style={{ marginTop: 10 }}
                        >
                          <div
                            className="cart-ctd"
                            style={{ width: "27px", marginLeft: "-10px" }}
                          >
                            <div style={{ transform: `translateY(-56px)` }}>
                              <input
                                id={product?.idSanPhamChiTiet + "radio-id"}
                                class="radio-custom"
                                name="radio-group"
                                type="checkbox"
                                checked={
                                  checkeds.find(
                                    (e) =>
                                      product?.idSanPhamChiTiet ===
                                      e.idSanPhamChiTiet
                                  ) === undefined
                                    ? false
                                    : true
                                }
                                onChange={() => handCheckedOne(product)}
                              />
                              <label
                                id={product?.idSanPhamChiTiet + "radio-id"}
                                class="radio-custom-label"
                              ></label>
                            </div>
                          </div>

                          <div className="cart-ctd">
                            <img
                              style={{ width: 112, height: 115 }}
                              src={product?.duongDan}
                            />

                            <button
                              type="button"
                              className="delete-btn text-dark"
                              onClick={() => deleteCartDetail(product)}
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
                                width: 569,
                                height: 140,
                                marginLeft: 10,
                              }}
                            >
                              <div style={{ width: "127%" }}>
                                <span className="cart-ctxtf fw-7">
                                  {product?.tenSanPham +
                                    " " +
                                    product?.dungLuongRam +
                                    "GB " +
                                    product?.dungLuongRom +
                                    "GB"}
                                </span>
                                <br />
                                <span>Màu : {product.tenMauSac}</span>
                              </div>
                              <div style={{ width: "23%" }}>
                                <span
                                  className="cart-ctxt"
                                  style={{
                                    color: "rgb(18, 141, 226)",
                                    fontSize: "16px",
                                  }}
                                >
                                  {formatMoney(
                                    product?.donGiaSauKhuyenMai === 0
                                      ? product?.donGia
                                      : product?.donGiaSauKhuyenMai
                                  )}
                                </span>
                                <br />
                                <del
                                  style={{ color: "#999", fontSize: "16px" }}
                                >
                                  {product?.donGiaSauKhuyenMai === 0
                                    ? ""
                                    : formatMoney(product?.donGia)}
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
                                right: `88px`,
                              }}
                            >
                              <button
                                type="button"
                                className="qty-decrease flex align-center justify-center"
                                onClick={() => handleMinusCart(product)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>

                              <div className="qty-value flex align-center justify-center">
                                {changeCount.get(product.idSanPhamChiTiet)}
                              </div>

                              <button
                                type="button"
                                className="qty-increase flex align-center justify-center"
                                onClick={() => handlePlusCart(product)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>

                          <div className="cart-ctd"></div>

                          <div className="cart-ctd"></div>
                        </div>
                      </>
                    );
                  })}

                {user.id === "" &&
                  productDetailsRedux.map((product) => {
                    return (
                      <>
                        <div
                          className="cart-ctr"
                          key={product?.id}
                          style={{ marginTop: 10 }}
                        >
                          <div
                            className="cart-ctd"
                            style={{ width: "27px", marginLeft: "-10px" }}
                          >
                            <div style={{ transform: `translateY(-56px)` }}>
                              <input
                                id={product?.data.id + "radio-id"}
                                class="radio-custom"
                                name="radio-group"
                                type="checkbox"
                                checked={
                                  checkeds.find(
                                    (e) => product?.data.id === e.data.id
                                  ) === undefined
                                    ? false
                                    : true
                                }
                                onChange={() => handCheckedOne(product)}
                              />
                              <label
                                id={product?.data.id + "radio-id"}
                                class="radio-custom-label"
                              ></label>
                            </div>
                          </div>

                          <div className="cart-ctd">
                            <img
                              style={{ width: 112, height: 115 }}
                              src={product?.data.urlImage}
                            />

                            <button
                              type="button"
                              className="delete-btn text-dark"
                              onClick={() => deleteCartDetail(product.data)}
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
                                width: 569,
                                height: 140,
                                marginLeft: 10,
                              }}
                            >
                              <div style={{ width: "127%" }}>
                                <span className="cart-ctxtf fw-7">
                                  {product?.data.nameProduct +
                                    " " +
                                    product?.data.ram +
                                    "GB " +
                                    product?.data.rom +
                                    "GB"}
                                </span>
                                <br />
                                <span>Màu : {product.data.color}</span>
                              </div>
                              <div style={{ width: "23%" }}>
                                <span
                                  className="cart-ctxt"
                                  style={{
                                    color: "rgb(18, 141, 226)",
                                    fontSize: "16px",
                                  }}
                                >
                                  {formatMoney(
                                    product?.data.priceDiscount === 0
                                      ? product?.data.price
                                      : product?.data.priceDiscount
                                  )}
                                </span>
                                <br />
                                <del
                                  style={{ color: "#999", fontSize: "16px" }}
                                >
                                  {product?.data.priceDiscount === 0
                                    ? ""
                                    : formatMoney(product?.data.price)}
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
                                right: `88px`,
                              }}
                            >
                              <button
                                type="button"
                                className="qty-decrease flex align-center justify-center"
                                onClick={() => handleMinusCart(product)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>

                              <div className="qty-value flex align-center justify-center">
                                {product.quantity}
                              </div>

                              <button
                                type="button"
                                className="qty-increase flex align-center justify-center"
                                onClick={() => handlePlusCart(product)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>

                          <div className="cart-ctd"></div>

                          <div className="cart-ctd"></div>
                        </div>
                      </>
                    );
                  })}
              </div>

              <div className="countProductTemp">
                <div>
                  Tạm tính :
                  <br />
                  <span style={{ fontWeight: "bold", color: "#128DE2" }}>
                    {formatMoney(totalAmount)}
                  </span>
                </div>
                <div>
                  {checkeds.length > 0 ? (
                    <div onClick={() => buyNow()}>
                      <Button
                        variant="contained"
                        style={{
                          width: "100%",
                          marginTop: 5,
                          fontSize: 16,
                        }}
                      >
                        Mua ngay({getQuantityOfCart()})
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Button
                          variant="contained"
                          style={{
                            width: "100%",
                            marginTop: 5,
                            fontSize: 16,
                          }}
                          disabled
                        >
                          Mua ngay
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
      </>

      <Toaster
        style={{ zIndex: -1, overflow: "hidden", opacity: 0 }}
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="hhe"
        toastOptions={{
          // Define default options
          // className: '',
          // duration: 5000,
          // style: {
          //   background: '#4caf50',
          //   color: 'white'
          // },

          // Default options for specific types
          success: {
            duration: 1500,
            theme: {
              primary: "green",
              secondary: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#4caf50",
            },
            style: {
              background: "#4caf50",
              color: "white",
            },
          },

          error: {
            duration: 1500,
            theme: {
              primary: "#f44336",
              secondary: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#f44336",
            },
            style: {
              background: "#f44336",
              color: "white",
            },
          },
        }}
      />
    </>
  );
};

export default CartPage;
