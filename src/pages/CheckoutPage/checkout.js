import React, { useState, useEffect } from 'react'
import '../CartPage/CartPage.scss'
import Button from '@mui/material/Button'
import { Space, Input } from 'antd'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { changeInformationUser } from '../../store/userSlice'
import { SetNote, SetSelectedCart } from '../../store/cartSlice'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Divider } from 'antd'
import toast, { Toaster } from 'react-hot-toast'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useSelector } from 'react-redux'
import { ResetItemNavbar } from '../../store/navbarSlice'

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

  // selected
  const [provinceSelected, setProvinceSelected] = useState('')
  const [districtSelected, setDistrictSelected] = useState('')
  const [wardSelected, setWardSelected] = useState('')
  const [nameSelected, setNameSelected] = useState('')
  const [phoneSelected, setPhoneSelected] = useState('')
  const [emailSelected, setEmailSelected] = useState('')
  const [addressInput, setAddressInput] = useState('')

  // redux
  const selectedCart = useSelector(state => state.cart.selectedCart)

  useEffect(() => {
    dispatch(ResetItemNavbar())
    if (account === undefined) {
      callAPI('https://provinces.open-api.vn/api/?depth=2')
      setAccount({
        ...props.account,
        tinhThanhPho: '',
        quanHuyen: '',
        xaPhuong: ''
      })
      setNameSelected(props.account.hoVaTen)
      setPhoneSelected(props.account.soDienThoai)
      setEmailSelected(props.account.email)
      getAllAddress()
      if (selectedCart === 0) {
        dispatch(SetSelectedCart(1))
      }
    }
    window.scrollTo(0, 0);
  })

  const formatMoney = number => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(number)
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

  const handleChangeProvinces = event => {
    if (event === undefined) return

    callApiDistrict(host + 'p/' + event.target.value + '?depth=2')
    setAccount({
      ...account,
      tinhThanhPho: provinces.find(item => item.value === event.target.value)
        .label
    })
    setProvinceSelected(event.target.value)
  }

  const handleChangeDistricts = event => {
    if (event === undefined) return

    callApiWard(host + 'd/' + event.target.value + '?depth=2')
    setAccount({
      ...account,
      quanHuyen: districts.find(item => item.value === event.target.value).label
    })
    setDistrictSelected(event.target.value)
  }

  const handleChangeWards = event => {
    if (event === undefined) return

    setAccount({
      ...account,
      xaPhuong: wards.find(item => item.value === event.target.value).label
    })
    setWardSelected(event.target.value)
  }

  const handleChooseAddress = value => {
    console.log(account)
    let newAddress = {
      ...props.account,
      diaChiList: value,
      diaChi: value.diaChi,
      tinhThanhPho: value.tinhThanhPho,
      quanHuyen: value.quanHuyen,
      xaPhuong: value.xaPhuong
    }
    setAccount(newAddress)
    setAddressSelected(3)
    toast.success('Chọn địa chỉ thành công')
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
          setAccount({
            ...props.account,
            diaChiList: []
          })
          if (res.data.length === 0) {
            setAddressSelected(1)
          } else {
            setAddressSelected(1)
          }
        }
      })
      .catch(error => console.log(error))
  }

  const checkValidate = data => {
    var flag = 0
    var vnf_regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (nameSelected === '' ? 'fail' : 'pass' === 'fail') {
      flag++
      toast.error('Quý khách vui lòng không được bỏ trống họ và tên')
    } else if (nameSelected.trim() === '') {
      if (flag === 0) {
        toast.error('Quý khách vui lòng không được bỏ trống họ và tên')
      }

      flag++
    }

    if (phoneSelected === null) {
      if (flag === 0) {
        toast.error('Quý khách vui này điền đầy đủ số điện thoại')
      }

      flag++
    } else if (phoneSelected.trim() === '') {
      if (flag === 0) {
        toast.error('Quý khách vui này điền đầy đủ số điện thoại')
      }

      flag++
    }

    if (!vnf_regex.test(phoneSelected)) {
      if (flag === 0) {
        toast.error('Quý khách phải nhập đúng định dạng số điện thoại')
      }

      flag++
    }

    if (emailSelected !== '' && emailSelected !== null) {
      if (!re.test(emailSelected)) {
        if (flag === 0) {
          toast.error(
            'Quý khách vui lòng nhập đúng định dạng email(abc@gmail.com)'
          )
        }

        flag++
      }
    }

    if (account.diaChiList.length === 0) {
      if (
        provinceSelected === '' ||
        districtSelected === '' ||
        wardSelected === '' ||
        addressInput === ''
      ) {
        if (flag === 0) {
          toast.error(
            'Quý khách vui lòng này chọn thành phố, quận huyện, địa chỉ'
          )
        }

        flag++
      }
    }

    if (flag === 0) {
      setAccount({
        ...account,
        hoVaTen: nameSelected,
        soDienThoai: phoneSelected,
        diaChi: addressInput
      })
      dispatch(changeInformationUser(account))
      dispatch(SetNote(note))
      props.stepCheckOutTwo(2)
    }
  }

  return (
    <>
      <div>
        <div
          style={{
            color: `#212b36`,
            fontSize: `16px`,
            fontWeight: `500`,
            lineHeight: `18px`,
            marginBottom: `10px`,
            marginTop: `15px`,
            textTransform: `uppercase`
          }}
        >
          THÔNG TIN KHÁCH HÀNG
        </div>

        <div
          className='cart bg-white'
          style={{
            padding: 20,
            backgroundcolor: `#fff!important`,
            border: `1px solid rgba(145,158,171,.239)`,
            borderRadius: `10px`,
            height: '185px'
          }}
        >
          <div style={{ display: `flex`, gap: `20px` }}>
            <div class='brise-input'>
              <input
                onChange={e => {
                  setAccount({
                    ...account,
                    hoVaTen: e.target.value
                  })
                  setNameSelected(e.target.value)
                }}
                type='text'
                name='text'
                value={nameSelected}
                required
              />
              <label>HỌ VÀ TÊN</label>
              <span class='line'></span>
            </div>

            <div class='brise-input'>
              <input
                onChange={e => {
                  setAccount({
                    ...account,
                    soDienThoai: e.target.value
                  })
                  setPhoneSelected(e.target.value)
                }}
                type='text'
                name='text'
                value={phoneSelected}
                required
              />
              <label>SỐ ĐIỆN THOẠI</label>
              <span class='line'></span>
            </div>
          </div>

          <div
            style={{
              borderRadius: `0`,
              height: `50px`,
              position: `relative`,
              width: `100%`,
              marginTop: '10px'
            }}
          >
            <div class='brise-input'>
              <input
                onChange={e => {
                  setEmailSelected(e.target.value)
                  setAccount({
                    ...account,
                    email: e.target.value
                  })
                  console.log(account)
                }}
                type='text'
                name='text'
                value={emailSelected}
                required
              />
              <label>EMAIL</label>
              <span class='line'></span>
            </div>

            <span
              style={{
                color: `#919eab`,
                fontSize: `10.5px`,
                fontStyle: `italic`,
                fontWeight: `400`,
                letterSpacing: `0`,
                lineHeight: `9px`,
                textAlign: `left`
              }}
            >
              (*) Hóa đơn VAT sẽ được gửi qua email này
            </span>
          </div>
        </div>

        <div
          style={{
            color: `#212b36`,
            fontSize: `16px`,
            fontWeight: `500`,
            lineHeight: `18px`,
            marginBottom: `10px`,
            marginTop: `15px`,
            textTransform: `uppercase`
          }}
        >
          CHỌN ĐỊA CHỈ NHẬN HÀNG
        </div>

        <div style={{ marginLeft: 0, marginTop: '5px' }}>
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
                class='cart bg-white'
                style={{
                  borderRadius: 10,
                  width: '100%',
                  padding: '20px'
                }}
              >
                {addressSelected === 1 ? (
                  <>
                    <div
                      style={{
                        display: `flex`,
                        gap: `15px`,
                        paddingBottom: `15px`,
                        width: `49%`,
                        marginTop: '5px'
                      }}
                    >
                      <FormControl
                        variant='standard'
                        sx={{ m: 1, minWidth: '100%', height: 50 }}
                      >
                        <InputLabel
                          className='label-select'
                          id='demo-simple-select-standard-label'
                        >
                          TỈNH/ THÀNH PHỐ
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={provinceSelected}
                          onChange={handleChangeProvinces}
                          sx={{
                            height: `50`
                          }}
                        >
                          {provinces.map((item, index) => {
                            return (
                              <MenuItem value={item.value}>
                                {item.label}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                      <FormControl
                        variant='standard'
                        sx={{ m: 1, minWidth: '100%', height: 50 }}
                      >
                        <InputLabel
                          className='label-select'
                          id='demo-simple-select-standard-label'
                        >
                          QUẬN/ HUYỆN
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={districtSelected}
                          onChange={handleChangeDistricts}
                          sx={{
                            height: `50`
                          }}
                        >
                          {districts.map((item, index) => {
                            return (
                              <MenuItem value={item.value}>
                                {item.label}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div
                      style={{
                        display: `flex`,
                        gap: `15px`,
                        paddingBottom: `15px`,
                        width: `49%`,
                        marginTop: '0px'
                      }}
                    >
                      <FormControl
                        variant='standard'
                        sx={{ m: 1, minWidth: '100%', height: 50 }}
                      >
                        <InputLabel
                          className='label-select'
                          id='demo-simple-select-standard-label'
                        >
                          PHƯỜNG/ XÃ
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={wardSelected}
                          onChange={handleChangeWards}
                          sx={{
                            height: `50`
                          }}
                        >
                          {wards.map((item, index) => {
                            return (
                              <MenuItem value={item.value}>
                                {item.label}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>

                      <div
                        class='brise-input'
                        style={{
                          minWidth: '100%',
                          height: 50,
                          marginTop: '-3px'
                        }}
                      >
                        <input
                          onChange={e => {
                            setAddressInput(e.target.value)
                            setAccount({
                              ...account,
                              diaChi: e.target.value
                            })
                          }}
                          type='text'
                          name='text'
                          required
                        />
                        <label>ĐỊA CHỈ </label>
                        <span class='line'></span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {listOfAddress &&
                  addressSelected === 2 &&
                  listOfAddress.map((value, index) => (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <input
                          style={{ width: '2%' }}
                          type='radio'
                          id='html'
                          name='fav_language'
                          value={value}
                          checked={
                            account.diaChiList.id === value.id ? 'checked' : ''
                          }
                          onClick={() => handleChooseAddress(value)}
                        ></input>
                        <div
                          style={{
                            marginTop: '10px',
                            width: '96%',
                            position: 'relative',
                            top: '10px'
                          }}
                        >
                          <div class='title'>
                            <div
                              style={{
                                color: `#212b36`,
                                display: `flex`,
                                flexWrap: `wrap`,
                                fontSize: `15px`,
                                fontWeight: `600`,
                                gap: `5px`
                              }}
                            >
                              {' '}
                              <span className='fw-6'>Địa chỉ {index + 1}</span>
                              {value.trangThai === 1 ? (
                                <div
                                  style={{
                                    backgroundColor: `rgb(18 141 226/20%)`,
                                    borderRadius: `6px`,
                                    color: `rgb(18 141 226)`,
                                    fontSize: `11px`,
                                    fontWeight: `500`,
                                    padding: `3px 8px`,
                                    textTransform: `uppercase`
                                  }}
                                >
                                  Mặc định
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: `#637381`,
                                fontSize: `14px`,
                                marginBottom: `5px`,
                                marginTop: `5px`
                              }}
                            >
                              {value.diaChi}, {value.xaPhuong},{' '}
                              {value.quanHuyen}, {value.tinhThanhPho} <br />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}

                {listOfAddress &&
                  addressSelected === 3 &&
                  listOfAddress.map((value, index) =>
                    account.diaChiList.id === value.id ? (
                      <>
                        <div class='title'>
                          <h4>
                            {' '}
                            <span className='fw-6'>Địa chỉ {index + 1}</span>
                            {value.trangThai === 1 ? (
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

                        <div>
                          <Space wrap style={{ display: 'flex' }}>
                            <div
                              style={{
                                fontSize: 18,
                                color: '#637381',
                                fontSize: '14px'
                              }}
                            >
                              {value.diaChi}, {value.xaPhuong},{' '}
                              {value.quanHuyen}, {value.tinhThanhPho} <br />
                            </div>
                          </Space>
                        </div>
                      </>
                    ) : (
                      <></>
                    )
                  )}

                {listOfAddress &&
                listOfAddress.length > 0 &&
                addressSelected === 1 ? (
                  <div
                    style={{
                      textAlign: 'right',
                      padding: `0px`,
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
                  <></>
                )}

                {listOfAddress &&
                listOfAddress.length > 0 &&
                addressSelected === 2 ? (
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
                  <></>
                )}

                {listOfAddress &&
                listOfAddress.length > 0 &&
                addressSelected === 3 ? (
                  <>
                    <span
                      style={{
                        textAlign: 'right',
                        padding: `10px`,
                        fontSize: 14,
                        color: '#444',
                        marginLeft: -8,
                        color: 'rgb(18, 141, 226)',
                        cursor: 'pointer',
                        display: 'inline-block',
                        textDecoration: `underline`
                      }}
                      onClick={() => {
                        setAddressSelected(2)
                      }}
                    >
                      chọn ({listOfAddress.length - 1}) địa chỉ khác
                    </span>
                    <span>hoặc</span>
                    <span
                      style={{
                        textAlign: 'right',
                        padding: `10px`,
                        fontSize: 14,
                        color: '#444',
                        marginLeft: -8,
                        width: '20%',
                        color: 'rgb(18, 141, 226)',
                        cursor: 'pointer',
                        display: 'inline-block',
                        textDecoration: `underline`
                      }}
                      onClick={() => {
                        setAddressSelected(1)
                      }}
                    >
                      nhập địa chỉ mới
                    </span>
                  </>
                ) : (
                  <></>
                )}

                <div class='brise-input'>
                  <input
                    onChange={e => {
                      setNote(e.target.value)
                    }}
                    type='text'
                    name='note'
                  />
                  <label>GHI CHÚ</label>
                  <span class='line'></span>
                </div>
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
      <br />
      <div
        className='countProductTemp'
        style={{ left: 393, width: 706, display: 'block' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold' }}>Tổng tiền tạm tính</span>
          <span style={{ fontWeight: 'bold', color: '#128DE2' }}>
            {formatMoney(props.totalAmount)}
          </span>
        </div>
        <Button
          variant='contained'
          style={{
            width: '100%',
            marginTop: 5,
            fontSize: 14
          }}
          onClick={() => {
            checkValidate(2)
          }}
        >
          Tiếp tục
        </Button>
      </div>
    </>
  )
}

export default CartPage
