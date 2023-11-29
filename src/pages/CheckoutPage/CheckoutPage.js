import React, { useState, useEffect } from 'react'
import '../CartPage/CartPage.scss'
import './CheckoutPage.css'
import { shopping_cart } from '../../utils/images'
import { Link } from 'react-router-dom'
import { Divider } from 'antd'
import Checkout from './checkout'
import axios from 'axios'
import Button from '@mui/material/Button'
import { Input } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined'
import { addToCart } from '../../store/cartSlice'
import toast, { Toaster } from 'react-hot-toast'
import { over } from 'stompjs'
import SockJS from 'sockjs-client'

var stompClient = null
const CartPage = () => {
  // const { itemsCount, totalAmount } = useSelector(state => state.cart)
  const [productDetails, setProductDetails] = useState([])
  const [totalAmount, setTotalAmount] = useState()
  const [changeCount, setChangeCount] = useState(new Map())
  const [checkoutState, setCheckoutState] = useState(1)
  const account = useSelector(state => state.user.user)
  const note = useSelector(state => state.cart.note)
  const [voucher, setVoucher] = useState('')
  const [codeVoucher, setCodeVoucher] = useState()
  const [paymentMethodCss, setPaymentMethodCss] = useState(1)
  const [bill, setBill] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // connect websocket
  const connect = () => {
    let Sock = new SockJS('http://localhost:8080/ws')
    stompClient = over(Sock)
    stompClient.connect({}, onConnected, onError)
  }

  const onConnected = () => {
    stompClient.subscribe('/bill/bills', onMessageReceived)
  }

  const onMessageReceived = payload => {
    var data = JSON.parse(payload.body)
    // console.log(data)
  }

  const onError = err => {
    console.log(err)
  }

  useEffect(() => {
    getProductDetails()
    if(stompClient === null){
      connect()
    }
  }, [totalAmount, productDetails])

  const getProductDetails = async () => {
    if (productDetails.length !== 0) return
    await axios
      .get(
        `http://localhost:8080/client/cart-detail/get-cart-details?id_customer=${account.id}`
      )
      .then(res => {
        setProductDetails(res.data)

        var totalCart = 0
        if (res.data.length === 0) return
        res.data.map(e => {
          console.log(e.donGia)
          totalCart +=
            Number(
              e.donGiaSauKhuyenMai === 0 ? e.donGia : e.donGiaSauKhuyenMai
            ) * Number(e.soLuongSapMua)
        })

        setTotalAmount(totalCart)
        setChangeCount(
          new Map(
            res.data.map(item => [item.idSanPhamChiTiet, item.soLuongSapMua])
          )
        )
      })
      .catch(res => console.log(res))
  }

  const formatMoney = number => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(number)
  }

  if (productDetails.length === 0) {
    return (
      <div className='container my-5'>
        <div className='empty-cart flex justify-center align-center flex-column font-manrope'>
          <img src={shopping_cart} alt='' />
          <span className='fw-6 fs-15 '>Giỏ hàng đang trống.</span>
          <Link
            to='/'
            className='shopping-btn text-white fw-5'
            style={{
              backgroundColor: `#128DE2`,
              border: '1px solid #128DE2',
              borderRadius: '10px'
            }}
          >
            Đi tới trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const checkoutStateButtonCssActive = () => {
    return {
      width: '100%',
      fontSize: 16,
      backgroundColor: '#128DE2'
    }
  }

  const checkoutStateButtonCssNoActive = () => {
    return {
      width: '100%',
      fontSize: 16,
      backgroundColor: '#707070'
    }
  }

  const checkoutStateTitleCssActive = () => {
    return {
      textAlign: `center`,
      width: `46%`,
      fontWeight: '600',
      color: '#128DE2'
    }
  }

  const checkoutStateTitleCssNoActive = () => {
    return {
      textAlign: `center`,
      width: `46%`,
      fontWeight: '600',
      color: '#707070'
    }
  }

  const orderSuccess = async () => {
    let idOrder = ''
    const orderRequest = {
      tongTien:
        totalAmount + Number(voucher === '' ? 0 : voucher.giaTriVoucher),
      tienThua: 0,
      tongTienSauKhiGiam: Number(totalAmount),
      tienKhachTra:
        totalAmount + Number(voucher === '' ? 0 : voucher.giaTriVoucher),
      trangThai: 'PENDING_CONFIRM',
      loaiHoaDon: 'DELIVERY',
      phiShip: 0,
      ghiChu: note,
      soDienThoaiNguoiNhan: account && account.soDienThoai,
      tenNguoiNhan: (account && account.hoVaTen) || null,
      diaChiNguoiNhan: account && account.diaChi,
      quanHuyenNguoiNhan: account && account.quanHuyen,
      tinhThanhPhoNguoiNhan: account && account.tinhThanhPho,
      xaPhuongNguoiNhan: account && account.xaPhuong,
      idKhachHang: account && account.id,
      isPayment: true,
      isUpdateInfo: false,
      isUpdateVoucher: false,
      voucher: voucher === '' ? null : voucher,
      paymentMethod: paymentMethodCss
    }

    try {
      await axios
        .post(`http://localhost:8080/client/bill/create-bill`, orderRequest)
        .then(response => {
          console.log(response)
          setBill(response.data)
          idOrder = response.data.id
        })
    } catch (error) {}

    if (idOrder !== '') {
      productDetails.forEach(async e => {
        console.log(e)
        let productDetail = {
          donGia: e.donGia,
          soLuong: e.soLuongSapMua,
          thanhTien:
            Number(e.donGiaSauKhuyenMai) === 0
              ? Number(e.donGia) * Number(e.soLuongSapMua)
              : Number(e.donGiaSauKhuyenMai) * Number(e.soLuongSapMua),
          idSanPhamChiTiet: e.idSanPhamChiTiet,
          idHoaDon: idOrder,
          donGiaSauKhiGiam: e.donGiaSauKhuyenMai,
          idKhachHang: account.id
        }
        try {
          await axios
            .post(
              `http://localhost:8080/client/bill-detail/create-bill-detail`,
              productDetail
            )
            .then(response => {
              console.log(response)
            })
        } catch (error) {
          console.log(error)
        }
      })
    }

    var hello = {
      name: 'hello server'
    }

    if (stompClient) {
      stompClient.send('/app/bills', {}, JSON.stringify(hello))
    }

    toast.success('Đặt hàng thành công')
    dispatch(addToCart(0))
    setCheckoutState(3)
  }

  const checkVoucher = async () => {
    if (voucher !== null || voucher !== undefined || voucher !== '') {
      if (voucher.ma === codeVoucher) {
        toast.error('Bạn đã sử dụng voucher này rồi.Vui lòng nhập voucher khác')
        return
      }
    }

    await axios
      .get(
        `http://localhost:8080/client/voucher/check-voucher?code=${codeVoucher}`
      )
      .then(res => {
        if (res.data.dieuKienApDung > totalAmount) {
          toast.error('Hoá đơn này không đạt đủ điều kiện áp dụng')
        } else {
          let priceWhenAfterVoucherUsed =
            Number(totalAmount) - Number(res.data.giaTriVoucher)
          setTotalAmount(priceWhenAfterVoucherUsed)
          setVoucher(res.data)
          toast.success('Áp dụng voucher thành công.')
        }
      })
      .catch(error => {
        if (error.response.status === 400) toast.error(error.response.data)
      })
  }

  const paymentMethodSelected = () => {
    return {
      width: `170px`,
      border: `1px solid #126de4`,
      height: `54px`,
      borderRadius: `10px`,
      textAlign: 'center'
    }
  }

  const paymentMethodNotSelected = () => {
    return {
      width: `170px`,
      border: `1px solid rgb(197 192 192)`,
      height: `54px`,
      borderRadius: `10px`,
      textAlign: 'center'
    }
  }

  const stepCheckOutTwo = (data) => {
    setCheckoutState(2)
  }

  return (
    <>
      <h3
        className='text-center fw-5'
        style={{ marginTop: 30, marginBottom: -10 }}
      >
        {checkoutState === 3 ? (
          <></>
        ) : (
          <span>
            <i
              onClick={() => {
                console.log(checkoutState)
                if(checkoutState === 1){
                  navigate('/cart')
                }else if(checkoutState === 2){
                  setCheckoutState(1)
                }
              }}
              class='fa fa-arrow-left'
              style={{ transform: 'translateX(-271px)' }}
            ></i>
          </span>
        )}

        <span style={{ fontWeight: 600 }}>
          {checkoutState === 1 ? 'Thông tin' : ''}
          {checkoutState === 2 ? 'Thanh toán' : ''}
          {checkoutState === 3 ? 'Hoàn thành' : ''}
        </span>
      </h3>

      <Divider
        style={{ margin: ' 10px auto', width: '45%', minWidth: '45%' }}
      />
      {checkoutState === 3 ? (
        <></>
      ) : (
        <div className='title_checkout'>
          <div
            style={
              checkoutState === 1
                ? checkoutStateTitleCssActive()
                : checkoutStateTitleCssNoActive()
            }
          >
            1. Thông tin
            <Button
              variant='contained'
              style={
                checkoutState === 1
                  ? checkoutStateButtonCssActive()
                  : checkoutStateButtonCssNoActive()
              }
            ></Button>
          </div>

          <div
            style={
              checkoutState === 2
                ? checkoutStateTitleCssActive()
                : checkoutStateTitleCssNoActive()
            }
          >
            2. Thanh toán
            <Button
              variant='contained'
              style={
                checkoutState === 2
                  ? checkoutStateButtonCssActive()
                  : checkoutStateButtonCssNoActive()
              }
            ></Button>
          </div>
        </div>
      )}

      {checkoutState === 3 ? (
        <>
          <div
            className='container'
            style={{ margin: `20px auto`, width: `50%`, borderRadius: '10px' }}
          >
            <div
              className='cart bg-white'
              style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '600',
                padding: `27px`,
                backgroundColor: 'rgba(255, 193, 7, 0.12)'
              }}
            >
              Đơn hàng đang được xử lí
            </div>
          </div>
        </>
      ) : (
        <> </>
      )}

      {checkoutState === 1 ? (
        <div
          className='container'
          style={{ margin: `20px auto`, width: `50%`, borderRadius: '10px' }}
        >
          <div className='cart bg-white'>
            <div className='cart-ctable'>
              <div className='cart-cbody bg-white'>
                {productDetails.map(product => {
                  return (
                    <>
                      <div
                        className='cart-ctr'
                        key={product?.id}
                        style={{ marginTop: 10 }}
                      >
                        <div className='cart-ctd'>
                          <img
                            style={{ width: 112, height: 105 }}
                            src={product.duongDan}
                          />
                        </div>
                        <div
                          className='cart-ctd'
                          style={{ position: 'relative', top: '0px' }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: 550,
                              height: 140,
                              marginLeft: 10
                            }}
                          >
                            <div style={{ width: '127%', marginTop: 17 }}>
                              <span className='cart-ctxtf fw-7'>
                                {product?.tenSanPham +
                                  ' ' +
                                  product?.dungLuongRam +
                                  'GB ' +
                                  product?.dungLuongRom +
                                  'GB - ' +
                                  product?.tenMauSac}
                              </span>
                              <br />
                              <span>
                                <span
                                  className='cart-ctxt'
                                  style={{
                                    color: '#128DE2',
                                    fontSize: '17px',
                                    fontWeight: 500
                                  }}
                                >
                                  {formatMoney(
                                    product?.donGiaSauKhuyenMai === 0
                                      ? product?.donGia
                                      : product?.donGiaSauKhuyenMai
                                  )}
                                </span>
                                <del
                                  style={{
                                    color: '#999',
                                    fontSize: '14px',
                                    marginLeft: '5px',
                                    fontWeight: 500
                                  }}
                                >
                                  {product?.donGiaSauKhuyenMai === 0
                                    ? ''
                                    : formatMoney(product?.donGia)}
                                </del>
                              </span>
                            </div>
                            <div
                              style={{
                                width: '58%',
                                marginTop: 42,
                                fontWeight: 500
                              }}
                            >
                              Số lượng :
                              <span style={{ color: '#128DE2' }}>
                                {' ' + product?.soLuongSapMua}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='cart-ctd'></div>
                        <div className='cart-ctd'></div>

                        <div className='cart-ctd'></div>
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </div>

          <Checkout account={account}  stepCheckOutTwo={stepCheckOutTwo} totalAmount={totalAmount}/>
          <br/>
          <br/> 
       
          <br />
        </div>
      ) : (
        <> </>
      )}

      {checkoutState === 2 ? (
        <>
          <div
            className='cart bg-white'
            style={{
              padding: 15,
              margin: `5px auto`,
              width: `47%`,
              borderRadius: '10px'
            }}
          >
            <div>
              <Input
                placeholder='Nhập mã giảm giá hoặc phiếu mua hàng'
                onChange={e => {
                  setCodeVoucher(e.target.value)
                }}
                style={{
                  width: '75%',
                  margin: `0px 0px`,
                  fontSize: 16,
                  top: '12px',
                  height: 40
                }}
              />
              <Button
                variant='contained'
                style={{
                  width: '20%',
                  marginLeft: 15,
                  marginTop: 22,
                  fontSize: 16
                }}
                onClick={checkVoucher}
              >
                Áp dụng
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Số lượng sản phẩm
              </div>

              <div style={{ style: '#707070' }}> {productDetails.length}</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Tiền hàng (tạm tính)
              </div>

              <div style={{ style: '#707070' }}>
                {formatMoney(
                  totalAmount +
                    Number(voucher === '' ? 0 : voucher.giaTriVoucher)
                )}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Phí vận chuyển
              </div>

              <div style={{ style: '#707070' }}>Miễn phí</div>
            </div>

            {voucher && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 15
                }}
              >
                <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                  Phiếu giảm giá
                </div>

                <div style={{ color: 'red' }}>
                  - {formatMoney(voucher?.giaTriVoucher)}
                </div>
              </div>
            )}

            <Divider />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div>
                <span style={{ marginLeft: '-12px', fontWeight: 600 }}>
                  Tổng tiền
                </span>
                <span style={{ color: 'rgb(155 148 148)' }}>(đã gồm VAT)</span>
              </div>

              <div style={{ marginLeft: '-12px', fontWeight: 600 }}>
                {formatMoney(totalAmount)}
              </div>
            </div>
          </div>

          <div
            style={{
              margin: `10px auto`,
              width: `47%`,
              borderRadius: '10px'
            }}
          >
            HÌNH THỨC THANH TOÁN
          </div>

          <div
            className='cart bg-white'
            style={{
              padding: 15,
              margin: `5px auto`,
              width: `47%`,
              borderRadius: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <div
                style={
                  paymentMethodCss === 3
                    ? paymentMethodSelected()
                    : paymentMethodNotSelected()
                }
                onClick={() => {
                  setPaymentMethodCss(3)
                }}
              >
                <CreditCardIcon
                  style={{
                    fontSize: '27px',
                    position: 'relative',
                    padding: 3,
                    left: '44px',
                    color: '#444'
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    position: 'relative',
                    top: '15px',
                    left: '-13px'
                  }}
                >
                  Thanh toán online
                </span>
              </div>

              <div
                style={
                  paymentMethodCss === 2
                    ? paymentMethodSelected()
                    : paymentMethodNotSelected()
                }
                onClick={() => {
                  setPaymentMethodCss(2)
                }}
              >
                <CalendarMonthIcon
                  style={{
                    fontSize: '27px',
                    position: 'relative',
                    padding: 3,
                    left: '63px',
                    color: '#444'
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    position: 'relative',
                    top: '15px',
                    left: '-13px'
                  }}
                >
                  Chuyển khoản ngân hàng
                </span>
              </div>

              <div
                style={
                  paymentMethodCss === 1
                    ? paymentMethodSelected()
                    : paymentMethodNotSelected()
                }
                onClick={() => {
                  setPaymentMethodCss(1)
                }}
              >
                <LocalAtmOutlinedIcon
                  style={{
                    fontSize: '27px',
                    position: 'relative',
                    padding: 3,
                    left: '61px',
                    color: '#444'
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    position: 'relative',
                    top: '15px',
                    left: '-13px'
                  }}
                >
                  Thanh toán khi nhận hàng
                </span>
              </div>

              <div></div>
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
              textTransform: `uppercase`,
              margin: `10px auto`,
              width: `47%`,
            }}
          >
            THÔNG TIN NHẬN HÀNG
          </div>

          <div
            className='cart bg-white'
            style={{
              padding: 15,
              margin: `5px auto`,
              width: `47%`,
              borderRadius: '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Khách hàng
              </div>

              <div style={{ style: '#707070' }}>{account?.hoVaTen}</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Số điện thoại
              </div>

              <div style={{ style: '#707070' }}>{account?.soDienThoai}</div>
            </div>

              {
                account.email === null || account.email === '' ? (
                  <>  </>
                ):(
                  <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: 15
                  }}
                >
                  <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                    Email
                  </div>
    
                  <div style={{ style: '#707070' }}>{account?.email}</div>
                </div>
                )
              }
           

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Nhận hàng tại
              </div>

              <div
                style={{
                  style: '#707070',
                  wordWrap: 'wrap',
                  width: '300px',
                  textAlign: 'right'
                }}
              >
                {account?.diaChi}, {account?.xaPhuong}, {account?.quanHuyen},{' '}
                {account?.tinhThanhPho}
              </div>
            </div>

            {
                note === null || note === '' ? (
                  <>  </>
                ):(
                  <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: 15
                  }}
                >
                  <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                    Ghi chú
                  </div>
    
                  <div style={{ style: '#707070' }}>{note}</div>
                </div>
                )
              }
          </div>
          <br />
          <div
            className='countProductTemp'
            style={{ left: 395, width: '47%', display: 'block' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold' }}>Tổng tiền</span>
              <span style={{ fontWeight: 'bold', color: '#128DE2' }}>
                {formatMoney(totalAmount)}
              </span>
            </div>
            <div>
              <Button
                variant='contained'
                style={{
                  width: '100%',
                  marginTop: 5,
                  fontSize: 16
                }}
                onClick={orderSuccess}
              >
                Hoàn thành
              </Button>
            </div>
          </div>
    <br/>
    <br/>
    <br/>
        
        </>
      ) : (
        <></>
      )}

      {checkoutState === 3 ? (
        <>
          <div
            style={{
              color: `#212b36`,
              width: '46%',
              margin: '0 auto',
              fontSize: `16px`,
              fontWeight: `500`,
              lineHeight: `18px`,
              marginBottom: `10px`,
              marginTop: `15px`,
              textTransform: `uppercase`
            }}
          >
            THÔNG TIN ĐƠN HÀNG
          </div>

          <div
            className='cart bg-white'
            style={{
              padding: 15,
              margin: `5px auto`,
              width: `47%`,
              borderRadius: '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div>
                <span style={{ marginLeft: '-12px', fontWeight: 600 }}>
                  Mã đơn hàng
                </span>
              </div>

              <div style={{ marginLeft: '-12px', fontWeight: 600 }}>
                {bill.ma}
              </div>
            </div>

            <Divider />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Số lượng sản phẩm
              </div>

              <div style={{ style: '#707070' }}> {productDetails.length}</div>
            </div>

            {voucher && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 15
                }}
              >
                <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                  Phiếu giảm giá
                </div>

                <div style={{ color: 'red' }}>
                  - {formatMoney(voucher?.giaTriVoucher)}
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Tổng tiền
              </div>

              <div style={{ style: '#707070' }}>{formatMoney(totalAmount)}</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Phí vận chuyển
              </div>

              <div style={{ style: '#707070' }}>Miễn phí</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Hình thức thanh toán
              </div>

              <div style={{ style: '#707070' }}>
                {paymentMethodCss === 1
                  ? 'Thanh toán khi nhận hàng'
                  : 'Thanh toán online'}
              </div>
            </div>

            <Divider />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div>
                <span style={{ marginLeft: '-12px', fontWeight: 600 }}>
                  Cần thanh toán
                </span>
              </div>

              <div style={{ marginLeft: '-12px', fontWeight: 600 }}>
                {formatMoney(totalAmount)}
              </div>
            </div>
          </div>

          <div
            style={{
              color: `#212b36`,
              width: '46%',
              margin: '0 auto',
              fontSize: `16px`,
              fontWeight: `500`,
              lineHeight: `18px`,
              marginBottom: `10px`,
              marginTop: `15px`,
              textTransform: `uppercase`
            }}
          >
            THÔNG TIN NHẬN HÀNG
          </div>

          <div
            className='cart bg-white'
            style={{
              padding: 15,
              margin: `5px auto`,
              width: `47%`,
              borderRadius: '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Khách hàng
              </div>

              <div style={{ style: '#707070' }}>{account?.hoVaTen}</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Số điện thoại
              </div>

              <div style={{ style: '#707070' }}>{account?.soDienThoai}</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 15
              }}
            >
              <div style={{ color: 'rgb(155 148 148)', marginLeft: '-12px' }}>
                Nhận hàng tại
              </div>

              <div
                style={{
                  style: '#707070',
                  wordWrap: 'wrap',
                  width: '300px',
                  textAlign: 'right'
                }}
              >
                {account?.diaChi}, {account?.xaPhuong}, {account?.quanHuyen},{' '}
                {account?.tinhThanhPho}
              </div>
            </div>
          </div>

          <div
            style={{
              margin: `10px auto`,
              width: `47%`,
              borderRadius: '10px'
            }}
          >
            DANH SÁCH SẢN PHẨM
          </div>

          <div
            className='cart bg-white'
            style={{ width: '47%', margin: '0 auto' }}
          >
            <div className='cart-ctable'>
              <div className='cart-cbody bg-white'>
                {productDetails.map(product => {
                  return (
                    <>
                      <div
                        className='cart-ctr'
                        key={product?.id}
                        style={{ marginTop: 10 }}
                      >
                        <div className='cart-ctd'>
                          <img
                            style={{ width: 112, height: 105 }}
                            src='https://cdn.tgdd.vn/Products/Images/42/235838/Galaxy-S22-Ultra-Black-200x200.jpg'
                          />
                        </div>
                        <div
                          className='cart-ctd'
                          style={{ position: 'relative', top: '0px' }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: 550,
                              height: 140,
                              marginLeft: 10
                            }}
                          >
                            <div style={{ width: '127%', marginTop: 17 }}>
                              <span className='cart-ctxtf fw-7'>
                                {product?.tenSanPham +
                                  ' ' +
                                  product?.dungLuongRam +
                                  'GB ' +
                                  product?.dungLuongRom +
                                  'GB - ' +
                                  product?.tenMauSac}
                              </span>
                              <br />
                              <span>
                                <span
                                  className='cart-ctxt'
                                  style={{
                                    color: '#128DE2',
                                    fontSize: '17px',
                                    fontWeight: 500
                                  }}
                                >
                                  {formatMoney(
                                    product?.donGiaSauKhuyenMai === 0
                                      ? product?.donGia
                                      : product?.donGiaSauKhuyenMai
                                  )}
                                </span>
                                <del
                                  style={{
                                    color: '#999',
                                    fontSize: '14px',
                                    marginLeft: '5px',
                                    fontWeight: 500
                                  }}
                                >
                                  {product?.donGiaSauKhuyenMai === 0
                                    ? ''
                                    : formatMoney(product?.donGia)}
                                </del>
                              </span>
                            </div>
                            <div
                              style={{
                                width: '58%',
                                marginTop: 42,
                                fontWeight: 500
                              }}
                            >
                              Số lượng :
                              <span style={{ color: '#128DE2' }}>
                                {' ' + product?.soLuongSapMua}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='cart-ctd'></div>
                        <div className='cart-ctd'></div>

                        <div className='cart-ctd'></div>
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </div>
          <br />

          <div
            className='countProductTemp'
            style={{
              left: 395,
              width: '47%',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button
              variant='outlined'
              style={{
                width: '48%',
                marginTop: 5,
                fontSize: 14
              }}
              onClick={() => {
                navigate('/')
              }}
            >
              Tiếp tục mua hàng
            </Button>

            <Button
              variant='contained'
              style={{
                width: '48%',
                marginTop: 5,
                fontSize: 14
              }}
              onClick={() => {
                navigate(`/look-up-order-page`)
              }}
            >
              Kiểm tra đơn hàng
            </Button>
          </div>
          <br />
          <br />

        </>
      ) : (
        <></>
      )}

      {/* toaster */}
      {
        checkoutState === 2 || checkoutState === 3 ? (
          <Toaster
          style={{ zIndex: -1, overflow: 'hidden', opacity: 0 }}
           position='top-center'
           reverseOrder={false}
           gutter={8}
           containerClassName='hhe'
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
        ):(<></>)
      }
    
    </>
  )
}

export default CartPage
