import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import './SearchOrderPage.css'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { SetSelectedCart } from '../../store/cartSlice'
import { ResetItemNavbar } from '../../store/navbarSlice'
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../store/userSlice'

const Orders = () => {
  const user = getUser()
  const [listBill, setListBill] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    getBillsByIdCustomer()
    dispatch(SetSelectedCart(1));
    dispatch(ResetItemNavbar())
    // window.scrollTo(0, 0);
  }, [])

  const getBillsByIdCustomer = async () => {
    if (listBill && listBill.length > 0) return
    request("GET",`/client/bill/get-list-bills?id_customer=${user.id}`
      )
      .then(res => {
        setListBill(res.data)
      }).catch(error=>{
        setAuthHeader(null)
        // navigate('/403-not-found')
      })
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US')
  }

  return (
    <>
      <div class='card bg-white' style={{ width: '100%' }}>
        <div style={{ width: `25%`, margin: `0px auto` }}>
          <div
            style={{
              width: `70px`,
              display: `block`,
              border: `1px solid #707070`,
              borderRadius: `50%`,
              padding: `10px`,
              display: 'block',
              marginLeft: '32%',
              height: '70px',
              backgroundImage: `url(${user.anhDaiDien})`,
              backgroundSize: 'cover'
            }}
          >
            {' '}
          </div>
          <h4 style={{ textAlign: 'center' }}>
            Xin chào,
            <br />{' '}
            <span className='fw-7 fs-20' style={{ color: `#128DE2` }}>
              {user.hoVaTen}
            </span>
          </h4>
          <h4></h4>
        </div>

        <div
          class='title'
          style={{ textAlign: 'center', justifyContent: 'space-evenly' }}
        >
          <h4 style={{ width: '20%' }}>
            <div className='fw-6' style={{ margin: '10px 0px' }}>
              Ngày tham gia
            </div>
            <div>
              <i
                class='fa fa-calendar-check'
                style={{ fontSize: 50, color: '#128DE2' }}
              ></i>
            </div>
            <div className='fw-6' style={{ margin: '10px 0px' }}>
              {formatDate(user.createdAt)}
            </div>
          </h4>

          <h4 style={{ width: '20%' }}>
            <div className='fw-6' style={{ margin: '10px 0px' }}>
              Hạng thành viên
            </div>
            <div>
              <i
                class='fa fa-medal'
                style={{ fontSize: 50, color: '#128DE2' }}
              ></i>
            </div>
            <div className='fw-6' style={{ margin: '10px 0px' }}>
              Hạng đồng đoàn
            </div>
          </h4>

          <h4 style={{ width: '20%' }}>
            <div className='fw-6' style={{ margin: '10px 0px' }}>
              Điểm tích luỹ từ  {formatDate(user.createdAt)}
            </div>
            <div>
              <i
                class='fa fa-money-check'
                style={{ fontSize: 50, color: '#128DE2' }}
              ></i>
            </div>
            <div className='fw-6' style={{ margin: '10px 0px' }}>
              0 điểm
            </div>
          </h4>
        </div>
      </div>

      <div
        class='title'
        style={{
          textAlign: 'center',
          justifyContent: 'space-evenly',
          marginTop: '20px'
        }}
      >
        <div className='card bg-white' style={{ width: '30%' }}>
          <img
            style={{
              width: `70px`,
              display: `block`,
              border: `0px solid #707070`,
              borderRadius: `50%`,
              padding: `13px`,
              display: 'block',
              marginLeft: '32%',
              height: '64px',
              backgroundColor: `#f0e89d`
            }}
            src='https://cellphones.com.vn/smember/_nuxt/img/gift-box(1)1.ad696df.png'
          />
          <h4 style={{ textAlign: 'center' }}>
            <br />{' '}
            <span className='fw-7 fs-18' style={{ color: `#128DE2` }}>
              Ưu đãi của bạn
            </span>
            <br />
            <span className='fw-5 fs-16'> 0 ưu đãi </span>
            <br />
            <Button
              style={{
                backgroundColor: `#128DE2`,
                color: `white`,
                marginLeft: '5px',
                marginTop: '10px'
              }}
              variant='outlined'
              startIcon={<i class='fa-regular fa-eye'></i>}
            >
              Xem chi tiết
            </Button>
          </h4>
          <h4></h4>
        </div>

        <div className='card bg-white' style={{ width: '30%' }}>
          <img
            style={{
              width: `70px`,
              display: `block`,
              border: `0px solid #707070`,
              borderRadius: `50%`,
              padding: `13px`,
              display: 'block',
              marginLeft: '32%',
              height: '64px',
              backgroundColor: `#fff7ca`
            }}
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKj6kzhiUMtjknupRb6nfEdJQZX1itw8JFKQ&usqp=CAU'
          />
          <h4 style={{ textAlign: 'center' }}>
            <br />{' '}
            <span className='fw-7 fs-18' style={{ color: `#128DE2` }}>
              Đơn hàng của bạn
            </span>
            <br />
            <span className='fw-5 fs-16'> {listBill.length} đơn hàng </span>
            <br />
            <Button
              style={{
                backgroundColor: `#128DE2`,
                color: `white`,
                marginLeft: '5px',
                marginTop: '10px'
              }}
              variant='outlined'
              startIcon={<i class='fa-regular fa-eye'></i>}
            >
              Xem chi tiết
            </Button>
          </h4>
          <h4></h4>
        </div>

        <div className='card bg-white' style={{ width: '30%' }}>
          <img
            style={{
              width: `70px`,
              display: `block`,
              border: `0px solid #707070`,
              borderRadius: `50%`,
              padding: `13px`,
              display: 'block',
              marginLeft: '32%',
              height: '64px',
              backgroundColor: `#89c1f5`
            }}
            src='https://cellphones.com.vn/smember/_nuxt/img/crown.d2de999.png'
          />
          <h4 style={{ textAlign: 'center' }}>
            <br />{' '}
            <span className='fw-7 fs-18' style={{ color: `#128DE2` }}>
              Hạng thành viên
            </span>
            <br />
            <span className='fw-5 fs-16'> Vô danh tiểu tốt </span>
            <br />
            <Button
              style={{
                backgroundColor: `#128DE2`,
                color: `white`,
                marginLeft: '5px',
                marginTop: '10px'
              }}
              variant='outlined'
              startIcon={<i class='fa-regular fa-eye'></i>}
            >
              Xem chi tiết
            </Button>
          </h4>
          <h4></h4>
        </div>
      </div>

      <br />
    </>
  )
}
export default Orders
