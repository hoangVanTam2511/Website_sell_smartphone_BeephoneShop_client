import React, { useEffect, useState } from 'react'
import './Navbar.scss'
import './Navbar-custom.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { checkUserAnonymous, getUser } from '../../store/userSlice'
import { UserOutlined } from '@ant-design/icons'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { AddItemNavbar } from '../../store/navbarSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const user = getUser()
  const [searchTerm, setSearchTerm] = useState('')
  const countOfProductDetail = useSelector(state => state.cart.quantity)
  const countProductNoLogin = useSelector(state => state.cartDetail.quantity)

  //navigate
  const navigate = useNavigate()

  const handleSearchTerm = e => {
    e.preventDefault()
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    dispatch(addToCart())
    if(user.id === null || user.id === "" || user === null){
      dispatch(checkUserAnonymous());
      dispatch(addToCart(0));
    }

  }, [countOfProductDetail])

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-cnt flex align-center'>
          <div className='brand-and-toggler flex align-center'>
          
            <Link to='/' className='navbar-brand flex align-center'
                onClick={() => {
                  setSearchTerm('')
                }}
            >
              <span className='navbar-brand-ico'>
              </span>
              <span className='navbar-brand-txt mx-2'>
                <span className='fw-7'>BeePhone</span>
                <span className='fs-7 '>
                  shop
                </span>
              </span>
            </Link>
          </div>

          <div className='navbar-collapse w-100'>
            <div className='navbar-search bg-white ' style={{ width: `98%`, display: 'flex' }}>
             
                <input
                  type='text'
                  className='form-control fs-14'
                  placeholder='Nhập tên sản phẩm bạn muốn tìm'
                  value={searchTerm}
                  onChange={e => handleSearchTerm(e)}
                  onKeyDown={event => {
                    console.log(event)
                    if(event.key === 'Enter') {
                    setSearchTerm('')
                    var data = [
                      {
                        path: `/search/${searchTerm}`,
                        name: `Kết quả tìm kiếm cho: ${searchTerm}`
                      }
                    ]
                    dispatch(AddItemNavbar(data))
                    navigate(`/search/${searchTerm}`)
                  }
                  }}
                />

              <Link
                  to={`search/${searchTerm}`}
                  onClick={() => {
                    setSearchTerm('')
                    var data = [
                      {
                        path: `/search/${searchTerm}`,
                        name: `Kết quả tìm kiếm cho: ${searchTerm}`
                      }
                    ]
                    dispatch(AddItemNavbar(data))
                  }}
                  className='text-white search-btn flex align-center justify-center'
                >
                  <i className='fa-solid fa-magnifying-glass' style={{ fontSize: 18}}></i>
                </Link>
              
            </div>

          </div>

            <div
              className='navbar-cart flex align-center'
              style={{
                border: `0px solid white`,
                width: 29,
                height: 50,
                paddingTop: 3,
                borderRadius: `17%`
              }}
            >
              <Link to='/products/all'
               onClick={() => {
                var data = [
                  {
                    path: '/products/all',
                    name: 'Điện thoại'
                  }
                ]
                setSearchTerm('')
                dispatch(AddItemNavbar(data))
               }}
              className='cart-btn'>
                < PhoneAndroidIcon
                  style={{ position: `relative`, right: `-15px`, fontSize: `23px` }}
                />
                <div
                  style={{
                    fontSize: `10px`,
                    width: `90px`,
                    fontWeight: '500',
                    wordWrap: `break-word`
                  }}
                >
                  Điện thoại
                </div>
              </Link>
            </div> 

          <div
            className='navbar-cart flex align-center'
            style={{
              border: `0px solid white`,
              width: 63,
              height: 50,
              paddingTop: 3,
              borderRadius: `17%`
            }}
          >
            <Link to='/look-up-order-page/no_bill'
            onClick={() => {
              var data = [
                {
                  path: `/look-up-order-page/no_bill`,
                  name: 'Tra cứu đơn hàng'
                }
              ]
              setSearchTerm('')
              dispatch(AddItemNavbar(data))
             }}
            className='cart-btn'>
              <i
                className='fa fa-shipping-fast'
                style={{ position: `relative`, right: `-24px`, fontSize: `23px` }}
              ></i>
              <div
                style={{
                  fontSize: `10px`,
                  width: `90px`,
                  fontWeight: '500',
                  wordWrap: `break-word`
                }}
              >
                Tra cứu đơn hàng
              </div>
            </Link>
          </div>

          <div
            className='navbar-cart flex align-center'
            style={{
              border: `0px solid white`,
              width: 36,
              height: 50,
              paddingLeft: 8,
              borderRadius: `10px`
            }}
          >
            <Link to='/cart' className='cart-btn'
              onClick={() => {
                setSearchTerm('')
              }}
            >
              <i
                className='fa-solid fa-bag-shopping'
                style={{ position: `relative`, right: `-8px`, fontSize: `29px` }}
              ></i>
              <div className='cart-items-value'>{user.id === '' ? countProductNoLogin : countOfProductDetail}</div>
              <div style={{ fontSize: `10px`, width: `50px`, fontWeight: '500' }}>
                Giỏ hàng
              </div>
            </Link>
          </div>

          
            {user.ma ? (
              <>
              <div
            className='navbar-cart flex align-center'
            style={{
              border: `1px solid white`,
              width: 81,
              height: 50,
              paddingLeft: 8,
              borderRadius: `10px`
            }}
          >
                <Link to='/search-order-page' className='cart-btn'
                onClick={() => {
                  setSearchTerm('')
                }}
                >
                  <UserOutlined style={{ marginLeft: `22px` }} />
                  <div
                    style={{ fontSize: `9px`, width: `80px`, fontWeight: '500' }}
                  >
                  Xin chào, {user.hoVaTen.split(" ")[user.hoVaTen.split(" ").length - 1]}
                  </div>
                </Link>
                </div>
              </>
            ) : (
              <>
              <div
            className='navbar-cart flex align-center'
            style={{
              border: `1px solid white`,
              width: 72,
              height: 50,
              paddingLeft: 8,
              borderRadius: `10px`
            }}
          >
                <Link to='/login' className='cart-btn'
                onClick={() => {
                  setSearchTerm('')
                }}
                >
                  <UserOutlined style={{ marginLeft: `16px` }} />
                  <div
                    style={{ fontSize: `10px`, width: `80px`, fontWeight: '500' }}
                  >
                    Đăng nhập
                  </div>
                </Link>
                </div>
              </>
            )}
        </div>

        
      </nav>
    </>
  )
}

export default Navbar
