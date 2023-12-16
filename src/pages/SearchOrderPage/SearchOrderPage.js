import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import Orders from "./Orders";
import Home from "./Home";
import InformationUser from "./InformationUser";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeInformationUser } from "../../store/userSlice";
import { setAuthHeader } from "../../helpers/axios_helper";
import { ResetItemNavbar } from '../../store/navbarSlice'

const App = () => {
  const [component, setComponent] = useState(2);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const choiseAnotherComponent = (value) => {
    setComponent(value);
    console.log(value)
  };

  useEffect(() => {
    dispatch(ResetItemNavbar())
    // window.scrollTo(0, 0);
  }, [])

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
          <Col span={6} style={{ position: 'fixed', zIndex: '666' }}>

            {/* <button
              style={ component === 1 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(1)}
            >
              <i
                class="fa-solid fa-file-invoice"
                style={{ color: "#128DE2", margin: `0px 4px` }}
              ></i>{" "}
              Trang chủ
            </button> */}

            <button
              style={ component === 2 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(2)}
            >
              <i
                class="fa fa-file-invoice"
                style={
                  component === 2?
                  { color: "#128DE2", margin: `0px 4px` }
                :  { color: "#303030", margin: `0px 4px` }
              }
              ></i>{" "}
              Lịch sử mua hàng
            </button>

            {/* <button 
              style={ component == 3 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(3)}
            >
              <i
                class="fa-solid fa-id-card"
                style={{ color: "#128DE2", margin: `0px 4px` }}
              ></i>{" "}
              Tra cứu bảo hành
            </button> */}

            {/* <button 
              style={ component == 3 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(3)}
            >
              <i
                class="fa-solid fa-id-card"
                style={{ color: "#128DE2", margin: `0px 4px` }}
              ></i>{" "}
              Hạng thành viên
            </button> */}

            <button 
              style={ component === 3 ? backgroundButtonChoise() : backgroundButtonNoChoise()}
              onClick={() => choiseAnotherComponent(3)}
            >
              <i
                class="fa-solid fa-id-card"
                style={
                  component === 3?
                  { color: "#128DE2", margin: `0px 4px` }
                :  { color: "#303030", margin: `0px 4px` }
              }
              ></i>{" "}
              Tài khoản của bạn
            </button>
            
            <Button
              className="button-order-bought"
              variant="outlined"
              startIcon={<i class="fa-solid fa-arrow-right-to-bracket"></i>}
              onClick={() => {
                localStorage.clear();
                dispatch(changeInformationUser({
                  id: '',
                  ma: ''
                }))
                navigate("/")
                setAuthHeader(null);
              }}
            >
              Đăng xuất
            </Button>
          </Col>
            
          <Col span={6}></Col>

          <Col span={18}>
            {component === 1 ? <Home /> : <></>}
            {component === 2 ? <Orders /> : <></>}
            {component === 3 ? <InformationUser /> : <></>}

          </Col>
        </Row>
      </div>
    </>
  );
};
export default App;
