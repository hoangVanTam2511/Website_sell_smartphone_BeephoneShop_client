import React, { useEffect, useState } from 'react'
import './LookUpOrderPage.css'
import TextField from '@mui/material/TextField'
import { Link, useParams } from 'react-router-dom'
import { ResetSelectedCart } from '../../store/cartSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import  OrderDetail from '../SearchOrderPage/OrderDetail'
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { getUser, setUserNoToken } from '../../store/userSlice'
import toast, { Toaster } from 'react-hot-toast'

const LookUpOrderPage = () => {
  const dispatch = useDispatch()
  const { id_bill } = useParams()
  const account = getUser()
  const [order, setOrder] = useState({
    phone: '',
    code: ''
  })
  const [bill, setBill] = useState()

  useEffect(() => {
    dispatch(ResetSelectedCart())
    // window.scrollTo(0, 0);
    if (id_bill !== "no_bill") {
      if(bill === undefined){
      getOrderByPhoneAndCode(account.soDienThoai, id_bill)
      }
    }
  })

  const getOrder = async () => {
    var vnf_regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

    if(order.code === '' || order.code  === undefined){
      toast.error('Vui lòng nhập mã đơn hàng')
      return;
    }

    if(order.phone === '' || order.phone  === undefined){
      toast.error('Vui lòng nhập số điện thoại')
      return;
    }
   
   if (order.phone.trim() === '') {
      toast.error('Quý khách vui này điền đầy đủ số điện thoại')
      return;
    }

    if (!vnf_regex.test(order.phone)) {
      toast.error('Quý khách phải nhập đúng định dạng số điện thoại')
      return;
     }

    request("GET",`/client/bill/get-bill-detail?phone=${order.phone}&code=${order.code}`)
      .then(res => {
        if (res.status === 200) {
          setBill(res.data)
        }
      })
      .catch(error => {
        console.log(error)
        if(error.response.status === 400){
          toast.error('Không tìm thấy đơn hàng')
        }
        // setUserNoToken()
        console.log(error)})
  }

  const getOrderByPhoneAndCode = async (phone,id_bill) => {
    console.log(phone, id_bill)
    request("GET",`/client/bill/get-bill-detail?phone=${phone}&code=${id_bill}`)
      .then(res => {
        if (res.status === 200) {
          setBill(res.data)
        }
        console.log(res)
      })
      .catch(error => {
        setUserNoToken()
        console.log(error)})
  }

  const setTab = (data) => {
    setBill(data)
    if(data === null){
      setOrder({
        phone: '',
        code: ''
      })
    }
  }

  return (
    <>
    {bill === null || bill === undefined ?(
        <div className='body_lookup'>
        <div className='container_lookup'>
          <div className='container-left'>
            <div className='title title-left'>
              Kiểm tra thông tin đơn hàng & tình trạng vận chuyển
            </div>
            <div className='circle'></div>
            {
              account === null || account.id === "" ? (
                <div className='container-left-bottom'>
              <div className='container-left-bottom-compliment'>Hoặc</div>
              <div className='container-left-bottom-description'>
                <p>
                  <Link to='/login'>
                    <button className='btn-login'>Đăng nhập</button>.
                  </Link>
                </p>
              </div>
            </div>
              ):(
                <div className='container-left-bottom'>
              <div className='container-left-bottom-compliment'>Hoặc</div>
              <div className='container-left-bottom-description'>
                <p>
                  <Link to='/search-order-page'>
                    <button className='btn-login'>Kiểm tra đơn hàng</button>.
                  </Link>
                </p>
              </div>
            </div>
              )
            }
            
          </div>

          <div className='container-right-box'></div>
          <div className='container-right'>
            <div className='title title-right'>Nhập thông tin đơn hàng</div>
            <div className='stat-box'>
              <div className='stat stat-reaction'>
                <TextField
                  id='outlined-basic'
                  label='Nhập mã đơn hàng'
                  variant='outlined'
                  className='MuiInput-multiline'
                  value={order.code}
                  onChange={e => setOrder({ ...order, code: e.target.value })}
                  style={{ width: '100%', marginBottom: 10 }}
                />
                <br />
                <TextField
                  id='outlined-basic'
                  label='Nhập số điện thoại'
                  variant='outlined'
                  value={order.phone}
                  onChange={e => setOrder({ ...order, phone: e.target.value })}
                  className='MuiInput-multiline'
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <button className='btn' onClick={getOrder}>Kiểm tra</button>
          </div>
        </div>
      </div>
    ):
        <> 
        <div style={{ 
         width: '79%',
         margin:` 40px auto`,
          }}>
        <OrderDetail id_bill={bill} setTab={setTab} />
        </div>
        </>
      }
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
    </>
  )
}

export default LookUpOrderPage
