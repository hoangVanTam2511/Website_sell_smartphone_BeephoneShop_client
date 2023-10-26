import React, {useEffect, useState} from 'react';
import "./Navbar.scss";
import "./Navbar-custom.css";
import {Link} from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux';
import { setSidebarOn } from '../../store/sidebarSlice';
import { getAllCategories } from '../../store/categorySlice';
import { getAllCarts, getCartItemsCount, getCartTotal } from '../../store/cartSlice';
import CartModal from "../CartModal/CartModal";
import { UserOutlined } from '@ant-design/icons';

const Navbar = () => {
  const dispatch = useDispatch();
  const categories = useSelector(getAllCategories);
  const carts = useSelector(getAllCarts);
  const itemsCount = useSelector(getCartItemsCount);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTerm = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    dispatch(getCartTotal());
  }, [carts])

  return (
    <nav className='navbar'>
      <div className='navbar-cnt flex align-center'>
        <div className='brand-and-toggler flex align-center'>
          <button type = "button" className='sidebar-show-btn text-white' onClick={() => dispatch(setSidebarOn())}>
            <i className='fas fa-bars'></i>
          </button>
          <Link to = "/" className='navbar-brand flex align-center'>
            <span className='navbar-brand-ico'>
              <i className='fa-solid fa-bag-shopping'></i>
            </span>
            <span className='navbar-brand-txt mx-2'>
              <span className='fw-7'>BeePhone</span>shop.
            </span>
          </Link>
        </div>

        <div className='navbar-collapse w-100'>
          <div className='navbar-search bg-white ' style={{ width:`98%`}}>
            <div className='flex align-center'>
              <input type = "text" className='form-control fs-14' placeholder='Nhập thông tin bạn muốn tìm' onChange={(e) => handleSearchTerm(e)} />
              <Link to = {`search/${searchTerm}`} className='text-white search-btn flex align-center justify-center' style = {{ backgroundImage: `linear-gradient(0deg,#0066cc,#0099cc)`}}>
                  <i className='fa-solid fa-magnifying-glass' ></i>
              </Link>
            </div>

          </div>

          {/* <ul className='navbar-nav flex align-center fs-12 fw-4 font-manrope'>
            {
              // taking only first 8 categories
              categories.slice(0, 8).map((category, idx) => (
                <li className='nav-item no-wrap' key = {idx}>
                  <Link to = {`category/${category}`} className='nav-link text-capitalize'>{category.replace("-", " ")}</Link>
                </li>
              ))
            }
          </ul> */}
        </div>

        <div className='navbar-cart flex align-center' style={{border:`0px solid white`, width:63, height:50, paddingTop:3, borderRadius:`17%`}}  >
          <Link to = "/cart" className='cart-btn'>
            <i class="fa fa-shipping-fast" style={{ position:`relative`, right:`-24px`, fontSize:`26px`}}></i>
              <div style={{ fontSize:`10px`, width:`90px`, fontWeight:'500',wordWrap: `break-word`}}>
             Tra cứu đơn hàng
           </div>
          </Link>
        </div>

        <div className='navbar-cart flex align-center' style={{border:`0px solid white`, width:36, height:50, paddingLeft:8, borderRadius:`10px`}}  >
          <Link to = "/cart" className='cart-btn'>
            <i class="fa-solid fa-bag-shopping" style={{ position:`relative`, right:`-8px`, fontSize:`30px`}}></i>
            <div className='cart-items-value'>{itemsCount}</div>
            {/* <CartModal carts = {carts} /> */}
            <div style={{ fontSize:`10px`, width:`50px`, fontWeight:'500'}}>
             Giỏ hàng
           </div>
          </Link>
        </div>

        <div className='navbar-cart flex align-center' style={{border:`1px solid white`, width:72, height:50, paddingLeft:8, borderRadius:`10px` }}>
          <Link to = "/login" className='cart-btn'>
           <UserOutlined style={{ marginLeft:`16px`}} />
           <div style={{ fontSize:`10px`, width:`80px`, fontWeight:'500'}}>
            Đăng nhập
           </div>
          </Link>
        </div>
      </div>

      {/* <div className='navbar-custom'>
      {/* <div class="header__main">
        <div>
                <ul class="main-menu">
                        <li class="">
                            <a href="/dtdd">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/icon-phone-96x96-2.png" alt="&#x110;i&#x1EC7;n tho&#x1EA1;i" />
                                    </i>
                                <span class="">&#x110;i&#x1EC7;n tho&#x1EA1;i</span>
                            </a>
                        </li>
                        <li class="">
                            <a href="/laptop-ldp">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/icon-laptop-96x96-1.png" alt="Laptop" />
                                    </i>
                                <span class="">Laptop</span>
                            </a>
                        </li>
                        <li class="">
                            <a href="/may-tinh-bang">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/icon-tablet-96x96-1.png" alt="Tablet" />
                                    </i>
                                <span class="">Tablet</span>
                            </a>
                        </li>
                        <li class="has-list">
                            <a href="/phu-kien">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/icon-phu-kien-96x96-1.png" alt="Ph&#x1EE5; ki&#x1EC7;n" />
                                    </i>
                                <span class="has-child">Ph&#x1EE5; ki&#x1EC7;n</span>
                            </a>
                                <div class="navmwg ">
                                        <div class="item-child ">
                                                <strong>
                                                    Ph&#x1EE5; ki&#x1EC7;n di &#x111;&#x1ED9;ng
                                                </strong>
                                                        <a href="/sac-dtdd"><h3>S&#x1EA1;c d&#x1EF1; ph&#xF2;ng</h3></a>
                                                        <a href="/sac-cap"><h3>S&#x1EA1;c, c&#xE1;p</h3></a>
                                                        <a href="/op-lung-flipcover"><h3>&#x1ED0;p l&#x1B0;ng &#x111;i&#x1EC7;n tho&#x1EA1;i</h3></a>
                                                        <a href="/op-lung-may-tinh-bang"><h3>&#x1ED0;p l&#x1B0;ng m&#xE1;y t&#xED;nh b&#x1EA3;ng</h3></a>
                                                        <a href="/mieng-dan-man-hinh"><h3>Mi&#x1EBF;ng d&#xE1;n</h3></a>
                                                        <a href="/gay-tu-suong"><h3>G&#x1EAD;y ch&#x1EE5;p &#x1EA3;nh, Gimbal</h3></a>
                                                        <a href="/gia-do-dien-thoai"><h3>Gi&#xE1; &#x111;&#x1EE1; &#x111;i&#x1EC7;n tho&#x1EA1;i, laptop</h3></a>
                                                        <a href="/de-moc-dien-thoai"><h3>&#x110;&#x1EBF;, m&#xF3;c &#x111;i&#x1EC7;n tho&#x1EA1;i</h3></a>
                                                        <a href="/tui-dung-airpods"><h3>T&#xFA;i &#x111;&#x1EF1;ng AirPods</h3></a>
                                                        <a href="/airtag"><h3>AirTag, V&#x1ECF; b&#x1EA3;o v&#x1EC7; AirTag</h3></a>
                                                        <a href="/phu-kien-thong-minh"><h3>B&#xE0;n ph&#xED;m, b&#xFA;t tablet</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    Ph&#x1EE5; ki&#x1EC7;n laptop
                                                </strong>
                                                        <a href="/chuot-ban-phim"><h3>Chu&#x1ED9;t, b&#xE0;n ph&#xED;m</h3></a>
                                                        <a href="/thiet-bi-mang"><h3>Thi&#x1EBF;t b&#x1ECB; m&#x1EA1;ng</h3></a>
                                                        <a href="/tui-chong-soc"><h3>Balo, t&#xFA;i ch&#x1ED1;ng s&#x1ED1;c</h3></a>
                                                        <a href="/phan-mem"><h3>Ph&#x1EA7;n m&#x1EC1;m</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    Thi&#x1EBF;t b&#x1ECB; nh&#xE0; th&#xF4;ng minh
                                                </strong>
                                                        <a href="/camera-giam-sat"><h3>Camera, webcam</h3></a>
                                                        <a href="/may-chieu"><h3>M&#xE1;y chi&#x1EBF;u</h3></a>
                                                        <a href="/android-tv-box"><h3>TV Box</h3></a>
                                                        <a href="/o-cam-thong-minh"><h3>&#x1ED4; c&#x1EAF;m, b&#xF3;ng &#x111;&#xE8;n th&#xF4;ng minh</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    Th&#x1B0;&#x1A1;ng hi&#x1EC7;u h&#xE0;ng &#x111;&#x1EA7;u
                                                </strong>
                                                        <a href="/phu-kien/apple"><h3>Apple</h3></a>
                                                        <a href="/phu-kien/samsung"><h3>Samsung</h3></a>
                                                        <a href="/phu-kien/sony"><h3>Sony</h3></a>
                                                        <a href="/phu-kien/jbl"><h3>JBL</h3></a>
                                                        <a href="/phu-kien/anker"><h3>Anker</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    Thi&#x1EBF;t b&#x1ECB; &#xE2;m thanh
                                                </strong>
                                                        <a href="/tai-nghe"><h3>Tai nghe</h3></a>
                                                        <a href="/loa-ldp"><h3>Loa</h3></a>
                                                        <a href="/micro-cac-loai"><h3>Micro</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    Thi&#x1EBF;t b&#x1ECB; l&#x1B0;u tr&#x1EEF;
                                                </strong>
                                                        <a href="/o-cung-di-dong"><h3>&#x1ED4; c&#x1EE9;ng di &#x111;&#x1ED9;ng</h3></a>
                                                        <a href="/the-nho-dien-thoai"><h3>Th&#x1EBB; nh&#x1EDB;</h3></a>
                                                        <a href="/usb"><h3>USB</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    Ph&#x1EE5; ki&#x1EC7;n kh&#xE1;c
                                                </strong>
                                                        <a href="/phu-kien-oto"><h3>Ph&#x1EE5; ki&#x1EC7;n &#xF4; t&#xF4;</h3></a>
                                                        <a href="/pin"><h3>Pin ti&#x1EC3;u</h3></a>
                                        </div>
                                </div>
                        </li>
                        <li class="">
                            <a href="/dong-ho-thong-minh-ldp">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/icon-smartwatch-96x96-1.png" alt="Smartwatch" />
                                    </i>
                                <span class="">Smartwatch</span>
                            </a>
                        </li>
                        <li class="">
                            <a href="/dong-ho">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/watch-icon-96x96.png" alt="&#x110;&#x1ED3;ng h&#x1ED3;" />
                                    </i>
                                <span class="">&#x110;&#x1ED3;ng h&#x1ED3;</span>
                            </a>
                        </li>
                        <li class="">
                            <a href="/may-doi-tra">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/icon-header-may-cu-30x30.png" alt="M&#xE1;y c&#x169; gi&#xE1; r&#x1EBB;" />
                                    </i>
                                <span class="">M&#xE1;y c&#x169; gi&#xE1; r&#x1EBB;</span>
                            </a>
                        </li>
                        <li class="has-list">
                            <a href="/pc-may-in">
                                    <i>
                                        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//content/icon-pc-96x96.png" alt="PC, M&#xE1;y in" />
                                    </i>
                                <span class="has-child">PC, M&#xE1;y in</span>
                            </a>
                                <div class="navmwg limit-width">
                                        <div class="item-child no-child-final">
                                                <a href="/may-in"><h3>M&#xE1;y in</h3></a>
                                        </div>
                                        <div class="item-child no-child-final">
                                                <a href="/muc-in"><h3>M&#x1EF1;c in</h3></a>
                                        </div>
                                        <div class="item-child no-child-final">
                                                <a href="/man-hinh-may-tinh"><h3>M&#xE0;n h&#xEC;nh m&#xE1;y t&#xED;nh</h3></a>
                                        </div>
                                        <div class="item-child no-child-final">
                                                <a href="/may-tinh-de-ban"><h3>M&#xE1;y t&#xED;nh &#x111;&#x1EC3; b&#xE0;n</h3></a>
                                        </div>
                                        <div class="item-child no-child-final">
                                                <a href="/phan-mem"><h3>Ph&#x1EA7;n m&#x1EC1;m</h3></a>
                                        </div>
                                </div>
                        </li>
                        <li class="">
                            <a href="/sim-so-dep">
                                <span class="">Sim, Th&#x1EBB; c&#xE0;o</span>
                            </a>
                        </li>
                        <li class="has-list">
                            <a href="/tien-ich/thanh-toan-tra-gop">
                                <span class="has-child">D&#x1ECB;ch v&#x1EE5; ti&#x1EC7;n &#xED;ch</span>
                            </a>
                                <div class="navmwg ">
                                        <div class="item-child ">
                                                <strong>
                                                    Thanh to&#xE1;n h&#xF3;a &#x111;&#x1A1;n
                                                </strong>
                                                        <a href="/tien-ich/thanh-toan-tra-gop"><h3>&#x110;&#xF3;ng ti&#x1EC1;n tr&#x1EA3; g&#xF3;p</h3></a>
                                                        <a href="/tien-ich/thanh-toan-tien-dien"><h3>&#x110;&#xF3;ng ti&#x1EC1;n &#x111;i&#x1EC7;n</h3></a>
                                                        <a href="/tien-ich/thanh-toan-tien-nuoc"><h3>&#x110;&#xF3;ng ti&#x1EC1;n n&#x1B0;&#x1EDB;c</h3></a>
                                                        <a href="/tien-ich/thanh-toan-internet-fpt"><h3>&#x110;&#xF3;ng ti&#x1EC1;n NET FPT</h3></a>
                                                        <a href="/tien-ich/thanh-toan-internet-vnpt"><h3>&#x110;&#xF3;ng ti&#x1EC1;n net, c&#xE1;p VNPT</h3></a>
                                                        <a href="/tien-ich/thanh-toan-ve-tau-xe"><h3>V&#xE9; t&#xE0;u, xe, m&#xE1;y bay</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    T&#xE0;i ch&#xED;nh - B&#x1EA3;o hi&#x1EC3;m
                                                </strong>
                                                        <a href="/tien-ich/bao-hiem-o-to-xe-may"><h3>Mua b&#x1EA3;o hi&#x1EC3;m xe m&#xE1;y, &#xF4; t&#xF4;</h3></a>
                                                        <a href="/tien-ich/thanh-toan-bao-hiem"><h3>&#x110;&#xF3;ng ti&#x1EC1;n b&#x1EA3;o hi&#x1EC3;m</h3></a>
                                                        <a href="/tien-ich/goi-cuoc-truyen-hinh"><h3>Mua g&#xF3;i truy&#x1EC1;n h&#xEC;nh</h3></a>
                                        </div>
                                        <div class="item-child ">
                                                <strong>
                                                    Ti&#x1EC7;n &#xED;ch vi&#x1EC5;n th&#xF4;ng
                                                </strong>
                                                        <a href="/tien-ich/goi-cuoc-data"><h3>Mua g&#xF3;i data 3G, 4G</h3></a>
                                                        <a href="/tien-ich/nap-tien-dien-thoai"><h3>N&#x1EA1;p ti&#x1EC1;n tr&#x1EA3; tr&#x1B0;&#x1EDB;c</h3></a>
                                                        <a href="/tien-ich/nap-tien-dien-thoai-tra-sau"><h3>N&#x1EA1;p ti&#x1EC1;n tr&#x1EA3; sau</h3></a>
                                                        <a href="/tien-ich/the-cao-game"><h3>Th&#x1EBB; c&#xE0;o game</h3></a>
                                                        <a href="/tien-ich/the-cao-dien-thoai"><h3>Th&#x1EBB; c&#xE0;o &#x111;i&#x1EC7;n tho&#x1EA1;i</h3></a>
                                        </div>
                                </div>
                        </li>
                </ul>
        </div>
    </div> 
      </div> */}


    </nav>

    
  )
}

export default Navbar