import React from 'react'
import Button from '@mui/material/Button'
import './SearchOrderPage.css'
import { Divider } from 'antd'

const Orders = () => {
  return (
    <>
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
            backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz0LTGso_7ubZRD1CZoDauy3NWC6RxMqVf_A&usqp=CAU)`,
            backgroundSize: 'cover'
          }}
        >
          {' '}
        </div>
        <h4 style={{ textAlign: 'center' }}>
          Xin chào
          <br />{' '}
          <span className='fw-7 fs-20' style={{ color: `#128DE2` }}>
            Hoàng Văn Tám
          </span>
        </h4>
        <h4></h4>
      </div>

      <div class='card title' style={{ justifyContent: 'space-around', marginTop: '10px'}}>
        <div style={{ textAlign: 'center', width : '45%', color: '#128DE2'}}>
          <span className='fs-20 fw-8'>0</span>
          <br/>
          <span className='fs-20 fw-8'>Đơn hàng</span>
        </div>

        <div style={{ width: '1px', height: '70px', background: 'black'}}></div>

        <div style={{ textAlign: 'center',  width : '45%', color: '#128DE2'}}>
          <span className='fs-20 fw-8'>0 đ</span>
          <br/>
          <span className='fs-20 fw-8'>Tổng tiền tích luỹ</span>
        </div>

        <div></div>

      </div>

      <br />
      <div class='card'>
        <div class='title'>
          <h4>
            {' '}
            <span className='fw-6'>Đơn hàng</span>: #7895959
          </h4>
          <h4>
            {' '}
            <span className='fw-6' style={{ color: `green` }}>
              Đã nhận được hàng
            </span>
          </h4>
        </div>

        <Divider></Divider>

        <div class='title'>
          <h4 class='title'>
            <img
              style={{ width: `20%` }}
              src='https://cdn.tgdd.vn/Products/Images/522/281633/Redmi-Pad-Sliver-thumb-org-200x200.jpg'
            />
            <span className='fw-6' style={{ marginLeft: '-120px' }}></span>
            Xiaomi Redmi Pad (3+64G) Bạc
          </h4>
          <h4 className='fs-12'>
            {' '}
            Tổng tiền: <span className='fw-6 fs-16'>4.090.000 đ</span>
          </h4>
        </div>

        <div className='title'>
          <div></div>
          <div>
            <Button
              style={{ backgroundColor: `#128DE2`, color: `white` }}
              variant='outlined'
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>

      <br />

      <div class='card'>
        <div class='title'>
          <h4>
            {' '}
            <span className='fw-6'>Đơn hàng</span>: #7895959
          </h4>
          <h4>
            {' '}
            <span className='fw-6' style={{ color: `green` }}>
              Đã nhận được hàng
            </span>
          </h4>
        </div>

        <Divider></Divider>

        <div class='title'>
          <h4 class='title'>
            <img
              style={{ width: `20%` }}
              src='https://cdn.tgdd.vn/Products/Images/522/281633/Redmi-Pad-Sliver-thumb-org-200x200.jpg'
            />
            <span className='fw-6' style={{ marginLeft: '-120px' }}></span>
            Xiaomi Redmi Pad (3+64G) Bạc
          </h4>
          <h4 className='fs-12'>
            {' '}
            Tổng tiền: <span className='fw-6 fs-16'>4.090.000 đ</span>
          </h4>
        </div>

        <div className='title'>
          <div></div>
          <div>
            <Button
              style={{ backgroundColor: `#128DE2`, color: `white` }}
              variant='outlined'
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
export default Orders
