import React, { useState, useEffect } from "react";
import "../CartPage/CartPage.scss";
import "./CheckoutPage.css";
import { shopping_cart } from "../../utils/images";
import { Link } from "react-router-dom";
import { Divider } from "antd";
import Checkout from "./checkout";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Button from "@mui/material/Button";
import { Input, Modal } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import toast, { Toaster } from "react-hot-toast";
import { AddItemNavbar } from "../../store/navbarSlice";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { changeInformationUser } from "../../store/userSlice";
import { request, setAuthHeader } from "../../helpers/axios_helper";
import { getUser, setUserNoToken } from "../../store/userSlice";
import {
  getSelectedProductDetails,
  getTotalProductDetails,
  addToCart,
} from "../../store/cartSlice";
import { deleteProduct } from "../../store/cartDetailSlice";
import dayjs from "dayjs"; // Import thư viện Day.js
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const { confirm } = Modal;
var stompClient = null;
const CartPage = () => {
  // const { itemsCount, totalAmount } = useSelector(state => state.cart)
  const [productDetails, setProductDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [changeCount, setChangeCount] = useState(new Map());
  const [checkoutState, setCheckoutState] = useState(1);
  const account = getUser();
  const [voucher, setVoucher] = useState("");
  const [codeVoucher, setCodeVoucher] = useState("");
  const [paymentMethodCss, setPaymentMethodCss] = useState(1);
  const [bill, setBill] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalTemp, setTotatTemp] = useState(0);
  const [counpoun, setCounpoun] = useState("");

  // redux
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  // information bill
  const [informationBill, setInformationBill] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    note: "",
    ward: "",
    district: "",
    province: "",
    shipFee: "",
    receivedDate: "",
    wardSelected: "",
    districtSelected: "",
    provinesSelected: "",
  });

  // redux
  const productDetailsRedux = getSelectedProductDetails();
  const quantityRedux = useSelector((state) => state.cartDetail.quantity);
  const totalAmountRedux = Number(getTotalProductDetails());

  // connect websocket
  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe("/bill/bills", onMessageReceived);
  };

  const onMessageReceived = (payload) => {
    var data = JSON.parse(payload.body);
    // console.log(data)
  };

  const onError = (err) => {
    console.log(err);
  };

  useEffect(() => {
    console.log(account);
    if (account.id !== "") {
      getProductDetails();
    }
    if (stompClient === null) {
      connect();
    }
    if (account.id === "") {
      if (voucher === null || voucher === "" || voucher === undefined) {
        setTotalAmount(
          Number(totalAmountRedux) + Number(informationBill.shipFee)
        );
      } else {
        setTotalAmount(
          totalAmountRedux +
            informationBill.shipFee -
            Number(voucher.giaTriVoucher)
        );
      }
    }
  }, [totalAmount, productDetails]);

  const getProductDetails = async () => {
    if (productDetails.length !== 0) return;
    setProductDetails(getSelectedProductDetails);
    setTotalAmount(Number(getTotalProductDetails()));
    setTotatTemp(Number(getTotalProductDetails()));
  };

  const formatMoney = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  if (account.id !== "" && productDetails.length === 0) {
    return (
      <div className="container my-5">
        <div className="empty-cart flex justify-center align-center flex-column font-manrope">
          <img src={shopping_cart} alt="" />
          <span className="fw-6 fs-15 ">Giỏ hàng đang trống.</span>
          <Link
            to="/"
            className="shopping-btn text-white fw-5"
            style={{
              backgroundColor: `#128DE2`,
              border: "1px solid #128DE2",
              borderRadius: "10px",
            }}
          >
            Đi tới trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (account.id === "" && productDetailsRedux.length === 0) {
    return (
      <div className="container my-5">
        <div className="empty-cart flex justify-center align-center flex-column font-manrope">
          <img src={shopping_cart} alt="" />
          <span className="fw-6 fs-15 ">Giỏ hàng đang trống.</span>
          <Link
            to="/"
            className="shopping-btn text-white fw-5"
            style={{
              backgroundColor: `#128DE2`,
              border: "1px solid #128DE2",
              borderRadius: "10px",
            }}
          >
            Đi tới trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const checkoutStateButtonCssActive = () => {
    return {
      width: "100%",
      fontSize: 16,
      backgroundColor: "#128DE2",
    };
  };

  const checkoutStateButtonCssNoActive = () => {
    return {
      width: "100%",
      fontSize: 16,
      backgroundColor: "#707070",
    };
  };

  const checkoutStateTitleCssActive = () => {
    return {
      textAlign: `center`,
      width: `46%`,
      fontWeight: "600",
      color: "#128DE2",
    };
  };

  const checkoutStateTitleCssNoActive = () => {
    return {
      textAlign: `center`,
      width: `46%`,
      fontWeight: "600",
      color: "#707070",
    };
  };

  const handleRedirectPayment = (url) => {
    window.location.href = url;
  };

  const handleGetUrlRedirectPayment = async (ma) => {
    const vnpayReq = {
      total: parseInt(totalAmount),
      info: ma,
      code: ma,
    };
    try {
      request("POST", `/api/vnpay/payment-client`, vnpayReq, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        handleRedirectPayment(response.data.data);
      });
    } catch (error) {
      console.log(error.response.data);
    }

    

  };

  const orderSuccess = async () => {
    confirm({
      title: "Xác tạo đơn hàng mới",
      icon: <ExclamationCircleFilled />,
      content: "Bạn đồng ý với các thông tin và xác nhận tạo đơn hàng.",
      okText: "Xác nhận",
      cancelText: "Huỷ bỏ",
      style: {
        marginTop: "20px",
        width: "2000px",
      },
      onOk() {
        // success
        setIsLoadingRequest(false);
        let idOrder = "";
        const orderRequest = {
          tongTien:
            totalAmount +
            Number(voucher === "" ? 0 : voucher.giaTriVoucher) -
            informationBill.shipFee,
          tienThua: 0,
          tongTienSauKhiGiam:
            Number(totalAmount) - Number(informationBill.shipFee),
          tienKhachTra: totalAmount,
          trangThai: "PENDING_CONFIRM",
          loaiHoaDon: "DELIVERY",
          phiShip: informationBill.shipFee,
          ghiChu: informationBill.note,
          soDienThoaiNguoiNhan: informationBill.phone,
          tenNguoiNhan: informationBill.name,
          diaChiNguoiNhan: informationBill.address,
          quanHuyenNguoiNhan: informationBill.district,
          tinhThanhPhoNguoiNhan: informationBill.province,
          xaPhuongNguoiNhan: informationBill.ward,
          idKhachHang: account && account.id,
          ngayNhanHang: informationBill.receivedDate,
          isPayment: true,
          isUpdateInfo: false,
          isUpdateVoucher: false,
          voucher: voucher === "" ? null : voucher,
          paymentMethod: paymentMethodCss,
          email: account && account.email,
        };

        try {
          request("POST", `/client/bill/create-bill`, orderRequest)
            .then((response) => {
              var user = {
                ...account,
                soDienThoai: informationBill.phone,
              };
              dispatch(changeInformationUser(user));
              console.log(response);
              setBill(response.data);
              idOrder = response.data.id;
              if (idOrder !== "") {
                if (account.id === "") {
                  productDetailsRedux.forEach(async (e) => {
                    let productDetail = {
                      donGia: e.data.price,
                      soLuong: e.quantity,
                      thanhTien:
                        Number(e.data.priceDiscount) === 0
                          ? Number(e.data.price) * Number(e.quantity)
                          : Number(e.data.priceDiscount) * Number(e.quantity),
                      idSanPhamChiTiet: e.data.id,
                      idHoaDon: idOrder,
                      donGiaSauKhiGiam: e.data.priceDiscount,
                      idKhachHang: account.id,
                    };
                    try {
                      request(
                        "POST",
                        `/client/bill-detail/create-bill-detail`,
                        productDetail
                      ).then((response) => {
                        console.log(response);
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  });
                } else {
                  productDetails.forEach(async (e) => {
                    console.log(e);
                    let productDetail = {
                      donGia: e.donGia,
                      soLuong: e.soLuongSapMua,
                      thanhTien:
                        Number(e.donGiaSauKhuyenMai) === 0
                          ? Number(e.donGia) * Number(e.soLuongSapMua)
                          : Number(e.donGiaSauKhuyenMai) *
                            Number(e.soLuongSapMua),
                      idSanPhamChiTiet: e.idSanPhamChiTiet,
                      idHoaDon: idOrder,
                      donGiaSauKhiGiam: e.donGiaSauKhuyenMai,
                      idKhachHang: account.id,
                    };
                    try {
                      request(
                        "POST",
                        `/client/bill-detail/create-bill-detail`,
                        productDetail
                      ).then((response) => {
                        console.log(response);
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  });
                }

               
                if (paymentMethodCss === 2) {
                  handleGetUrlRedirectPayment(response.data.ma);
                }else{
                  request(
                    "GET",
                    `/client/bill-detail/send-email-bill?id_bill=${idOrder}`
                  )
                    .then((response) => {})
                    .catch((error) => {
                      console.log(error);
                    });
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } catch (error) {
          console.log(error);
          setUserNoToken();
        }

        deleteProductSelected();
        var hello = {
          name: "hello server",
        };

        if (stompClient) {
          stompClient.send("/app/bills", {}, JSON.stringify(hello));
        }
        if (paymentMethodCss === 1) {
          setTimeout(() => {
            setIsLoadingRequest(true);
            toast.success("Đặt hàng thành công");
            setCheckoutState(3);
          }, 800);
        }
      },
      onCancel() {
        console.log("Không đồng ý");
      },
    });
  };

  const checkVoucher = async () => {
    if (
      codeVoucher === "" ||
      codeVoucher === null ||
      codeVoucher === undefined
    ) {
      toast.error("Vui lòng nhập mã voucher");
      return;
    }

    if (codeVoucher.trim() === "") {
      toast.error("Vui lòng nhập mã voucher");
      return;
    }

    if (voucher !== null || voucher !== undefined || voucher !== "") {
      if (voucher.ma === codeVoucher) {
        toast.error(
          "Bạn đã sử dụng voucher này rồi.Vui lòng nhập voucher khác"
        );
        return;
      }
    }

    request("GET", `/client/voucher/check-voucher?code=${codeVoucher}`)
      .then((res) => {
        if (res.data.dieuKienApDung > totalAmount) {
          toast.error("Hoá đơn này không đạt đủ điều kiện áp dụng");
        } else {
          setCounpoun(res.data);
          let priceWhenAfterVoucherUsed =
            Number(totalAmount) - Number(res.data.giaTriVoucher);
          setTotalAmount(priceWhenAfterVoucherUsed);
          setVoucher(res.data);
          toast.success("Áp dụng voucher thành công.");
        }
      })
      .catch((error) => {
        // setUserNoToken();
        if (error.response.status === 400) toast.error(error.response.data);
      });
    
  };

  const paymentMethodSelected = () => {
    return {
      width: `170px`,
      border: `1px solid #126de4`,
      height: `54px`,
      borderRadius: `10px`,
      textAlign: "center",
    };
  };

  const paymentMethodNotSelected = () => {
    return {
      width: `170px`,
      border: `1px solid rgb(197 192 192)`,
      height: `54px`,
      borderRadius: `10px`,
      textAlign: "center",
    };
  };

  const stepCheckOutTwo = (data) => {
    setCheckoutState(2);
  };

  const changeValueInformationBill = (data) => {
    setInformationBill(data);
    console.log(data);
  };

  const setTotalCount = (data) => {
    if (account.id === "") {
      setTotalAmount(data);
    } else {
      console.log(data);
      setTotalAmount(totalTemp + data);
    }
  };

  const deleteCartDetail = async (product) => {
    if (account.id === "") {
      dispatch(deleteProduct(product));
    } else {
      if (product.idGioHangChiTiet !== null) {
        request(
          "DELETE",
          `/client/cart-detail/delete-cart-details?id_customer=${account.id}&id_cart_detail=${product.idGioHangChiTiet}`
        )
          .then((res) => {
            dispatch(addToCart());
          })
          .catch((res) => console.log(res));
      }
    }
  };

  const deleteProductSelected = () => {
    if (account.id === "") {
      productDetailsRedux.forEach((product) => {
        deleteCartDetail(product.data);
      });
    } else {
      productDetails.forEach((product) => {
        console.log(product);
        deleteCartDetail(product);
      });
    }
  };

  const getCountProductDetail = () => {
    if (account.id === "") {
      var count = 0;
      productDetailsRedux.forEach((item) => {
        count += Number(item.quantity);
      });
      return count;
    } else {
      var count = 0;
      productDetails.forEach((item) => {
        count += Number(item.soLuongSapMua);
      });
      return count;
    }
  };

  return (
    <>
      {isLoadingRequest === true ? (
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
      <>
        <h3
          className="text-center fw-5"
          style={{ marginTop: 30, marginBottom: -10 }}
        >
          {checkoutState === 3 ? (
            <></>
          ) : (
            <span>
              <i
                onClick={() => {
                  console.log(checkoutState);
                  if (checkoutState === 1) {
                    navigate("/cart");
                  } else if (checkoutState === 2) {
                    setCheckoutState(1);
                  }
                }}
                class="fa fa-arrow-left"
                style={{ transform: "translateX(-271px)" }}
              ></i>
            </span>
          )}

          <span style={{ fontWeight: 600 }}>
            {checkoutState === 1 ? "Thông tin" : ""}
            {checkoutState === 2 ? "Thanh toán" : ""}
            {checkoutState === 3 ? "Hoàn thành" : ""}
          </span>
        </h3>

        <Divider
          style={{ margin: " 10px auto", width: "45%", minWidth: "45%" }}
        />
        {checkoutState === 3 ? (
          <></>
        ) : (
          <div
            className="title_checkout"
            onClick={() => {
              setCheckoutState(1);
            }}
          >
            <div
              style={
                checkoutState === 1
                  ? checkoutStateTitleCssActive()
                  : checkoutStateTitleCssNoActive()
              }
            >
              1. Thông tin
              <Button
                variant="contained"
                style={
                  checkoutState === 1
                    ? checkoutStateButtonCssActive()
                    : checkoutStateButtonCssNoActive()
                }
              ></Button>
            </div>

            <div
              style={
                checkoutState === 2
                  ? checkoutStateTitleCssActive()
                  : checkoutStateTitleCssNoActive()
              }
            >
              2. Thanh toán
              <Button
                variant="contained"
                style={
                  checkoutState === 2
                    ? checkoutStateButtonCssActive()
                    : checkoutStateButtonCssNoActive()
                }
              ></Button>
            </div>
          </div>
        )}

        {checkoutState === 3 ? (
          <>
            <div
              className="container"
              style={{
                margin: `20px auto`,
                width: `50%`,
                borderRadius: "10px",
              }}
            >
              {/* <img src="../../assets/images/Shippe.png"/> */}
              <div
                className="cart bg-white"
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "600",
                  padding: `27px`,
                  backgroundColor: "rgba(255, 193, 7, 0.12)",
                }}
              >
                Đơn hàng đang được xử lí
              </div>
            </div>
          </>
        ) : (
          <> </>
        )}

        {checkoutState === 1 ? (
          <div
            className="container"
            style={{ margin: `20px auto`, width: `50%`, borderRadius: "10px" }}
          >
            <div className="cart bg-white">
              <div className="cart-ctable">
                <div className="cart-cbody bg-white">
                  {account.id !== "" &&
                    productDetails.map((product) => {
                      return (
                        <>
                          <div
                            className="cart-ctr"
                            key={product?.id}
                            style={{ marginTop: 10 }}
                          >
                            <div className="cart-ctd">
                              <img
                                style={{ width: 112, height: 105 }}
                                src={product.duongDan}
                              />
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
                                <div style={{ width: "127%", marginTop: 17 }}>
                                  <span className="cart-ctxtf fw-7">
                                    {product?.tenSanPham +
                                      " " +
                                      product?.dungLuongRam +
                                      "GB " +
                                      product?.dungLuongRom +
                                      "GB - " +
                                      product?.tenMauSac}
                                  </span>
                                  <br />
                                  <span>
                                    <span
                                      className="cart-ctxt"
                                      style={{
                                        color: "#128DE2",
                                        fontSize: "17px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {formatMoney(
                                        product?.donGiaSauKhuyenMai === 0
                                          ? product?.donGia
                                          : product?.donGiaSauKhuyenMai
                                      )}
                                    </span>
                                    <del
                                      style={{
                                        color: "#999",
                                        fontSize: "14px",
                                        marginLeft: "5px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {product?.donGiaSauKhuyenMai === 0
                                        ? ""
                                        : formatMoney(product?.donGia)}
                                    </del>
                                  </span>
                                </div>
                                <div
                                  style={{
                                    width: "58%",
                                    marginTop: 42,
                                    fontWeight: 500,
                                  }}
                                >
                                  Số lượng :
                                  <span style={{ color: "#128DE2" }}>
                                    {" " + product?.soLuongSapMua}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="cart-ctd"></div>
                            <div className="cart-ctd"></div>

                            <div className="cart-ctd"></div>
                          </div>
                        </>
                      );
                    })}

                  {account.id === "" &&
                    productDetailsRedux.map((product) => {
                      return (
                        <>
                          <div
                            className="cart-ctr"
                            key={product?.id}
                            style={{ marginTop: 10 }}
                          >
                            <div className="cart-ctd">
                              <img
                                style={{ width: 112, height: 105 }}
                                src={product.data.urlImage}
                              />
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
                                <div style={{ width: "127%", marginTop: 17 }}>
                                  <span className="cart-ctxtf fw-7">
                                    {product?.data.nameProduct +
                                      " " +
                                      product?.data.ram +
                                      "GB " +
                                      product?.data.rom +
                                      "GB - " +
                                      product?.data.color}
                                  </span>
                                  <br />
                                  <span>
                                    <span
                                      className="cart-ctxt"
                                      style={{
                                        color: "#128DE2",
                                        fontSize: "17px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {formatMoney(
                                        product?.data.priceDiscount === 0
                                          ? product?.data.price
                                          : product?.data.priceDiscount
                                      )}
                                    </span>
                                    <del
                                      style={{
                                        color: "#999",
                                        fontSize: "14px",
                                        marginLeft: "5px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {product?.data.priceDiscount === 0
                                        ? ""
                                        : formatMoney(product?.data.price)}
                                    </del>
                                  </span>
                                </div>
                                <div
                                  style={{
                                    width: "58%",
                                    marginTop: 42,
                                    fontWeight: 500,
                                  }}
                                >
                                  Số lượng :
                                  <span style={{ color: "#128DE2" }}>
                                    {" " + product?.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="cart-ctd"></div>
                            <div className="cart-ctd"></div>

                            <div className="cart-ctd"></div>
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
            </div>

            <Checkout
              account={account}
              informationBill={informationBill}
              stepCheckOutTwo={stepCheckOutTwo}
              totalAmount={totalAmount}
              changeValueInformationBill={changeValueInformationBill}
              setTotalCount={setTotalCount}
            />
            <br />
            <br />

            <br />
          </div>
        ) : (
          <> </>
        )}

        {checkoutState === 2 ? (
          <>
            <div
              className="cart bg-white"
              style={{
                padding: 15,
                margin: `5px auto`,
                width: `47%`,
                borderRadius: "10px",
              }}
            >
              <div>
                <Input
                  placeholder="Nhập mã giảm giá hoặc phiếu mua hàng"
                  onChange={(e) => {
                    setCodeVoucher(e.target.value);
                  }}
                  value={codeVoucher}
                  style={{
                    width: "75%",
                    margin: `0px 0px`,
                    fontSize: 16,
                    top: "12px",
                    height: 40,
                  }}
                />
                <Button
                  variant="contained"
                  style={{
                    width: "20%",
                    marginLeft: 15,
                    marginTop: 17,
                    fontSize: 16,
                  }}
                  onClick={checkVoucher}
                >
                  Áp dụng
                </Button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}>
                  Số lượng sản phẩm
                </div>

                <div style={{ style: "#707070" }}>
                  {" "}
                  {getCountProductDetail()}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}>
                  Tiền hàng (tạm tính)
                </div>

                <div style={{ style: "#707070" }}>
                  {formatMoney(
                    totalAmount +
                      Number(voucher === "" ? 0 : voucher.giaTriVoucher) -
                      Number(informationBill.shipFee)
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div
                  style={{
                    color: "rgb(155 148 148)",
                    marginLeft: "-12px",
                  }}
                >
                  Phí vận chuyển
                </div>

                <div style={{ style: "#707070" }}>
                  {informationBill.shipFee === 0
                    ? "Miễn phí"
                    : formatMoney(informationBill.shipFee)}
                </div>
              </div>

              {voucher && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: 15,
                  }}
                >
                  <div
                    style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                  >
                    Phiếu giảm giá
                  </div>

                  <div style={{ color: "red" }}>
                    <div class="cardCoupoun">
                      <div class="main">
                        <div class="co-img">
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/uploadimage-575f0.appspot.com/o/xanh.png?alt=media&token=6d6a830f-d774-497e-a423-5221a06beedf"
                            alt=""
                          />
                        </div>
                        <div class="vertical"></div>
                        <div class="content">
                          <h5>{counpoun.ten}</h5>
                          <>
                            <span>{formatMoney(counpoun.giaTriVoucher)}</span>
                          </>
                          <p>
                            Giá trị đến{" "}
                            {dayjs(counpoun.ngayKetThuc).format("DD/MM/YYYY")}{" "}
                          </p>
                        </div>
                      </div>
                      <div class="copy-button">
                        <input
                          id="copyvalue"
                          type="text"
                          readonly
                          value={counpoun.ma}
                        />
                        <button
                          onClick={() => {
                            setVoucher("");
                            var temp =
                              Number(totalAmount) +
                              Number(counpoun.giaTriVoucher);
                            setTotalAmount(temp);
                            setCodeVoucher("");
                          }}
                          class="copybtn"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Divider />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div>
                  <span style={{ marginLeft: "-12px", fontWeight: 600 }}>
                    Tổng tiền
                  </span>
                  <span style={{ color: "rgb(155 148 148)" }}>
                    (đã gồm VAT)
                  </span>
                </div>

                <div style={{ marginLeft: "-12px", fontWeight: 600 }}>
                  {formatMoney(totalAmount)}
                </div>
              </div>
            </div>

            <div
              style={{
                margin: `10px auto`,
                width: `47%`,
                borderRadius: "10px",
              }}
            >
              HÌNH THỨC THANH TOÁN
            </div>

            <div
              className="cart bg-white"
              style={{
                padding: 15,
                margin: `5px auto`,
                width: `47%`,
                borderRadius: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div
                  style={
                    paymentMethodCss === 1
                      ? paymentMethodSelected()
                      : paymentMethodNotSelected()
                  }
                  onClick={() => {
                    setPaymentMethodCss(1);
                  }}
                >
                  <LocalAtmOutlinedIcon
                    style={{
                      fontSize: "27px",
                      position: "relative",
                      padding: 3,
                      left: "61px",
                      color: "#444",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      position: "relative",
                      top: "15px",
                      left: "-13px",
                    }}
                  >
                    Thanh toán khi nhận hàng
                  </span>
                </div>

                <div
                  style={
                    paymentMethodCss === 2
                      ? paymentMethodSelected()
                      : paymentMethodNotSelected()
                  }
                  onClick={() => {
                    setPaymentMethodCss(2);
                  }}
                >
                  <img
                    src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg"
                    style={{
                      width: "69%",
                      marginLeft: "20px",
                      marginTop: "10px",
                    }}
                  />
                </div>

                <div></div>
              </div>
            </div>

            <div
              style={{
                color: `#212b36`,
                fontSize: `16px`,
                fontWeight: `500`,
                lineHeight: `18px`,
                marginBottom: `10px`,
                marginTop: `15px`,
                textTransform: `uppercase`,
                margin: `10px auto`,
                width: `47%`,
              }}
            >
              THÔNG TIN NHẬN HÀNG
            </div>

            <div
              className="cart bg-white"
              style={{
                padding: 15,
                margin: `5px auto`,
                width: `47%`,
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}>
                  Khách hàng
                </div>

                <div style={{ style: "#707070" }}>{informationBill?.name}</div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}>
                  Số điện thoại
                </div>

                <div style={{ style: "#707070" }}>{informationBill?.phone}</div>
              </div>

              {informationBill.email === null ||
              informationBill.email === "" ? (
                <> </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: 15,
                  }}
                >
                  <div
                    style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                  >
                    Email
                  </div>

                  <div style={{ style: "#707070" }}>
                    {informationBill?.email}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div
                  style={{
                    color: "rgb(155 148 148)",
                    marginLeft: "-12px",
                  }}
                >
                  Thời gian nhận hàng dự kiến
                </div>

                <div style={{ style: "#707070" }}>
                  {informationBill?.receivedDate}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 15,
                }}
              >
                <div style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}>
                  Nhận hàng tại
                </div>

                <div
                  style={{
                    style: "#707070",
                    wordWrap: "wrap",
                    width: "300px",
                    textAlign: "right",
                  }}
                >
                  {informationBill?.address}, {informationBill?.ward},{" "}
                  {informationBill?.district}, {informationBill?.province}
                </div>
              </div>

              {informationBill.note === null || informationBill.note === "" ? (
                <> </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: 15,
                  }}
                >
                  <div
                    style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                  >
                    Ghi chú
                  </div>

                  <div style={{ style: "#707070" }}>{informationBill.note}</div>
                </div>
              )}
            </div>
            <br />
            <div
              className="countProductTemp"
              style={{ left: 391, width: "710px", display: "block" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>Tổng tiền</span>
                <span style={{ fontWeight: "bold", color: "#128DE2" }}>
                  {formatMoney(totalAmount)}
                </span>
              </div>
              <div>
                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    marginTop: 5,
                    fontSize: 16,
                  }}
                  onClick={orderSuccess}
                >
                  Hoàn thành
                </Button>
              </div>
            </div>
            <br />
            <br />
            <br />
          </>
        ) : (
          <></>
        )}

        {checkoutState === 3 ? (
          <>
            {bill === null || bill === undefined ? (
              <></>
            ) : (
              <>
                <div
                  style={{
                    color: `#212b36`,
                    width: "46%",
                    margin: "0 auto",
                    fontSize: `16px`,
                    fontWeight: `500`,
                    lineHeight: `18px`,
                    marginBottom: `10px`,
                    marginTop: `15px`,
                    textTransform: `uppercase`,
                  }}
                >
                  THÔNG TIN ĐƠN HÀNG
                </div>

                <div
                  className="cart bg-white"
                  style={{
                    padding: 15,
                    margin: `5px auto`,
                    width: `47%`,
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div>
                      <span style={{ marginLeft: "-12px", fontWeight: 600 }}>
                        Mã đơn hàng
                      </span>
                    </div>

                    <div style={{ marginLeft: "-12px", fontWeight: 600 }}>
                      {bill.ma}
                    </div>
                  </div>

                  <Divider />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                    >
                      Số lượng sản phẩm
                    </div>

                    <div style={{ style: "#707070" }}>
                      {" "}
                      {getCountProductDetail()}
                    </div>
                  </div>

                  {voucher && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: 15,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(155 148 148)",
                          marginLeft: "-12px",
                        }}
                      >
                        Phiếu giảm giá
                      </div>

                      <div style={{ color: "red" }}>
                        - {formatMoney(voucher?.giaTriVoucher)}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                    >
                      Tổng tiền
                    </div>

                    <div style={{ style: "#707070" }}>
                      {formatMoney(totalAmount - informationBill.shipFee)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                    >
                      Phí vận chuyển
                    </div>

                    <div style={{ style: "#707070" }}>
                      {formatMoney(informationBill.shipFee)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                    >
                      Hình thức thanh toán
                    </div>

                    <div style={{ style: "#707070" }}>
                      {paymentMethodCss === 1
                        ? "Thanh toán khi nhận hàng"
                        : "Thanh toán online"}
                    </div>
                  </div>

                  <Divider />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div>
                      <span style={{ marginLeft: "-12px", fontWeight: 600 }}>
                        Cần thanh toán
                      </span>
                    </div>

                    <div style={{ marginLeft: "-12px", fontWeight: 600 }}>
                      {formatMoney(totalAmount)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    color: `#212b36`,
                    width: "46%",
                    margin: "0 auto",
                    fontSize: `16px`,
                    fontWeight: `500`,
                    lineHeight: `18px`,
                    marginBottom: `10px`,
                    marginTop: `15px`,
                    textTransform: `uppercase`,
                  }}
                >
                  THÔNG TIN NHẬN HÀNG
                </div>

                <div
                  className="cart bg-white"
                  style={{
                    padding: 15,
                    margin: `5px auto`,
                    width: `47%`,
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                    >
                      Khách hàng
                    </div>

                    <div style={{ style: "#707070" }}>
                      {informationBill.name}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                    >
                      Số điện thoại
                    </div>

                    <div style={{ style: "#707070" }}>
                      {informationBill.phone}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{
                        color: "rgb(155 148 148)",
                        marginLeft: "-12px",
                      }}
                    >
                      Thời gian nhận hàng dự kiến
                    </div>

                    <div style={{ style: "#707070" }}>
                      {informationBill?.receivedDate}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: 15,
                    }}
                  >
                    <div
                      style={{ color: "rgb(155 148 148)", marginLeft: "-12px" }}
                    >
                      Nhận hàng tại
                    </div>

                    <div
                      style={{
                        style: "#707070",
                        wordWrap: "wrap",
                        width: "300px",
                        textAlign: "right",
                      }}
                    >
                      {informationBill.address}, {informationBill.ward},{" "}
                      {informationBill.district}, {informationBill.province}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    margin: `10px auto`,
                    width: `47%`,
                    borderRadius: "10px",
                  }}
                >
                  DANH SÁCH SẢN PHẨM
                </div>

                <div
                  className="cart bg-white"
                  style={{ width: "47%", margin: "0 auto" }}
                >
                  <div className="cart-ctable">
                    <div className="cart-cbody bg-white">
                      {account.id !== "" &&
                        productDetails.map((product) => {
                          return (
                            <>
                              <div
                                className="cart-ctr"
                                key={product?.id}
                                style={{ marginTop: 10 }}
                              >
                                <div className="cart-ctd">
                                  <img
                                    style={{ width: 112, height: 105 }}
                                    src={product.duongDan}
                                  />
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
                                    <div
                                      style={{ width: "127%", marginTop: 17 }}
                                    >
                                      <span className="cart-ctxtf fw-7">
                                        {product?.tenSanPham +
                                          " " +
                                          product?.dungLuongRam +
                                          "GB " +
                                          product?.dungLuongRom +
                                          "GB - " +
                                          product?.tenMauSac}
                                      </span>
                                      <br />
                                      <span>
                                        <span
                                          className="cart-ctxt"
                                          style={{
                                            color: "#128DE2",
                                            fontSize: "17px",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {formatMoney(
                                            product?.donGiaSauKhuyenMai === 0
                                              ? product?.donGia
                                              : product?.donGiaSauKhuyenMai
                                          )}
                                        </span>
                                        <del
                                          style={{
                                            color: "#999",
                                            fontSize: "14px",
                                            marginLeft: "5px",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {product?.donGiaSauKhuyenMai === 0
                                            ? ""
                                            : formatMoney(product?.donGia)}
                                        </del>
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        width: "58%",
                                        marginTop: 42,
                                        fontWeight: 500,
                                      }}
                                    >
                                      Số lượng :
                                      <span style={{ color: "#128DE2" }}>
                                        {" " + product?.soLuongSapMua}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="cart-ctd"></div>
                                <div className="cart-ctd"></div>

                                <div className="cart-ctd"></div>
                              </div>
                            </>
                          );
                        })}

                      {account.id === "" &&
                        productDetailsRedux.map((product) => {
                          return (
                            <>
                              <div
                                className="cart-ctr"
                                key={product?.id}
                                style={{ marginTop: 10 }}
                              >
                                <div className="cart-ctd">
                                  <img
                                    style={{ width: 112, height: 115 }}
                                    src={product.data.urlImage}
                                  />
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
                                    <div
                                      style={{ width: "127%", marginTop: 17 }}
                                    >
                                      <span className="cart-ctxtf fw-7">
                                        {product?.data.nameProduct +
                                          " " +
                                          product?.data.ram +
                                          "GB " +
                                          product?.data.rom +
                                          "GB - " +
                                          product?.data.color}
                                      </span>
                                      <br />
                                      <span>
                                        <span
                                          className="cart-ctxt"
                                          style={{
                                            color: "#128DE2",
                                            fontSize: "17px",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {formatMoney(
                                            product?.data.priceDiscount === 0
                                              ? product?.data.price
                                              : product?.data.priceDiscount
                                          )}
                                        </span>
                                        <del
                                          style={{
                                            color: "#999",
                                            fontSize: "14px",
                                            marginLeft: "5px",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {product?.data.priceDiscount === 0
                                            ? ""
                                            : formatMoney(product?.data.price)}
                                        </del>
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        width: "58%",
                                        marginTop: 42,
                                        fontWeight: 500,
                                      }}
                                    >
                                      Số lượng :
                                      <span style={{ color: "#128DE2" }}>
                                        {" " + product?.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="cart-ctd"></div>
                                <div className="cart-ctd"></div>

                                <div className="cart-ctd"></div>
                              </div>
                            </>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <br />

                <div
                  className="countProductTemp"
                  style={{
                    left: 395,
                    width: "47%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    style={{
                      width: "48%",
                      marginTop: 5,
                      fontSize: 14,
                    }}
                    onClick={() => {
                      if (account.id === "") {
                      }
                      navigate("/");
                    }}
                  >
                    Tiếp tục mua hàng
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: "48%",
                      marginTop: 5,
                      fontSize: 14,
                    }}
                    onClick={() => {
                      if (account.id === "") {
                        // dispatch(resetAllCartDetail())
                      }
                      navigate(`/look-up-order-page/${bill.ma}`);
                      var data = [
                        {
                          path: `/look-up-order-page/${bill.ma}`,
                          name: `Đơn hàng ${bill.ma}`,
                        },
                      ];
                      dispatch(AddItemNavbar(data));
                    }}
                  >
                    Kiểm tra đơn hàng
                  </Button>
                </div>
                <br />
                <br />
              </>
            )}
          </>
        ) : (
          <></>
        )}

        {/* toaster */}
        {checkoutState === 2 || checkoutState === 3 ? (
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
                duration: 3000,
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
                duration: 3000,
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
        ) : (
          <></>
        )}
      </>
    </>
  );
};

export default CartPage;
