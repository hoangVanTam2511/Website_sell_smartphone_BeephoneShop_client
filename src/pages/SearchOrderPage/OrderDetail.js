import React, { useEffect, useState } from "react";
import "./OrderDetail.css";
import { Divider, DatePicker } from "antd";
import axios from "axios";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { request, setAuthHeader } from "../../helpers/axios_helper";
import { setUserNoToken } from "../../store/userSlice";

var stompClient = null;
const OrderDetail = (props) => {
  const [bill, setBill] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  const [state3, setState3] = useState();
  const [state4, setState4] = useState();
  const [stateSelected, setStateSelected] = useState(0);
  const [changeRealTime, setChangeRealTime] = useState("");

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
    setChangeRealTime(data.name);
  };

  const onError = (err) => {
    console.log(err);
  };

  useEffect(() => {
    setBill(props.id_bill);
    getOrderHistory();
    console.log(props.id_bill);
    getProductDetails();
    if (stompClient === null) {
      connect();
    }
    console.log(props.id_bill.orderItems);
  }, []);

  const formatMoney = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  const formatDate = (data) => {
    var dateOfTime = new Date(data);
    var date =
      dateOfTime.getDate() +
      "-" +
      (dateOfTime.getMonth() + 1) +
      "-" +
      dateOfTime.getFullYear();
    var time = dateOfTime.getHours() + ":" + dateOfTime.getMinutes();
    return time + " " + date;
  };

  const formatDay = (data) => {
    var dateOfTime = new Date(data);
    var date =
      dateOfTime.getDate() +
      "/" +
      (dateOfTime.getMonth() + 1) +
      "/" +
      dateOfTime.getFullYear();
    return date;
  };

  const getOrderHistory = async () => {
    if (props.id_bill.orderHistories.length === 0) return;

    let max =
      props.id_bill.orderHistories[props.id_bill.orderHistories.length - 1];
    request("GET", `/client/bill/get-order-history?id_bill=${props.id_bill.ma}`)
      .then((res) => {
        console.log(res.data);
        res.data.map((item, index) => {
          if (Number(item.loaiThaoTac) === 0) {
            setState1(item);
          }

          if (Number(item.loaiThaoTac) === 1) {
            setState2(item);
          }

          if (Number(item.loaiThaoTac) === 3) {
            setState3(item);
          }

          if (Number(item.loaiThaoTac) === 4) {
            setState4(item);
          }

          if (Number(item.loaiThaoTac) > Number(max.loaiThaoTac)) {
            max = item;
          }
        });
        setStateSelected(max);
      })
      .catch((error) => {
        setUserNoToken();
        console.log(error);
      });
  };

  const getProductDetails = async () => {
    request(
      "GET",
      `/client/bill-detail/get-product-details?id_bill=${props.id_bill.id}`
    )
      .then((res) => {
        if (res.status === 200) {
          setProductDetails(res.data);
        }
        console.log(res);
      })
      .catch((error) => {
        setUserNoToken();
        console.log(error);
      });
  };

  return (
    <>
      <div class="card bg-white" style={{ width: "100%" }}>
        <div
          style={{
            width: "98%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "34%",
              fontWeight: "600",
              position: "relative",
              zIndex: 667,
            }}
            onClick={() => {
              props.setTab(null);
            }}
          >
            <i class="fa fa-arrow-left"></i>
          </div>

          <div style={{ width: "89%", fontWeight: "600" }}>
            Chi tiết đơn hàng {bill.ma} -{" "}
            <span style={{ color: "orange" }}> {stateSelected.thaoTac}</span>
          </div>
        </div>
        <Divider />

        <div style={{ marginLeft: "6%", width: "100%", marginBottom: "107px" }}>
          <ul class="steps">
            <li className={state1 ? "active" : "no_active"}>
              <div
                class={
                  state1
                    ? "img"
                    : Number(stateSelected.loaiThaoTac + 1) === 1
                    ? "img_pending"
                    : "img_no_active"
                }
              >
                <i class="fa fa-file-invoice"></i>
              </div>
              <div class="caption">
                <span className="text-top">Đơn hàng đã đặt</span>
                {state1 && (
                  <span className="text-bottom" style={{ marginLeft: "-26px" }}>
                    {formatDate(state1.createdAt)}
                  </span>
                )}
              </div>
            </li>

            <li className={state2 ? "active" : "no_active"}>
              <div
                class={
                  state2
                    ? "img"
                    : Number(stateSelected.loaiThaoTac + 1) === 1
                    ? "img_pending"
                    : "img_no_active"
                }
              >
                <i
                  class="fa fa-money-check"
                  style={{ transform: `translateY(4px)` }}
                ></i>
              </div>
              <div class="caption">
                <span className="text-top" style={{ marginLeft: "-32px" }}>
                  Chờ xác nhận
                </span>
                {state2 && (
                  <span className="text-bottom" style={{ marginLeft: "-31px" }}>
                    {formatDate(state2.createdAt)}
                  </span>
                )}
              </div>
            </li>

            <li className={state3 ? "active" : "no_active"}>
              <div
                class={
                  state3
                    ? "img"
                    : Number(stateSelected.loaiThaoTac + 1) === 2
                    ? "img_pending"
                    : "img_no_active"
                }
              >
                <i class="fa fa-inbox"></i>
              </div>
              <div class="caption">
                <span className="text-top" style={{ marginLeft: "-38px" }}>
                  Chờ giao hàng
                </span>
                {state3 && (
                  <span className="text-bottom" style={{ marginLeft: "-35px" }}>
                    {formatDate(state3.createdAt)}
                  </span>
                )}
              </div>
            </li>

            <li className={state4 ? "active" : "no_active"}>
              <div
                class={
                  state4
                    ? "img"
                    : Number(stateSelected.loaiThaoTac + 1) === 4
                    ? "img_pending"
                    : "img_no_active"
                }
              >
                <i
                  class="fa fa-shipping-fast"
                  style={{ marginTop: "11px" }}
                ></i>
              </div>
              <div class="caption">
                <span className="text-top" style={{ marginLeft: "-30px" }}>
                  Vận chuyển
                </span>
                {state4 && (
                  <span className="text-bottom" style={{ marginLeft: "-33px" }}>
                    {formatDate(state4.createdAt)}
                  </span>
                )}
              </div>
            </li>

            <li className={state4 ? "active" : "no_active"}>
              <div
                class={
                  state4
                    ? "img"
                    : Number(stateSelected.loaiThaoTac + 1) === 5
                    ? "img_pending"
                    : "img_no_active"
                }
              >
                <i class="fa fa-calendar-check"></i>
              </div>
              <div class="caption">
                <span className="text-top" style={{ marginLeft: "-27px" }}>
                  Hoàn thành
                </span>
                {state4 && (
                  <span className="text-bottom" style={{ marginLeft: "-31px" }}>
                    {formatDate(state4.createdAt)}
                  </span>
                )}
              </div>
            </li>
          </ul>
        </div>

        <br />

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div class="card" style={{ width: "67%" }}>
            <h5>
              THÔNG TIN NHẬN HÀNG
              <Divider></Divider>
            </h5>

            <div>
              <span
                style={{
                  color: "#000000",
                  width: "100px",
                  display: "inline-block",
                }}
              >
                Người nhận:
              </span>
              <span>
                {bill.tenNguoiNhan} - {bill.soDienThoaiNguoiNhan}
              </span>
            </div>

            <div>
              <span
                style={{
                  color: "#000000",
                  width: "100px",
                  display: "inline-block",
                }}
              >
                Địa chỉ:
              </span>
              <span>
                {bill.diaChiNguoiNhan +
                  "," +
                  bill.xaPhuongNguoiNhan +
                  "," +
                  bill.quanHuyenNguoiNhan +
                  "," +
                  bill.tinhThanhPhoNguoiNhan}
              </span>
            </div>

            {/* {
              bill.ngayNhanHang === null?(
                <div>
                <span
                  style={{
                    color: '#000000',
                    width: '33%',
                    display: 'inline-block'
                  }}
                >
                  Thời gian nhận hàng dự kiến :
                </span>
                <span>
                  {bill.ngayMongMuonNhan === null
                    ? 'Chưa có thông tin'
                    : formatDay(bill.ngayMongMuonNhan)}
                </span>
              </div>
              ):(
                <div>
                <span
                  style={{
                    color: '#000000',
                    width: '100px',
                    display: 'inline-block'
                  }}
                >
                  Nhận lúc :
                </span>
                <span>
                  {bill.ngayNhanHang === null
                    ? 'Chưa có thông tin'
                    : formatDay(bill.ngayNhanHang)}
                </span>
              </div>
              )
            } */}
          </div>

          <div class="card" style={{ width: "30%" }}>
            <h5>
              HÌNH THỨC THANH TOÁN
              <Divider></Divider>
            </h5>
            {bill.paymentMethods === null ? (
              <div>Thanh toán khi nhận hàng</div>
            ) : (
              <div>Thanh toán online</div>
            )}
          </div>
        </div>
        <br />

        <div class="card" style={{ width: "100%" }}>
          <h5>
            THÔNG TIN SẢN PHẨM
            <Divider></Divider>
          </h5>

          {productDetails.map((product, index) => (
            <>
              <div
                className="cart-ctr"
                key={product?.id}
                style={{ marginTop: 10, display: "flex", alignItems: "center" }}
              >
                <div className="cart-ctd">
                  <img
                    style={{ width: 112, height: 115 }}
                    src={product?.duongDan}
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
                      width: 770,
                      height: 140,
                      marginLeft: 10,
                    }}
                  >
                    <div style={{ width: "90%", marginTop: 17 }}>
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
                        width: "30%",
                        marginTop: 22,
                        fontWeight: 500,
                        textAlign: "right",
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
          ))}

          <Divider></Divider>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              float: "right",
              fontSize: 14,
              color: "#222",
            }}
          >
            <h4>Tổng tiền hàng</h4>
            <span>{formatMoney(bill.tongTien)}</span>
          </div>
          <Divider
            style={{
              minWidth: "50%",
              marginLeft: "50%",
              marginTop: 0,
              marginBottom: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              float: "right",
              fontSize: 14,
              color: "#222",
            }}
          >
            <h4>Phí vận chuyển</h4>
            <span> {formatMoney(bill.phiShip)}</span>
          </div>
          <Divider
            style={{
              minWidth: "50%",
              marginLeft: "50%",
              marginTop: 0,
              marginBottom: 0,
            }}
          />

          {bill.tongTien === bill.tongTienSauKhiGiam ? (
            ""
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "50%",
                float: "right",
                fontSize: 14,
                color: "#222",
              }}
            >
              <h4>Voucher từ shop</h4>
              <span>
                - {formatMoney(bill.tongTien - bill.tongTienSauKhiGiam)}
              </span>
            </div>
          )}

          <Divider
            style={{
              minWidth: "50%",
              marginLeft: "50%",
              marginTop: 0,
              marginBottom: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              float: "right",
            }}
          >
            <h4>Thành tiền</h4>
            <span>{formatMoney(bill.tongTienSauKhiGiam + bill.phiShip)}</span>
          </div>

          <Divider
            style={{
              minWidth: "50%",
              marginLeft: "50%",
              marginTop: 0,
              marginBottom: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              float: "right",
            }}
          >
            {bill.paymentMethods === null ? (
              <h4 className="fw-6" style={{ marginBottom: "-20px" }}>
                Cần thanh toán
              </h4>
            ) : (
              <h4 className="fw-6" style={{ marginBottom: "-20px" }}>
                Đã thanh toán
              </h4>
            )}

            <span
              style={{ color: "#d0021c", fontWeight: 600, fontSize: "20px" }}
            >
              {formatMoney(bill.tongTienSauKhiGiam + bill.phiShip)}
            </span>
          </div>
          <br />
        </div>
      </div>
    </>
  );
};
export default OrderDetail;
