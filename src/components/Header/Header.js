import React from "react";
import "./Header.scss";
import Navbar from "../Navbar/Navbar";

const Header = () => {
  return (
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
    </header>
  );
};

export default Header;
