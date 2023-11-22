import React from 'react';
import "./FlashsalePage.css";
import "react-multi-carousel/lib/styles.css";


const FlashsalePage = ({products}) => {
  return (
    <>
    <div class="container-flashsale wapper">
  <div class="flash-sale-header">
    <div class="flash-sale-header__title">
      <div class="title_count">
        <div class="flash-sale-header__title__flash-sale">

        </div>
        <div class="flash-sale-header__title__countdown" id="the-24h-countdown">
          <p></p>
        </div>
      </div>

    </div>
    <a href="#"><button class="shopee-button-no-outline">Xem tất cả&nbsp;<svg enable-background="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0" class="shopee-svg-icon icon-arrow-right">
          <path d="m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z"></path>
        </svg></button></a>
  </div>
  <ul class="product-slide">
    <li>
      <a href="#" class="link-product">
        <div class="flash-sale-item-card__image flash-sale-item-card__image--home-page">
          <div class="product-thumb">
            <div class="flash-sale-item-card__image-overlay flash-sale-item-card__image-overlay--home-page V1Fpl5" style={{backgroundImage: `url('https://cf.shopee.vn/file/25a83d00084610da91c2bdf966cc7544_tn')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}></div>
          </div>
        </div>
        <div class="product-info">
          <div class="flash-sale-item-card__lower-left">
            <div class="flash-sale-item-card__current-price flash-sale-item-card__current-price--home-page"><span class="item-price-dollar-sign">₫ </span><span class="item-price-number">285.000</span></div>
            <div class="flash-sale-progress-bar__wrapper flash-sale-progress-bar__wrapper--home-page">
              <div class="flash-sale-progress-bar flash-sale-progress-bar--home-page">
                <div class="flash-sale-progress-bar__text">Đã bán 9</div>
                <div class="flash-sale-progress-bar__complement-wrapper flash-sale-progress-bar__complement-wrapper--home-page">
                  <div class="flash-sale-progress-bar__complement-sizer flash-sale-progress-bar__complement-sizer--home-page" style={{width: `44%`}}>
                    <div class="flash-sale-progress-bar__complement-color"></div>
                  </div>
                </div>
                <div class="flash-sale-progress-bar__fire"></div>
              </div>
            </div>
          </div>

          <div class="badge-wrapper">
            <div class="main-wapper">
              <div class="sale-box"><span class="percent">47%</span><span class="sale-title">giảm</span></div>
            </div>
          </div>
        </div>
      </a>
    </li>
  </ul>
</div>
    
    </>
  )
}

export default FlashsalePage