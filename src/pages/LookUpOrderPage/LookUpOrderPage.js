import React from 'react'
import './LookUpOrderPage.css'
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';

const LookUpOrderPage = () => {

    return (
    <>

<div className='body_lookup'>
    <div className="container_lookup">
      <div className="container-left">
        <div className="title title-left">Kiểm tra thông tin đơn hàng & tình trạng vận chuyển</div>
        <div className="circle" >
          
        </div>
        <div className="container-left-bottom">
          <div className="container-left-bottom-compliment">Hoặc</div>
          <div className="container-left-bottom-description">
            <p>
                <Link to = "/login">
                   <button className="btn-login">Đăng nhập</button>.
                </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="container-right-box"></div>
      <div className="container-right">
        <div className="title title-right">Nhập thông tin đơn hàng</div>
        <div className="stat-box">
          <div className="stat stat-reaction">
            <TextField id="outlined-basic" label="Nhập mã đơn hàng" variant="outlined" className='MuiInput-multiline' style={{width: '100%', marginBottom: 10}}/>
            <br/>
            <TextField id="outlined-basic" label="Nhập số điện thoại" variant="outlined" className='MuiInput-multiline' style={{width: '100%'}}/>
          </div>
        
        </div>
        <button className="btn">Kiểm tra</button>
      </div>
    </div>
  </div>
    </>
  )
}

export default LookUpOrderPage
