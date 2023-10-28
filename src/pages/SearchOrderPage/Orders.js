import React from "react";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import { Divider } from "antd";

const Orders = () => {
  return (
    <>
      <div class="card">
        <div class="title">
          <h4>
            {" "}
            <span className="fw-6">Đơn hàng</span>: #7895959
          </h4>
          <h4>
            {" "}
            <span className="fw-6" style={{ color: `green` }}>
              Đã nhận được hàng
            </span>
          </h4>
        </div>

        <Divider></Divider>

        <div class="title">
          <h4 class="title">
            <img
              style={{ width: `20%` }}
              src="https://cdn.tgdd.vn/Products/Images/522/281633/Redmi-Pad-Sliver-thumb-org-200x200.jpg"
            />
            <span className="fw-6" style={{ marginLeft: "-120px" }}></span>
            Xiaomi Redmi Pad (3+64G) Bạc
          </h4>
          <h4 className="fs-12">
            {" "}
            Tổng tiền: <span className="fw-6 fs-16">4.090.000 đ</span>
          </h4>
        </div>

        <div className="title">
          <div></div>
          <div>
            <Button
              style={{ backgroundColor: `#128DE2`, color: `white` }}
              variant="outlined"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>

      <br />

      <div class="card">
        <div class="title">
          <h4>
            {" "}
            <span className="fw-6">Đơn hàng</span>: #7895959
          </h4>
          <h4>
            {" "}
            <span className="fw-6" style={{ color: `green` }}>
              Đã nhận được hàng
            </span>
          </h4>
        </div>

        <Divider></Divider>

        <div class="title">
          <h4 class="title">
            <img
              style={{ width: `20%` }}
              src="https://cdn.tgdd.vn/Products/Images/522/281633/Redmi-Pad-Sliver-thumb-org-200x200.jpg"
            />
            <span className="fw-6" style={{ marginLeft: "-120px" }}></span>
            Xiaomi Redmi Pad (3+64G) Bạc
          </h4>
          <h4 className="fs-12">
            {" "}
            Tổng tiền: <span className="fw-6 fs-16">4.090.000 đ</span>
          </h4>
        </div>

        <div className="title">
          <div></div>
          <div>
            <Button
              style={{ backgroundColor: `#128DE2`, color: `white` }}
              variant="outlined"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Orders;
