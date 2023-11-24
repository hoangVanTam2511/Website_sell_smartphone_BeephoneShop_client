import React, { useEffect, useState } from 'react'
import './LookUpOrderPage.css'
import TextField from '@mui/material/TextField'
import { Link } from 'react-router-dom'
import { ResetSelectedCart } from '../../store/cartSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import  OrderDetail from '../SearchOrderPage/OrderDetail'

const LookUpOrderPage = () => {
  const dispatch = useDispatch()
  const [order, setOrder] = useState({
    phone: '',
    code: ''
  })
  const [bill, setBill] = useState()

  useEffect(() => {
    dispatch(ResetSelectedCart())
    window.scrollTo(0, 0);
  })

  const getOrder = async () => {
    await axios
      .get(`http://localhost:8080/client/bill/get-bill-detail?phone=${order.phone}&code=${order.code}`)
      .then(res => {
        if (res.status === 200) {
          setBill(res.data)
        }
        console.log(res)
      })
      .catch(error => console.log(error))
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
    </>
  )
}

export default LookUpOrderPage
