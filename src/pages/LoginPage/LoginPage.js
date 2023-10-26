import React, { useEffect } from 'react'
import './LoginPage.css'

const HomePage = () => {

  useEffect(() => {
    loading()
  })

  const loading = () => {
    const container = document.getElementById('container-login')
    const registerBtn = document.getElementById('register')
    const loginBtn = document.getElementById('login')

    registerBtn.addEventListener('click', () => {
      container.classList.add('active')
    })

    loginBtn.addEventListener('click', () => {
      container.classList.remove('active')
    })
  }

  return (
    <main>
      <section>
        <div class='container-login' id='container-login'>
          <div class='form-container-login sign-up'>
            <form>
              <h1>Tạo tài khoản</h1>
              <div class='social-icons'>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-google-plus-g'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-facebook-f'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-github'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-linkedin-in'></i>
                </a>
              </div>
              <span>Hoặc chọn phương thức đăng kí khác</span>
              <input type='text' placeholder='Name' />
              <input type='email' placeholder='Email' />
              <input type='password' placeholder='Password' />
              <button>Đăng kí</button>
            </form>
          </div>
          <div class='form-container-login sign-in'>
            <form>
              <h1>Đăng nhập</h1>
              <div class='social-icons'>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-google-plus-g'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-facebook-f'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-github'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-linkedin-in'></i>
                </a>
              </div>
              <span>hoặc chọn phương thức đăng nhập khác</span>
              <input type='email' placeholder='Email' />
              <input type='password' placeholder='Password' />
              <a href='#'>Quên mật khẩu?</a>
              <button>Đăng nhập</button>
            </form>
          </div>
          <div class='toggle-container-login'>
            <div class='toggle'>
              <div class='toggle-panel toggle-left'>
                <h1>Welcome Back!</h1>
                <p>Nhập email của bạn và mua những món đồ tốt nhất</p>
                <button class='hidden' id='login'>
                  Đăng nhập
                </button>
              </div>
              <div class='toggle-panel toggle-right'>
                <h1>Hi, there!</h1>
                <p>
                  Bạn có thể tạo tài khoản ngay bây giờ để mua những sản phẩm mới nhất
                </p>
                <button class='hidden' id='register'>
                  Đăng kí
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
