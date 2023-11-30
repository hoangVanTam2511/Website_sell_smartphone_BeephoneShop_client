import React, { useEffect } from 'react'
import './Footer.css'
import { useDispatch, useSelector } from 'react-redux'

const Footer = () => {

  const selectedCart = useSelector(state => state.cart.selectedCart)

  useEffect(() => {
      console.log(selectedCart)
  })

  return (
    <>
    {
        selectedCart === 0 ? (
            <footer class="new_footer_area bg_color" style={{ backgroundColor: 'white', borderTop: '1px solid #e2e2eb', marginTop: '-10px'}}>
            <div class="new_footer_top">
                <div class="container">
                    <div class="row" style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <div class="col-lg-3 col-md-6">
                            <div className="f_widget company_widget wow fadeInLeft" 
                              data-wow-delay="0.2s"
                               style={{ visibility: 'visible', animationDelay: '0.2s', animationName: 'fadeInLeft' }}
                             >
                                <h3 class="f-title f_600 t_color f_size_18">Đừng bỏ qua</h3>
                                <p>Nhập email để nhận những thông tin mới nhất của chúng tôi....</p>
                                <form action="#" class="f_subscribe_two mailchimp" method="post" novalidate="true" _lpchecked="1">
                                    <input type="text" name="Nhập email của bạn" class="form-control memail" placeholder="Email"/>
                                    <button class="btn btn_get btn_get_two" type="submit">Đăng kí</button>
                                    <p class="mchimp-errmessage" style={{display: 'none'}}></p>
                                    <p class="mchimp-sucmessage" style={{ display: 'none' }}></p>
                                </form>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div className="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.4s"
                             style={{ visibility: 'visible', animationDelay: '0.4s', animationName: 'fadeInLeft' }}
                             >
                                <h3 class="f-title f_600 t_color f_size_18">Về chúng tôi</h3>
                                <ul class="list-unstyled f_list">
                                    <li><a href="#">Các thành viên</a></li>
                                    <li><a href="#">Ứng dụng android</a></li>
                                    <li><a href="#">Dự án của chúng tôi</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.6s" 
                            style={{ visibility: 'visible', animationDelay: '0.6s', animationName: 'fadeInLeft' }}
                            >
                                <h3 class="f-title f_600 t_color f_size_18">Giúp đỡ</h3>
                                <ul class="list-unstyled f_list">
                                    <li><a href="#">Chính sách</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="f_widget social-widget pl_70 wow fadeInLeft" data-wow-delay="0.8s"
                            style={{ visibility: 'visible', animationDelay: '0.8s', animationName: 'fadeInLeft' }}
                            >
                                <h3 class="f-title f_600 t_color f_size_18">Kết nối với chúng tôi</h3>
                                <div class="f_social_icon">
                                    <a href="#" class="fab fa-facebook"></a>
                                    <a href="#" class="fab fa-twitter"></a>
                                    <a href="#" class="fab fa-linkedin"></a>
                                    <a href="#" class="fab fa-pinterest"></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer_bg">
                    <div class="footer_bg_one"></div>
                    <div class="footer_bg_two"></div>
                </div>
            </div>
            <div class="footer_bottom">
                <div class="container">
                    <div class="row align-items-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div class="col-lg-6 col-sm-7">
                            <p class="mb-0 f_400">© onglanhat Inc.. 2023 All rights reserved.</p>
                        </div>
                        <div class="col-lg-6 col-sm-5 text-right">
                            <p>Made with <i class="icon_heart"></i> in <a href="http://cakecounter.com" target="_blank">ong bắp cày</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        ):(
            <></>
        )
    }
    </>
  )
}

export default Footer
