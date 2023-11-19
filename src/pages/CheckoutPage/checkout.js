import React, { useState, useEffect } from 'react'
import '../CartPage/CartPage.scss'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Select, Space, Input } from 'antd'
import axios from 'axios'
import { useDispatch } from "react-redux";
import { changeInformationUser } from "../../store/userSlice"
const { TextArea } = Input;

const CartPage = props => {
  const host = 'https://provinces.open-api.vn/api/'
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [radioReceive, setRadioReceive] = useState()
  const [account, setAccount] = useState()
  const [typeReceiveGift, setTypeReceiveGift] = useState(3)
  const dispatch = useDispatch();

  useEffect(() => {
    callAPI('https://provinces.open-api.vn/api/?depth=2')
    setAccount(props.account)
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
    setAccount({ ...account, tinhThanhPho: provinces.find(item => item.value === value).label })
    dispatch(changeInformationUser(account))
  }

  const handleChangeDistricts = value => {
    callApiWard(host + 'd/' + value + '?depth=2')
    setAccount({ ...account, quanHuyen: districts.find(item => item.value === value).label })
    dispatch(changeInformationUser(account))
  }

  const handleChangeWards = value => {
    setAccount({ ...account, xaPhuong: wards.find(item => item.value === value).label })
    dispatch(changeInformationUser(account))
  }

  const onChangeRadioGroupReceive = e => {
    setRadioReceive(e.target.value)
    setTypeReceiveGift(e.target.value)
  }

  return (
    <>
      <div>
        <div style={{ margin: `10px 10px`, fontWeight: 600 }}>
          THÔNG TIN KHÁCH HÀNG
        </div>

        <div className='cart bg-white' style={{ padding: 15 }}>
          <div
            style={{
              marginLeft: '1%',
              marginBottom: '-9px',
              marginTop: '-7px',
              justifyContent: 'space-evenly',
              display: 'flex'
            }}
          >
            <span style={{ fontSize: 14, width: '49%' }}>Họ và tên</span>

            <span style={{ fontSize: 14, width: '49%' }}>Số điện thoại</span>
          </div>

          <div
            style={{
              justifyContent: 'space-evenly',
              marginTop: 10,
              display: 'flex'
            }}
          >
            <Input
              id='outlined-basic'
              placeholder='Họ và tên'
              value={account?.hoVaTen}
              style={{ width: '49%', height: 40 }}
              onChange={e => {
                setAccount({
                  ...account,
                  hoVaTen: e.target.value
                })
              }}
            />
            <Input
              placeholder='Số điện thoại'
              value={account?.soDienThoai}
              style={{ width: '49%', height: 40 }}
              onChange={e => {
                setAccount({
                  ...account,
                  soDienThoai: e.target.value
                })
                dispatch(changeInformationUser(account))
              }}
            />
          </div>

          <div
            style={{
              marginLeft: '2%',
              marginBottom: '-9px',
              marginTop: 10,
              width: '99%'
            }}
          >
            <span style={{ fontSize: 14 }}>Email</span>
          </div>

          <div style={{ marginLeft: '1%' }}>
            <Input
              id='outlined-basic'
              placeholder='Email của bạn'
              value={account?.email}
              style={{ height: 40, marginTop: 10, width: '99%' }}
              onChange={e => {
                setAccount({
                 ...account,
                  email: e.target.value
                })
                dispatch(changeInformationUser(account))
              }}
            />
          </div>
        </div>

        <div style={{ margin: `10px 10px`, fontWeight: 600 }}>
          CHỌN ĐỊA CHỈ NHẬN HÀNG
        </div>

          <div style={{ marginLeft: 0 }}>
            {/* <Radio.Group
              onChange={onChangeRadioGroupReceive}
              value={radioReceive}
            > */}
              {/* <Radio value={4} checked={typeReceiveGift === 4 ? true : false}>
                Nhận tại cửa hàng
              </Radio> */}
              {/* <Radio value={3}>Giao tận nơi</Radio>
            </Radio.Group> */}
          </div>

          {typeReceiveGift === 4 ? (
            <></>
          ) : (
            <>
              <div>
                <div class='card' style={{ width: `100%`, backgroundColor: 'white' , borderRadius: 10 }}>
                  <CardContent>
                    <Typography variant='h5' component='div'>
                      Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển
                      (nếu có)
                    </Typography>
                    <Space wrap style={{ marginTop: '10px' }}>
                      <Select
                        defaultValue=''
                        style={{ width: `270px`, height: 40 }}
                        onChange={e => handleChangeProvinces(e)}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.label ?? '').includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={provinces}
                        showSearch
                      />

                      <Select
                        defaultValue=''
                        style={{ width: `270px`, height: 40 }}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.label ?? '').includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={handleChangeDistricts}
                        options={districts}
                        showSearch
                      />

                      <Select
                        defaultValue=''
                        style={{ width: `270px`, height: 40 }}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.label ?? '').includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={handleChangeWards}
                        options={wards}
                        showSearch
                      />

                      <Input
                        placeholder='Số nhà/Tên đường'
                        style={{ width: `270px`, height: 40, borderRadius: 13 }}
                        onChange={e => {
                          setAccount({
                            ...account,
                            diaChi: e.target.value
                          })
                          dispatch(changeInformationUser(account))
                        }}
                        value={account?.diaChi}
                      />

                    < TextArea rows={4} placeholder="Ghi chú" maxLength={18}  style={{ width: `550px` }}/>
                    </Space>
                  </CardContent>
                </div>
              </div>
            </>
          )}
      </div>
      <br />
    </>
  )
}

export default CartPage
