import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import './SearchOrderPage.css'
import { Divider } from 'antd'
import { Select, Space, Input, Checkbox } from 'antd'
import { useSelector } from 'react-redux'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import InformationAddress from './InformationAddress'

const Orders = () => {
  const host = 'https://provinces.open-api.vn/api/'
  const user = useSelector(state => state.user.user)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [changeAddress, setChangeAddress] = useState(1)

  useEffect(() => {
    callAPI('https://provinces.open-api.vn/api/?depth=2')
    console.log(districts)
  }, [])

  var callAPI = api => {
    axios
      .get(api)
      .then(response => {
        const modifiedData = [{ value: '', label: 'Chọn Tỉnh/Thành phố' }]
        response.data.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name })
        })
        setProvinces(modifiedData)
        setDistricts([{ value: '', label: 'Chọn Quận/huyện' }])
        setWards([{ value: '', label: 'Chọn Phường/Xã' }])
      })
      .catch(error => console.log(error))
  }

  var callApiDistrict = api => {
    axios
      .get(api)
      .then(response => {
        const modifiedData = [{ value: '', label: 'Chọn Quận/huyện' }]
        response.data.districts.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name })
        })

        setDistricts(modifiedData)
      })
      .catch(error => console.log(error))
  }

  var callApiWard = api => {
    axios
      .get(api)
      .then(response => {
        const modifiedData = [{ value: '', label: 'Chọn Phường/Xã' }]
        response.data.wards.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name })
        })
        setWards(modifiedData)
      })
      .catch(error => console.log(error))
  }

  const handleChangeProvinces = value => {
    callApiDistrict(host + 'p/' + value + '?depth=2')
  }

  const handleChangeDistricts = value => {
    callApiWard(host + 'd/' + value + '?depth=2')
  }

  const handleChangeWards = value => {
    console.log(value)
  }

  const onChange = e => {
    console.log(`checked = ${e.target.checked}`)
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US')
  }

  return (
    <>
      {changeAddress === 1 ? (
        <div>

          <div class='card'>
            <div class='title' style={{ marginLeft: '36%' }}>
              <h4>
                {' '}
                <span className='fw-6 fs-18'>Thông tin cá nhân</span>
              </h4>
              <h4></h4>
            </div>

            <Divider></Divider>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>
                  {' '}
                  <TextField
                    style={{ width: '800px' }}
                    label='Họ và tên'
                    id='standard-basic'
                    variant='standard'
                    value={user.hoVaTen}
                  />
                </span>
              </div>
              {/* <Divider style={{ margin: '5px auto'}}></Divider> */}
            </div>

            {/* <div style={{ marginTop: '35px'}}>
          <div className='title'>
           <span>Giới tính: {user.gioiTinh === true?'Nam':'Nữ'} </span>

            <button
              style={{
                // backgroundColor: `#128DE2`,    
                color: `white`,
                marginLeft: "5px",
              }}
              // variant="outlined"
            > <i class="fa-regular fa-pen-to-square" style={{ fontSize: '22px', color:'#128DE2'}}></i> </button>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div> */}

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>Số điện thoại: {user.soDienThoai} </span>
              </div>
              <Divider style={{ margin: '5px auto' }}></Divider>
            </div>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>Sinh nhật: {formatDate(user.ngaySinh)} </span>
              </div>
              <Divider style={{ margin: '5px auto' }}></Divider>
            </div>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>
                  Ngày tham gia Smember: {formatDate(user.createdAt)}{' '}
                </span>
              </div>
              <Divider style={{ margin: '5px auto' }}></Divider>
            </div>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>Tổng tiền đã mua sắm: 0 đ </span>
              </div>
              <Divider style={{ margin: '5px auto' }}></Divider>
            </div>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>
                  Địa chỉ: {user.diaChi}, {user.xaPhuong}, {user.quanHuyen},{' '}
                  {user.tinhThanhPho}{' '}
                </span>

                <button
                  style={{
                    color: `white`,
                    marginLeft: '5px'
                  }}
                  onClick={() => setChangeAddress(2)}
                >
                  {' '}
                  <i
                    class='fa-regular fa-pen-to-square'
                    style={{ fontSize: '22px', color: '#128DE2' }}
                  ></i>{' '}
                </button>
              </div>
              <Divider style={{ margin: '5px auto' }}></Divider>
            </div>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>Đổi mật khẩu </span>
              </div>
              <Divider style={{ margin: '5px auto' }}></Divider>
            </div>

            <br />

            <Button
              style={{
                backgroundColor: `#128DE2`,
                color: `white`,
                marginTop: '5px',
                width: `380px`,
                fontSize: '15px',
                marginLeft: '200px'
              }}
              variant='outlined'
              onclick={() => {
                setChangeAddress(2);
              }}
              startIcon={<i class='fa-regular fa-pen-to-square'></i>}
            >
              Cập nhật thông tin
            </Button>
          </div>

        </div>
      ) : (
        <InformationAddress />
      )}
    </>
  )
}
export default Orders
