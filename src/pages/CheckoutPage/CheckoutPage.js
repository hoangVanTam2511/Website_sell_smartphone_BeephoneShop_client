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

const CartPage = () => {
  // const { itemsCount, totalAmount } = useSelector(state => state.cart)
  const [productDetails, setProductDetails] = useState([])
  const [totalAmount, setTotalAmount] = useState()
  const [changeCount, setChangeCount] = useState(new Map())
  const [checkoutState, setCheckoutState] = useState(1)
  const account = useSelector(state => state.user.user)
  const [bill, setBill] = useState({
    "tenNguoiNhan": '',
    "soDienThoaiNguoiNhan": '',
    "diaChiNguoiNhan": '',
    "tongTien": '',
    "tienThua": '',
    "tongTienSauKhiGiam": "",
    "ghiChu": "",
    "phiShip": "",
    "phuong_thuc_thanh_toan": "",
    "linh_su_hoa_don": "",
    "voucher": ""
  })
  const [billDetail, setBillDetail] = useState({
    "donGia": "",
    "soLuong": "",
    "thanhTien": "",
    "idSanPhamChiTiet": "",
    "idHoaDon": "",
  })

  useEffect(() => {
    getProductDetails()
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
          totalCart += Number(e.donGiaSauKhuyenMai === 0 ? e.donGia : e.donGiaSauKhuyenMai) * Number(e.soLuongSapMua)
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

  return (
    <>
      <h3
        className='text-center fw-5'
        style={{ marginTop: 30, marginBottom: -10 }}
      >
        <span>
          <i
            class='fa fa-arrow-left'
            style={{ transform: 'translateX(-240px)' }}
          ></i>
        </span>

        <span style={{ fontWeight: 600 }}>
          {checkoutState === 1 ? 'Thông tin' : 'Thanh toán'}
        </span>
      </h3>

      <Divider
        style={{ margin: ' 10px auto', width: '45%', minWidth: '45%' }}
      />

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
                        <div className='cart-ctd'>
                        </div>

                        <div className='cart-ctd'></div>
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </div>

          <Checkout account={account}  />
          <div className='countProductTemp' style={{ left: 355, width: '47%', display: 'block' }}>
            <div style={{ fontWeight: 'bold' }}>
              Tổng tiền tạm tính 
              <span style={{ fontWeight: 'bold', color: '#128DE2', marginLeft: 377 }}>
                {formatMoney(totalAmount)}
              </span>
              <Button
                variant='contained'
                style={{
                  width: '100%',
                  marginTop: 5,
                  fontSize: 14
                }}
                onClick={() => {
                  setCheckoutState(2)
                }}
              >
                Tiếp tục
              </Button>
            </div>
        
      </div>
          <br />
        </div>
      ) : (
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

              <div style={{ style: '#707070' }}>01</div>
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

              <div style={{ style: '#707070' }}>3.990.000 đ</div>
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
                3.990.000 đ
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
            THÔNG TIN THANH TOÁN
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
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex' }}>
                <img
                  style={{ width: '16%' }}
                  src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAC8CAMAAAC672BgAAAAeFBMVEX///8AXrgAWrcAUrQAULNHf8X6/f8AYLk2dcEAV7ba5fIATbKDptYAWbY+ecIAXLezyOXU4fHr8vm/0enN2+5djct2ntLk7ffw9vtymdBkkc0TZ7ymvN9ViMkha71EfcSTsdu6zeeZtt0AR7EAQq+IqtepxOSXtNwpg3bBAAAFBklEQVR4nO3caXeqOhgFYDKgxBhflUHEqdqj9///wxscqFY4Vi63gtnPh7MqulD3geTN0HoeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALyLaB40Kh6/+hvVl2nDG2VkMH31l6opEySo3yAmyCx6r/5atUSaKGz2ow8CEvtGz/hb5kZsmz7nVNGi6XP+ig03zV/SI9KNn/M3jDhvPgyfI4wCwrjSvTAm26W1JoQxybgUQilFzoeRrrQho4TlfBiRMCT4fBmGYRQQpb2GeX53utalJtW/DKZGRKJxxLoSRiKZjItHI2L/h46E4QvSVyMHl8OYrhXp6/kGh8OY5NMNk+sj7oYxlqTWtxMvzoax1yRW3465GkYsSQ6/H3QzjHRkm87l3WEbBjU7BWq1vc4Y9A2p6P64Lbr8xi3aXYGGisxiVvKEHcI3/27tHpvsbNO5KR2QuTefkdimc17+lGth9FaC5EfFk46FMVsoEmHVs26FEdmmkw0qnz6H0Ztvzj3BJjkeH2+KvuFYvk/j4gUfD9+zrWHkFXiQVj9/DmOsiyLh89gBfy3AnorWvSxe8OfhSmpLwxhKEvHfXnAOY9qXF4tjdHN9eawP+eNIFY83D9+1nWHkTefflz2LNuNr0s4rfXx/oFobw0jXiskHmyVcaUAHrLwCv+FIGFvbdC4etnWOhPHJhP/4e1aGMdt+zONVtqwTVfvC2HwmP3hVeRiTpC+FMoYbVWf7RvvC8MoGqXfKwghHWhFXQmotDenK6rVSC8P4kfswwkASCbnahbO0N4gV0dN3yruEkUfBZfDVIWdGHJ496XuEsV3bq0JurvvjgTQVo/9q7xDG6aoY3ZYmqTDfZ9Qf6n4Ypyg236u0SKif9Eo3uh7GtjwKrxeQfLo76XYYeVvBpX9fuw8WhgdPn7S7YdD5BimJIp8NMeZH9cqNzoZBrDIKL9Ek6myK72oYQb6iJv1JyVPTQJSsR/5EN8PYrg3jclUWhRcqTqrevvLOhbGMs7gvqq4Kz/vQpErX4H6ga2HM/hhjyJS3FbbU8u0tktU9ue2Oa3+wl1hrKftZ+VXhTZih54ckF5Gg57vj10rTyhWEnSTGD7NBPUtDsnaQrRPLfL9JsTbwLEXCf/VXaMpsrYgxUmecMX752R436jH99DC3rba2h7G1R7AfHu1jzleXnwMyyfChXc0+qH3mksRoIL7mMEIhipmeuZFd/SXNGtJAkU68VJqiW93ehvE2/+sPRZxTvgQ3RRjePl92yncvzCQvVqvHQhV7BGNnbpOeL9i56DwIUpfJwMzwYtqPEb3ik/2+ATPsfA30+sTUebga2ZrjMtW1V8/PDXfSUhIRj/OidLa2w1V22soQGuK2Mj+2GvYu0k40GZntUX3Kx7DzQBNf7OyYVcXZIt/rMhckWLxSpTuM30++B07vvUlf5dcBifXUO9iq2g5ruc7yXTx2fGuvFulCFnnRedoP+M/Cji3Wx1HWNDFSitMIP1oJKU3iQk+S2FuimOlMZ18LbNOrFmLmQhLH3zaQTy8Tvaeo6Czgv8x0vpk03xoZd/Pv4zTtYG8RuXv1p2iF7Voy1X+0NdIFsw9bXHKduHOLlP8Ng3QwHgZ5fSk3FQsFbyikMowLaUcZ9t/YpTtkJSr+2pyycfhLJyrKwmRUys+Gy4k7TQUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVPkXHlRS0jlhSEYAAAAASUVORK5CYII='
                />
                <span
                  style={{
                    fontSize: '18px',
                    position: 'relative',
                    top: '15px'
                  }}
                >
                  Chọn phương thức thanh toán
                </span>
              </div>
              <div>
                <i
                  style={{
                    fontSize: `24px`,
                    position: `relative`,
                    left: ` 42px`,
                    bottom: `-15px`,
                    color: '#128de2'
                  }}
                  class='fa fa-arrow-right'
                ></i>
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

              <div style={{ style: '#707070', wordWrap: 'wrap', width: '300px', textAlign: 'right' }}>
                {account?.diaChi}, {account?.xaPhuong}, {account?.quanHuyen}, {account?.tinhThanhPho}
              </div>
            </div>
          </div>
          <br />
          <div className='countProductTemp' style={{ left: 355, width: '47%' , display: 'block'}}>
            <div style={{ fontWeight: 'bold' }}>
              Tổng tiền 
              <span style={{ fontWeight: 'bold', color: '#128DE2', marginLeft: 450 }}>
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
                onClick={() => {
                  alert("Tạo đơn hàng thành công")
                }}
              >
                Hoàn thành
              </Button>
            </div>
      </div>
        </>
      )}
      
   
    </>
  )
}

export default CartPage
