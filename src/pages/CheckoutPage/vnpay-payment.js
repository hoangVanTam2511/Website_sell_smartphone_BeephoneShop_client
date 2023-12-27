import React, { useState, useEffect, useRef } from "react";
import "../CartPage/CartPage.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Divider } from "antd";
import moment from "moment";
import { request } from "../../helpers/axios_helper";
import Button from "@mui/material/Button";
import { AddItemNavbar } from "../../store/navbarSlice";
import { useDispatch } from "react-redux";
import { SetSelectedCart } from "../../store/cartSlice";
import "../CartPage/CartPage.scss";
import "./CheckoutPage.css";
import { underscore } from "i/lib/methods";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import dayjs from "dayjs"; // Import thư viện Day.js

const CartPage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderCode, setOrderCode] = useState(searchParams.get("vnp_TxnRef"));
  const [orderInfo, setOrderInfo] = useState(searchParams.get("vnp_OrderInfo"));
  const [orderTotal, setOrderTotal] = useState(searchParams.get("vnp_Amount"));
  const [orderTransaction, setOrderTransaciton] = useState(
    searchParams.get("vnp_TransactionNo")
  );
  const [datePayment, setDatePayment] = useState(
    searchParams.get("vnp_PayDate")
  );
  const [status, setStatus] = useState(
    searchParams.get("vnp_TransactionStatus")
  );
  const [bill, setBill] = useState();

  const [code, setCode] = useState("");
  const [info, setInfo] = useState("");
  const [total, setTotal] = useState("");
  const [transaction, setTransaction] = useState("");
  const [date, setDate] = useState("");
  const [state, setState] = useState("");

  const momentDate = moment(date, "YYYYMMDDHHmmss");

  const outputDate = momentDate.format("HH:mm:ss - DD/MM/YYYY");

  const isMounted = useRef(false);

  const handleRedirectPayment = (url) => {
    window.location.href = url;
  };

  const updatePaymentOrder = async () => {
    setIsLoading(true);
    const vnpayReq = {
      total: parseInt(orderTotal),
      code: orderCode,
      info: orderInfo,
      paymentTime: datePayment,
      transactionId: orderTransaction,
      transactionStatus: status,
      personConfirm: null,
    };
    try {
      request("PUT", `/api/vnpay/update-order-client`, vnpayReq, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        const data = response.data.data;
        setIsLoading(false);
        setCode(data.orderCode);
        setTotal(data.totalPrice);
        setDate(data.paymentTime);
        setTransaction(data.transactionId);
        setState(data.status);
        setInfo(data.orderInfo);
        console.log(data);
        getBillAfterBuy(data.orderInfo, data.status);
      });
    } catch (error) {
      const message = error.response.data.message;
      setIsLoading(false);
      console.log(error.response.data);
    }
  };

  const handleGetUrlRedirectPayment = async () => {
    setIsLoading(true);
    const vnpayReq = {
      total: parseInt(orderTotal / 100),
      info: orderInfo,
      code: orderCode,
    };
    try {
      request("POST", `/api/vnpay/payment-client`, vnpayReq, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          setIsLoading(false);
          handleRedirectPayment(response.data.data);
        })
        .catch((error) => {});
    } catch (error) {
      const message = error.response.data.message;
      setIsLoading(false);
      console.log(error.response.data);
    }
  };

  const formatMoney = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  const getBillAfterBuy = async (id_bill, status) => {
    await request(
      "GET",
      `/client/bill/get-order-after-buy?id_bill=${id_bill}`
    ).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setBill(response.data);
        if (status == "01") {
          request(
            "PUT",
            `/client/bill/update-state-bill?id_bill=${response.data.id}`
          )
            .then((response) => {})
            .catch((error) => {
              console.log(error);
            });
        } else {
          request(
            "GET",
            `/client/bill-detail/send-email-bill?id_bill=${response.data.id}`
          )
            .then((response) => {})
            .catch((error) => {
              console.log(error);
            });
        }
      }
    });
  };

  useEffect(() => {
    dispatch(SetSelectedCart(1));
    if (!isMounted.current) {
      isMounted.current = true;
      updatePaymentOrder();
    } else {
    }
  }, []);

  return (
    <>
      {state === "01" ? (
        <div
          className="container"
          style={{
            margin: `20px auto`,
            width: `50%`,
            borderRadius: "10px",
          }}
        >
          <div
            className="cart bg-white"
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "600",
              padding: `27px`,
              backgroundColor: "white",
            }}
          >
            <div
              className="mt-4"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 0.1rem 0.3rem #00000010",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="img-success">
                  {!isLoading && state === "00" ? (
                    <img
                      style={{ width: "90px", height: "90px" }}
                      src="https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png"
                    />
                  ) : !isLoading && state === "01" ? (
                    <img
                      style={{ width: "90px", height: "90px" }}
                      src="https://www.freeiconspng.com/uploads/round-error-icon-16.jpg"
                    />
                  ) : null}
                </div>
                <div className="header-sucess mt-3">
                  <span style={{ fontSize: "25px", fontWeight: "500" }}>
                    {!isLoading && state === "00"
                      ? "Thanh toán thành công"
                      : !isLoading && state === "01"
                      ? "Thanh toán thất bại"
                      : null}
                  </span>
                </div>
                <div className="content-order-code mt-3">
                  Mã đơn hàng:{" "}
                  <span className="" style={{ fontWeight: "500" }}>
                    {"#"}
                    {!isLoading && info}
                  </span>
                </div>

                {!isLoading && state === "00" && (
                  <div className="content-order-total mt-3">
                    Số tiền thanh toán:{" "}
                    <span style={{ fontWeight: "500", color: "#dc1111" }}>
                      {total &&
                        total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </span>
                  </div>
                )}

                {!isLoading && state === "00" && (
                  <div className="content-order-transaction mt-3">
                    Mã giao dịch:
                    <span className="" style={{ fontWeight: "500" }}>
                      {" " + transaction}
                    </span>
                  </div>
                )}
                <div className="content-order-date-payment mt-3">
                  Thời gian:
                  <span
                    className=""
                    style={{ fontWeight: "500" }}
                  >{` ${outputDate}`}</span>
                </div>
                {!isLoading && state === "00" ? (
                  <Button
                    onClick={() => {
                      navigate(`/dashboard/point-of-sales/${info}`);
                    }}
                    className="button-mui mt-4"
                    type="primary"
                    style={{ height: "47px", width: "250px", fontSize: "15px" }}
                  >
                    <span
                      className=""
                      style={{
                        marginBottom: "2px",
                        fontWeight: "400",
                        fontSize: "17px",
                      }}
                    >
                      TIẾP TỤC
                    </span>
                  </Button>
                ) : (
                  <>
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
                          handleGetUrlRedirectPayment();
                        }}
                      >
                        Thanh toán lại
                      </Button>
                    </div>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <div className="mt-4"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <>
            <div
              className="container"
              style={{
                margin: `20px auto`,
                width: `50%`,
                borderRadius: "10px",
              }}
            >
              <div
                className="cart bg-white"
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "600",
                  padding: `27px`,
                  backgroundColor: "white",
                }}
              >
                <div className="img-success">
                  {!isLoading && state === "00" ? (
                    <img
                      style={{
                        width: "35px",
                        height: "35px",
                        margin: "0 auto",
                        marginBottom: "8px",
                      }}
                      src="https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png"
                    />
                  ) : !isLoading && state === "01" ? (
                    <img
                      style={{ width: "90px", height: "90px" }}
                      src="https://www.freeiconspng.com/uploads/round-error-icon-16.jpg"
                    />
                  ) : null}
                </div>
                Thanh toán thành công
              </div>
            </div>
          </>
          <>
            {bill === null || bill === undefined ? (
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
                      {bill.codeOrder}
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
                      {bill.quantityProduct}
                    </div>
                  </div>

                  {bill.totalPrice > bill.totalPriceAfterPrice ? (
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
                        -{" "}
                        {formatMoney(
                          bill.totalPrice - bill.totalPriceAfterPrice
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
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
                      {formatMoney(bill.totalPriceAfterPrice)}
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
                      {formatMoney(bill.shipFee)}
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

                    <div style={{ style: "#707070" }}>Thanh toán online</div>
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
                        Số tiền thanh toán
                      </span>
                    </div>

                    <div style={{ marginLeft: "-12px", fontWeight: 600 }}>
                      {total &&
                        total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
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

                    <div style={{ style: "#707070" }}>{bill.name}</div>
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

                    <div style={{ style: "#707070" }}>{bill.phoneNumber}</div>
                  </div>

                  {/* <div
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
                      {dayjs(bill.deliveryDate).format("DD/MM/YYYY")}
                    </div>
                  </div> */}

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
                      {bill.address}
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
                      {bill.products.map((product) => {
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
                                        product?.ram +
                                        "GB " +
                                        product?.rom +
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
                                          product?.donGiaSauGiam === 0
                                            ? product?.donGia
                                            : product?.donGiaSauGiam
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
                                        {product?.donGiaSauGiam === 0
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
                                      {" " + product?.soLuong}
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
                    left: 391,
                    width: "710px",
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
                      navigate(`/look-up-order-page/${bill.codeOrder}`);
                      var data = [
                        {
                          path: `/look-up-order-page/${bill.codeOrder}`,
                          name: `Đơn hàng ${bill.codeOrder}`,
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
        </>
      )}
    </>
  );
};

export default CartPage;
