import React from "react";
import "./Header.scss";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
    <header
      className="header text-white"
      style={{
        backgroundImage: `linear-gradient(0deg,#0066cc,#0099cc)`,
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

      {/* <div style={{ width: '100%', height: '40px', backgroundColor: 'white'}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width:' 30%',
          margin:'0px auto',
          backgroundColor: 'white',
          color: '#000000',
          justifyContent: 'space-between'
        }}>
           <Link to="/" style={{ marginTop: 8}}>
           <i class="fa fa-mobile"></i>
           <span style={{ fontSize: 14, marginLeft: 5}}>
             SamSung
           </span>
           </Link>

           <Link to="/" style={{ marginTop: 8}}>
           <i class="fa fa-mobile"></i>
           <span style={{ fontSize: 14, marginLeft: 5}}>
             Apple
           </span>
           </Link>

           <Link to="/" style={{ marginTop: 8}}>
           <i class="fa fa-mobile"></i>
           <span style={{ fontSize: 14, marginLeft: 5}}>
             Xiaomi
           </span>
           </Link>


           <Link to="/" style={{ marginTop: 8}}>
           <i class="fa fa-mobile"></i>
           <span style={{ fontSize: 14, marginLeft: 5}}>
             Điện thoại
           </span>
           </Link>
        </div>
     </div> */}
    </header>
    </>
  );
};

export default Header;
