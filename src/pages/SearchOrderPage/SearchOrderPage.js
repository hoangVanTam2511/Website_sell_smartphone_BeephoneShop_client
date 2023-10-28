import React, { useState } from "react";
import { Col, Row } from "antd";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import Orders from "./Orders";
import InformationUser from "./InformationUser";

const App = () => {
  const [component, setComponent] = useState(1);

  const choiseAnotherComponent = (value) => {
    setComponent(value);
  };

  const backgroundButtonChoise = () => {
    return {
      background: '#e4e7ed',
      width: '221px',
      textAlign: 'left',
      height: '44px',
      padding: '10px',
      fontSize: '15px',
      borderRadius: '8px',
      marginBottom: '15px',
    }
  }

  const backgroundButtonNoChoise = () => {
    return {
      width: '221px',
      textAlign: 'left',
      height: '44px',
      padding: '10px',
      fontSize: '15px',
      borderRadius: '8px',
      marginBottom: '15px',
    }
  }

  return (
    <>
      <div style={{ width: "80%", margin: `30px auto`, display: "flex" }}>
        <div style={{ width: "27%", marginTop: "6px" }}>
          Anh <span className="fw-8">Hoàng Văn Tám</span>
        </div>
        <div style={{ width: "80%" }}>
          <span className="fw-5" style={{ fontSize: 20 }}>
            {component == 1 ? "Đơn hàng đã mua" : "Thông tin tài khoản"}
          </span>
          <span className="fw-3" style={{ marginLeft: 20, fontSize: 14 }}>
            {component == 1 ? "Từ ngày 26/10/2023 - 26/10/2023" : ""}
          </span>
        </div>
      </div>

      <div style={{ width: "80%", margin: `20px auto` }}>
        <Row>
          <Col span={6}>
            <button
              style={ component == 1 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(1)}
            >
              <i
                class="fa-solid fa-file-invoice"
                style={{ color: "#128DE2", margin: `0px 4px` }}
              ></i>{" "}
              Đơn hàng đã mua
            </button>

            <button
              style={ component == 2 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(2)}
            >
              <i
                class="fa-solid fa-id-card"
                style={{ color: "#128DE2", margin: `0px 4px` }}
              ></i>{" "}
              Thông tin và sổ địa chỉ
            </button>
            <Button
              className="button-order-bought"
              variant="outlined"
              startIcon={<i class="fa-solid fa-arrow-right-to-bracket"></i>}
            >
              Đăng xuất
            </Button>
          </Col>
          <Col span={18}>
            {component == 1 ? <Orders /> : <InformationUser />}
          </Col>
        </Row>
      </div>
    </>
  );
};
export default App;
