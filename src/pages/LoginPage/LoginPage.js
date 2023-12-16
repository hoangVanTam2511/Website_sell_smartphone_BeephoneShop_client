import React, { useEffect, useState } from 'react'
import './LoginPage.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { changeInformationUser, loginUser } from '../../store/userSlice'
import { addToCart } from '../../store/cartSlice'
import toast, { Toaster } from 'react-hot-toast'
import { ResetSelectedCart } from '../../store/cartSlice'
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { setUserNoToken } from '../../store/userSlice'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const { confirm } = Modal
const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [passAgain, setPassAgain] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [forgetPassView, setForgetPassView] = useState(1)

  const [isLoadingRequest, setIsLoadingRequest] = useState(true)

  const [userLogin, SetUserLogin] = useState({
    email: '',
    password: ''
  })

  const [userRegister, SetUserRegister] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  useEffect(() => {
    loading()
    dispatch(ResetSelectedCart())
    window.scrollTo(0, 0)
  })

  const loading = () => {
    const container = document.getElementById('container-login')
    const registerBtn = document.getElementById('register')
    const loginBtn = document.getElementById('login')

    registerBtn.addEventListener('click', () => {
      container.classList.add('activeLogin')
    })

    loginBtn.addEventListener('click', () => {
      container.classList.remove('activeLogin')
    })
  }

  const login = async e => {
    setAuthHeader(null)
    e.preventDefault()
    setIsLoadingRequest(false)
    request('POST', '/client/account/login', userLogin)
      .then(res => {
        setAuthHeader(res.data.token)
        console.log(res.data)
        dispatch(changeInformationUser(res.data))
        dispatch(addToCart())
        setTimeout(() => {
          toast.success('Đăng nhập thành công')
        }, 200)
        setTimeout(() => {
          navigate('/')
          setIsLoadingRequest(true)

        }, 701)
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
        setIsLoadingRequest(true)   
        toast.error(error.response.data)
      })
  }

  function validatePassword (pw) {
    return (
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw) &&
      pw.length > 4
    )
  }

  const reset = () => {
    
    SetUserLogin({
      email: '',
      password: ''
    })
    SetUserRegister({
      name: '',
      email: '',
      phone: '',
      password: ''
    })
    setPassAgain('')
  }

  const register = e => {
    e.preventDefault()
    var vnf_regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      userRegister.name === '' ||
      userRegister.name === null ||
      userRegister.name === undefined
    ) {
      toast.error('Vui lòng nhập tên')
      return
    }

    if (
      userRegister.phone === '' ||
      userRegister.phone === null ||
      userRegister.phone === undefined
    ) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    } else if (userRegister.phone.trim() === '') {
      toast.error('Vui lòng nhập số điện thoại')
      return
    } else if (!vnf_regex.test(userRegister.phone)) {
      toast.error('Vui này nhập đúng định dạng số diện thoại')
      return
    }

    if (
      userRegister.email === '' ||
      userRegister.email === null ||
      userRegister.email === undefined
    ) {
      toast.error('Vui lòng nhập email')
      return
    } else if (userRegister.email.trim() === '') {
      toast.error('Vui lòng nhập email')
      return
    } else if (!re.test(userRegister.email)) {
      toast.error('Vui này nhập đúng định dạng email')
      return
    }

    if (
      userRegister.password === '' ||
      userRegister.password === null ||
      userRegister.password === undefined
    ) {
      toast.error('Vui lòng nhập mật khẩu')
      return
    } else if (userRegister.password.trim() === '') {
      toast.error('Vui lòng nhập mật khẩu')
      return
    } else if (!validatePassword(userRegister.password)) {
      toast.error(
        ' Mật khẩu phải nhiều hơn 4 ký tự, ít nhất 1 chữ thường 1 chữ in hoa, 1 chữ số, 1 ký tự đặc biệt'
      )
      return
    }

    if (passAgain === '' || passAgain === null || passAgain === undefined) {
      toast.error('Vui này nhập phần nhập lại mật khẩu')
      return
    } else if (passAgain !== userRegister.password) {
      toast.error('Mật khẩu không trùng nhau')
      return
    }

    confirm({
      title: 'Xác nhận tạo tài khoản',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn đồng ý với thông tin và xác nhận tạo tài khoản mới.',
      onOk () {
        setIsLoadingRequest(false)
        request('POST', '/client/account/register', userRegister)
          .then(res => {
            setAuthHeader(res.data.token)
            reset()
            toast.success('Đăng ký tài khoản thành công')
            request('POST', '/client/account/login', {
              email: userRegister.email,
              password: userRegister.password
            })
            .then(res => {
              console.log(res.data)
              setIsLoadingRequest(true)
              setAuthHeader(res.data.token)
              dispatch(changeInformationUser(res.data))
              dispatch(addToCart())
              setTimeout(() => {
                navigate('/')
              }, 400)
            })
            .catch(error => {
              console.log(error)
              setUserNoToken()
              toast.error(error.response.data)
            })
            navigate('/login')
          })
          .catch(error => {
            console.log(error)
            if (error.response !== null || error.response !== undefined) {
              toast.error(error.response.data)
            }
            setAuthHeader(null)
          })
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
        }).catch(() => {
          setUserNoToken()
          console.log('Oops errors!')})
      },
      onCancel () {}
    })
  }

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const forgetPass = e => {
    e.preventDefault()
    setForgetPassView(2)
  }

  const getPass = (e) => {
    setIsLoadingRequest(false)
    e.preventDefault()
    request("POST", "/email/send-html-email-get-pass",
    {
      "email": userLogin.email
    }).then(res => {
      toast.success("Mật khẩu đã được gửi về email của bạn.Vui lòng kiểm tra email")
      setForgetPassView(1)
      setIsLoadingRequest(true)
    }).catch(error => {
      console.log(error.response.data)
      setUserNoToken()
      toast.success(error.response.data)
    })
  }

  return (
    <main>
        {
      isLoadingRequest === true  ? 
       <> </>
      :
        <div className='custom-spin'>
         <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#126de4', marginLeft: 5 }} spin />} />
        </div>
      
    }
      <section>
        <div class='container-login' id='container-login'>
          <div class='form-container-login sign-up'>
            <form>
              <h1>
                {forgetPassView === 2 ? <>Quên mật khẩu</> : <>Tạo tài khoản</>}
              </h1>
              {/* <div class='social-icons'>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-google-plus-g'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-facebook-f'></i>
                </a>
              </div> */}
              {/* <span>Hoặc tạo tài khoản mới</span> */}
              <TextField
                sx={{ m: 1, width: '30ch', fontSize: '16px' }}
                id='standard-basic'
                label='HỌ VÀ TÊN'
                variant='standard'
                value={userRegister.name}
                onChange={e =>
                  SetUserRegister({ ...userRegister, name: e.target.value })
                }
              />
              <TextField
                sx={{ m: 1, width: '30ch', fontSize: '16px' }}
                id='standard-basic'
                label='SỐ ĐIỆN THOẠI'
                variant='standard'
                value={userRegister.phone}
                onChange={e =>
                  SetUserRegister({ ...userRegister, phone: e.target.value })
                }
              />
              <TextField
                sx={{ m: 1, width: '30ch', fontSize: '16px' }}
                id='standard-basic'
                label='EMAIL'
                variant='standard'
                value={userRegister.email}
                onChange={e =>
                  SetUserRegister({ ...userRegister, email: e.target.value })
                }
              />
              <FormControl sx={{ m: 1, width: '30ch' }} variant='standard'>
                <InputLabel htmlFor='standard-adornment-password'>
                  MẬT KHẨU
                </InputLabel>
                <Input
                  value={userRegister.password}
                  onChange={e =>
                    SetUserRegister({
                      ...userRegister,
                      password: e.target.value
                    })
                  }
                  id='standard-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        style={{
                          background: 'white',
                          padding: '0px',
                          margin: '0px'
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: '30ch' }} variant='standard'>
                <InputLabel htmlFor='standard-adornment-password'>
                  NHẬP LẠI MẬT KHẨU
                </InputLabel>
                <Input
                  value={passAgain}
                  onChange={e => setPassAgain(e.target.value)}
                  id='standard-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        style={{
                          background: 'white',
                          padding: '0px',
                          margin: '0px'
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <button onClick={register}>Đăng kí</button>
            </form>
          </div>
          <div class='form-container-login sign-in'>
            <form>
            {forgetPassView === 2 ? <>Quên mật khẩu</> : <>Đăng nhập</>}
              <div class='social-icons'>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-google-plus-g'></i>
                </a>
                <a href='#' class='icons'>
                  <i class='fa-brands fa-facebook-f'></i>
                </a>
              </div>
              <span>hoặc sử dụng tài khoản của bạn</span>
              <TextField
                sx={{ m: 1, width: '25ch', fontSize: '16px' }}
                id='standard-basic'
                label='EMAIL'
                variant='standard'
                value={userLogin.email}
                onChange={e =>
                  SetUserLogin({ ...userLogin, email: e.target.value })
                }
              />

              {forgetPassView === 1 ? (
                <>
                  <FormControl sx={{ m: 1, width: '25ch' }} variant='standard'>
                    <InputLabel htmlFor='standard-adornment-password'>
                      MẬT KHẨU
                    </InputLabel>
                    <Input
                      value={userLogin.password}
                      onChange={e =>
                        SetUserLogin({ ...userLogin, password: e.target.value })
                      }
                      id='standard-adornment-password'
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            style={{
                              background: 'white',
                              padding: '0px',
                              margin: '0px',
                              color: '#707070'
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <span
                   style={{
                    cursor: 'pointer'
                   }}
                  onClick={e => forgetPass(e)}>Quên mật khẩu?</span>
                </>
              ) : (
                <>
                 <span
                   style={{
                    cursor: 'pointer'
                   }}
                  onClick={e => {
                    setForgetPassView(1)
                  }}>Quay lại đăng nhập</span>
                </>
              )}

              <div
                class='g-recaptcha'
                data-sitekey='6Lel4Z4UAAAAAOa8LO1Q9mqKRUiMYl_00o5mXJrR'
              ></div>
              {forgetPassView === 1 ? (
                <button onClick={login}>Đăng nhập</button>
              ) : (
                <button onClick={(e) => getPass(e)}>Gửi mật khẩu về gmail</button>
              )}
            </form>
          </div>
          <div class='toggle-container-login'>
            <div class='toggle'>
              <div class='toggle-panel toggle-left'>
                <h1 style={{ color: 'white', fontWeight: 600 }}>
                  Welcome Back!
                </h1>
                <p>Nhập email của bạn và mua những món đồ tốt nhất</p>
                <button class='hidden' id='login'>
                  Đăng nhập
                </button>
              </div>
              <div class='toggle-panel toggle-right'>
                <h1 style={{ color: 'white', fontWeight: 600 }}>Hi, there!</h1>
                <p>
                  Bạn có thể tạo tài khoản ngay bây giờ để mua những sản phẩm
                  mới nhất
                </p>
                <button
                  onClick={() => {
                    setAuthHeader(null)
                  }}
                  class='hidden'
                  id='register'
                >
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
              secondary: '#4caf50'
            },
            style: {
              background: '#4caf50',
              color: 'white'
            }
          },

          error: {
            duration: 3000,
            theme: {
              primary: '#f44336',
              secondary: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#f44336'
            },
            style: {
              background: '#f44336',
              color: 'white'
            }
          }
        }}
      />
    </main>
  )
}

export default HomePage
