import React from "react";
import "./Header.scss";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import {  useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AddItemNavbar } from "../../store/navbarSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const data = useSelector(state => state.navbar.navbar)
  const dispatch = useDispatch()
  const statusOfNavbar = useSelector(state => state.navbar.status)
  const navigate = useNavigate()

  return (
    <>
    <header
      className="header text-white"
      style={{
        backgroundColor: `#128DE2`,
        position: `fixed`,
        zIndex: `999`,
        width: `100%`,
        top: '0px',
      }}
    >
      <div
        style={{
          height: `31px`,
          backgroundImage: `url(https://cdn2.cellphones.com.vn/x30,webp,q100/https://dashboard.cellphones.com.vn/storage/top-banner-chinh-sach-bao-hanh-doi-tra.png)`,
        }}
      ></div>

      <div className="container">
        <div className="header-cnt">
          <div className="header-cnt-bottom">
            <Navbar />
          </div>
        </div>
      </div>

      {
        statusOfNavbar === 0 ?
        <></>:
        <div style={{ width: '100%', height: '40px', backgroundColor: 'white'}} className="path-css">
        <div style={{
          alignItems: 'center',
          width:' 82%',
          margin:'0px auto',
          backgroundColor: 'white',
          color: '#000000',
          }}>
             <Link to='/' style={{ marginTop: 8,height: `10px`,
                  marginRight: `10px`,}}>
                  <i class="fa fa-house icon-css" style={{color: '#128DE2'}}></i>
                  <span style={{ fontSize: 14, marginLeft: 5, color: '#707070'}}>
                    Trang chủ
                  </span>
                  </Link>
            {
              data.map((item, index) => (
                  <Link to={item.path} 
                   onClick={() => {
                    var data = []
                    data.push(item)
                     dispatch(AddItemNavbar(data))
                   }}
                  style={{ marginTop: 8,height: `10px`,
                  marginRight: `10px`,}}>
                  <i class="fa fa-angle-right icon-css" ></i>
                  <span style={{ fontSize: 14, marginLeft: 5, color: '#707070'}}>
                    {item.name}
                  </span>
                  </Link>
              ))
            }
        </div>
     </div>
      }

    
    </header>
    </>
  );
};

export default Header;
