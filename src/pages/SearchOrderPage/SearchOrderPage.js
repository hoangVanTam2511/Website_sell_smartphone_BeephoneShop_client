import React, { useState } from "react";
import { Col, Row } from "antd";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import Orders from "./Orders";
import Home from "./Home";
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
      <br/>
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
              Trang chủ
            </button>

            <button
              style={ component == 2 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(2)}
            >
              <i
                class="fa-solid fa-id-card"
                style={{ color: "#128DE2", margin: `0px 4px` }}
              ></i>{" "}
              Lịch sử mua hàng
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
            {component == 1 ? <Home /> : <Orders />}
          </Col>
        </Row>
      </div>
    </>
  );
};
export default App;
