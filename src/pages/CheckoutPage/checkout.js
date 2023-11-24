import React, { useState, useEffect } from 'react'
import '../CartPage/CartPage.scss'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Select, Space, Input } from 'antd'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { changeInformationUser } from '../../store/userSlice'
import { SetNote } from '../../store/cartSlice'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Divider } from 'antd'
import toast, { Toaster } from 'react-hot-toast'

const { TextArea } = Input

const CartPage = props => {
  const host = 'https://provinces.open-api.vn/api/'
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [account, setAccount] = useState()
  const [typeReceiveGift, setTypeReceiveGift] = useState(3)
  const [note, setNote] = useState()
  const dispatch = useDispatch()
  const [listOfAddress, setListOfAddress] = useState([])
  const [addressSelected, setAddressSelected] = useState(1)

  useEffect(() => {
    callAPI('https://provinces.open-api.vn/api/?depth=2')
    setAccount(props.account)
    getAllAddress()
    window.scrollTo(0, 0);
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
    setAccount({
      ...account,
      tinhThanhPho: provinces.find(item => item.value === value).label
    })
    dispatch(changeInformationUser(account))
  }

  const handleChangeDistricts = value => {
    callApiWard(host + 'd/' + value + '?depth=2')
    setAccount({
      ...account,
      quanHuyen: districts.find(item => item.value === value).label
    })
    dispatch(changeInformationUser(account))
  }

  const handleChangeWards = value => {
    setAccount({
      ...account,
      xaPhuong: wards.find(item => item.value === value).label
    })
    dispatch(changeInformationUser(account))
  }

  const handleChooseAddress = value => {
    let newAddress ={
      ...account,
      diaChi: value.diaChi,
      tinhThanhPho: value.tinhThanhPho,
      quanHuyen: value.quanHuyen,
      xaPhuong: value.xaPhuong

    }
    setAccount(newAddress)
    toast.success("Chọn địa chỉ thành công")
    dispatch(changeInformationUser(newAddress))
  }

  const getAllAddress = async () => {
    await axios
      .get(
        `http://localhost:8080/client/address/get-all-address?id_account=${props.account.id}`
      )
      .then(res => {
        if (res.status === 200) {
          setListOfAddress(res.data)
          if(res.data.length === 0){
            setAddressSelected(1)
          }else{
            setAddressSelected(2)
          }
        }
      })
      .catch(error => console.log(error))
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
                dispatch(changeInformationUser(account))
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
              <div
                class='card'
                style={{
                  width: `100%`,
                  backgroundColor: 'white',
                  borderRadius: 10
                }}
              >
                <CardContent>
                  <Typography variant='h5' component='div'>
                    Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển
                    (nếu có)
                  </Typography>
                  
                  {addressSelected === 1 ? (
                    <Space wrap style={{ marginTop: '10px' }}>
                      <Select
                        defaultValue=''
                        style={{ width: `313px`, height: 40 }}
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
                        style={{ width: `313px`, height: 40 }}
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
                        style={{ width: `313px`, height: 40 }}
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
                        style={{ width: `313px`, height: 40, borderRadius: 13 }}
                        onChange={e => {
                          setAccount({
                            ...account,
                            diaChi: e.target.value
                          })
                          dispatch(changeInformationUser(account))
                        }}
                        value={account?.diaChi}
                      />
                    </Space>
                  ) : (
                    <></>
                  )}

                  {listOfAddress &&
                    addressSelected === 2 &&
                    listOfAddress.map((value, index) => (
                      <div
                        class='card'
                        style={{ width: `100%`, marginTop: 10 }}
                      >
                        <div class='title'>
                          <h4>
                            {' '}
                            <span className='fw-6'>Địa chỉ {index + 1}</span>
                            {
                                account.diaChi === value.diaChi && account.xaPhuong === value.xaPhuong
                                && account.quanHuyen === value.quanHuyen && account.tinhThanhPho === value.tinhThanhPho
                                ? (
                              <div
                                style={{
                                  display: 'inline-block',
                                  marginLeft: 10,
                                  color: '#128DE2',
                                  fontSize: 9,
                                  padding: 4,
                                  border: '1px solid #128DE2',
                                  borderRadius: 5,
                                  transform: `translateY(-4px)`
                                }}
                              >
                                Mặc định
                              </div>
                            ) : (
                              <></>
                            )}
                          </h4>
                          <h4> </h4>
                        </div>

                        <Divider style={{ margin: `10px auto` }} />

                        <div>
                          <Space wrap style={{ display: 'flex' }}>
                            <div style={{ fontSize: 18 }}>
                              Địa chỉ: {value.diaChi}, {value.xaPhuong},{' '}
                              {value.quanHuyen}, {value.tinhThanhPho} <br />
                              {
                                account.diaChi === value.diaChi && account.xaPhuong === value.xaPhuong
                                && account.quanHuyen === value.quanHuyen && account.tinhThanhPho === value.tinhThanhPho
                                ? (
                                 <></> 
                                ):(
                                  <div
                                  style={{
                                    display: 'inline-block',
                                    backgroundColor: `#128DE2`,
                                    color: `white`,
                                    fontSize: '15px',
                                    display: 'inline-block',
                                    padding: '6px',
                                    borderRadius: '5px',
                                    marginLeft: 184,
                                    cursor: 'pointer'
                                  }}
                                  variant='outlined'
                                  onClick={() => handleChooseAddress(value)}
                                >
                                  {' '}
                                  Chọn địa chỉ này{' '}
                                </div>
                                )
                              }
                             
                            </div>
                          </Space>
                        </div>
                      </div>
                    ))}

                  {listOfAddress && listOfAddress.length > 0 && addressSelected === 1 ? (
                    <div
                      style={{
                        textAlign: 'right',
                        padding: `10px`,
                        fontSize: 14,
                        color: '#444',
                        marginLeft: -8,
                        width: '97%',
                        color: 'rgb(18, 141, 226)',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setAddressSelected(2)
                      }}
                    >
                      chọn từ Số địa chỉ{' '}
                      <ArrowForwardIosIcon style={{ fontSize: 11 }} />
                    </div>
                  ) : (
                    <>
                    </>
                  )}

                  {listOfAddress && listOfAddress.length > 0 && addressSelected === 2 ? (
                    <div
                    style={{
                      textAlign: 'right',
                      padding: `10px`,
                      fontSize: 14,
                      color: '#444',
                      marginLeft: -8,
                      width: '97%',
                      color: 'rgb(18, 141, 226)',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setAddressSelected(1)
                    }}
                  >
                    chọn địa chỉ mới
                    <ArrowForwardIosIcon style={{ fontSize: 11 }} />
                  </div>
                  ) : (
                    <>
                    </>
                  )}

                  <TextArea
                    rows={6}
                    placeholder='Ghi chú'
                    maxLength={20}
                    onChange={e => {
                      dispatch(SetNote(e.target.value))
                      setNote(e.target.value)
                    }}
                    style={{ width: `634px`, marginTop: 10 }}
                  />
                </CardContent>
              </div>
            </div>
          </>
        )}
      </div>
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
              secondary: '#4caf50',
            },
            style: {
              background: '#4caf50',
              color: 'white'
            },
          },

          error: {
            duration: 3000,
            theme: {
              primary: '#f44336',
              secondary: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#f44336',
            },
            style: {
              background: '#f44336',
              color: 'white'
            },
          }
        }}/>
      <br />
    </>
  )
}

export default CartPage
