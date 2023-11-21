import React, { useEffect, useState } from 'react'
import './LoginPage.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/userSlice";
import { addToCart } from "../../store/cartSlice"
import toast, { Toaster } from 'react-hot-toast'

const HomePage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [userLogin,SetUserLogin] = useState({
    'email' : '',
    'password' : ''
  })

  const [userRegister,SetUserRegister] = useState({
    'email' : '',
    'password' : '',
    'passwordAgain' : ''
  })


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

  const login = async(e) => {
    e.preventDefault()
    dispatch(loginUser(userLogin)).then((data) => {
      console.log(data.payload)
      if( data.payload.id === null || data.payload.id === ""){
        toast.error('Đăng nhập không thành công.');
      }else{
        SetUserLogin({
          'email' : '',
          'password' : ''
        })
        dispatch(addToCart())
        toast.success('Đăng nhập thành công');
        setTimeout(() => {
          navigate('/')
        }, 900)
      }
    })
  }

  const register = (e) => {
    e.preventDefault()
    console.log(userRegister)
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
              </div>
              <span>Hoặc tạo tài khoản mới</span>
              <input type='email' placeholder='Email' value={userRegister.email} onChange={(e) => SetUserRegister({...userRegister, 'email' : e.target.value})} />
              <input type='password' placeholder='Mật khẩu' value={userRegister.password} onChange={(e) => SetUserRegister({...userRegister, 'password' : e.target.value})} />
              <input type='password' placeholder='Nhập lại mật khẩu' value={userRegister.passwordAgain} onChange={(e) => SetUserRegister({...userRegister, 'passwordAgain' : e.target.value})} />
              <button onClick={register}>Đăng kí</button>
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
              </div>
              <span>hoặc sử dụng tài khoản của bạn</span>
              <input type='email' placeholder='Email' value={userLogin.email} onChange={(e) => SetUserLogin({...userLogin,email:e.target.value})} />
              <input type='password' placeholder='Mật khẩu' value={userLogin.password} onChange={(e) => SetUserLogin({...userLogin,password:e.target.value})} />
              <a href='#'>Quên mật khẩu?</a>
              <div class="g-recaptcha"
               data-sitekey="6Lel4Z4UAAAAAOa8LO1Q9mqKRUiMYl_00o5mXJrR"></div>
              <button onClick={login}>Đăng nhập</button>
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

       {/* toaster */}
       <Toaster
        position='top-center'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          // Define default options
          // className: '',
          // duration: 5000,
          // style: {
          //   background: '#4caf50',
          //   color: 'white'
          // },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#4caf50',
            },
            style: {
              background: '#4caf50',
              color: 'white'
            },
          },

          error: {
            duration: 3000,
            theme: {
              primary: '#f44336',
              secondary: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#f44336',
            },
            style: {
              background: '#f44336',
              color: 'white'
            },
          }
        }}
      />
    </main>
  )
}

export default HomePage
