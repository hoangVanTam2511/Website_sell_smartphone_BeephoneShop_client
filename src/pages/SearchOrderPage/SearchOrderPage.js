import React from "react";
import { Col, Row } from "antd";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import { Card } from "antd";

const App = () => {
  return (
    <>
      <div style={{ width: "80%", margin: `30px auto`, display: "flex" }}>
        <div style={{ width: "20%" }}>
          Anh <span className="fw-8">Hoàng Văn Tám</span>
        </div>
        <div style={{ width: "70%" }}>
          <span className="fw-5" style={{ fontSize: 20 }}>
            Đơn hàng đã mua
          </span>
          <span className="fw-3" style={{ marginLeft: 20, fontSize: 14 }}>
            Từ ngày 26/10/2023 - 26/10/2023
          </span>
        </div>
      </div>

      <div style={{ width: "80%", margin: `20px auto` }}>
        <Row>
          <Col span={8}>
            <div className="order-bought">
              <i class="fa-solid fa-file-invoice"></i> Đơn hàng đã mua
            </div>

            <div className="order-bought">
              <i class="fa-solid fa-id-card"></i> Thông tin và sổ địa chỉ
            </div>
            <Button
              className="button-order-bought"
              variant="outlined"
              startIcon={<i class="fa-solid fa-arrow-right-to-bracket"></i>}
            >
              Đăng xuất
            </Button>
          </Col>
          <Col span={16}>
            <Card
              bordered={false}
              style={{
                width: 300,
              }}
            >
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default App;
