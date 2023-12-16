import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import './SearchOrderPage.css'
import { Divider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import InformationAddress from './InformationAddress'
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { getUser, setUserNoToken } from '../../store/userSlice'
import { SetSelectedCart } from '../../store/cartSlice'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Orders = () => {
  const host = 'https://provinces.open-api.vn/api/'
  const user = getUser()
  const dispatch = useDispatch()
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [changeAddress, setChangeAddress] = useState(1)
  const [totalAmount, setTotalAmount] = useState(0)
  const [diaChiList, setDiaChiList] = useState([])

   // redux
   const [isLoadingRequest, setIsLoadingRequest] = useState(true)

  const getBillsByIdCustomer = async() => {
    let sum = 0;
    request("GET",`/client/bill/get-list-bills?id_customer=${user.id}`).then(
      res => {
        res.data.forEach(item => {
          sum += item.tongTienSauKhiGiam
        })
        setTotalAmount(sum)
      }
    ).catch(error => {
      setUserNoToken()
      console.log(error)
    })
}

  useEffect(() => {
    callAPI('https://provinces.open-api.vn/api/?depth=2')
    dispatch(SetSelectedCart(1))
    getBillsByIdCustomer()
    getAllAddress()
  }, [])

  const getAllAddress = async () => {
    setIsLoadingRequest(false)
    request("GET",`/client/address/get-all-address?id_account=${user.id}`
      )
      .then(res => {
        if (res.status === 200) {
          console.log(res.data)
          setTimeout(()=>{
            setIsLoadingRequest(true)
            setDiaChiList(res.data)
          }, 200)
        }
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })
  }

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
  
  const formatMoney = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
  }

  return (
    <>
    {
      isLoadingRequest === true  ? 
       <> </>
      :
        <div className='custom-spin'>
         <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#126de4', marginLeft: 5 }} spin />} />
        </div>
      
    }
      {changeAddress === 1 ? (
        <div>

          <div class='card bg-white'>
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
            </div>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>
                  {' '}
                  <TextField
                    style={{ width: '800px' }}
                    label='Số điện thoại'
                    id='standard-basic'
                    variant='standard'
                    value={user.soDienThoai}
                  />
                </span>
              </div>
            </div>

            <div style={{ marginTop: '35px' }}>
              <div className='title'>
                <span>
                  {' '}
                  <TextField
                    style={{ width: '800px' }}
                    label='Email'
                    id='standard-basic'
                    variant='standard'
                    value={user.email}
                  />
                </span>
              </div>
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
                <span>
                  {/* Địa chỉ: {diaChiList.find(item => item.trangThai === 1).diaChi}, {user.diaChiList.find(item => item.trangThai === 1).xaPhuong}, {user.diaChiList.find(item => item.trangThai === 1).quanHuyen},{' '}
                  {diaChiList.find(item => item.trangThai === 1).tinhThanhPho}{' '} */}
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
