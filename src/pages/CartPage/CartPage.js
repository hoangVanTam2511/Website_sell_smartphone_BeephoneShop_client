import React, { useState, useEffect } from 'react'
import './CartPage.scss'
import { shopping_cart } from '../../utils/images'
import { Link } from 'react-router-dom'
import { Divider } from 'antd'
import axios from 'axios'
import { addToCart, SetSelectedCart } from '../../store/cartSlice'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { checkUserAnonymous } from '../../store/userSlice'
import { ResetItemNavbar } from '../../store/navbarSlice'

const CartPage = () => {
  // const { itemsCount, totalAmount } = useSelector(state => state.cart)
  const [productDetails, setProductDetails] = useState([])
  const [totalAmount, setTotalAmount] = useState()
  const [changeCount, setChangeCount] = useState(new Map())
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  
  const getProductDetails = async () => {
    if (productDetails.length !== 0) return
    await axios
      .get(
        `http://localhost:8080/client/cart-detail/get-cart-details?id_customer=${user.id}`
      )
      .then(res => {
        console.log(res.data)
        setProductDetails(res.data)
        var totalCart = 0
        if (res.data.length === 0) return
        res.data.map(e => {
          totalCart += Number(e.donGiaSauKhuyenMai === 0 ? e?.donGia : e?.donGiaSauKhuyenMai ) * Number(e.soLuongSapMua)
        })

        setTotalAmount(totalCart)
        setChangeCount(
          new Map(res.data.map(item => [item.idSanPhamChiTiet, item.soLuongSapMua]))
        )
      })
      .catch(res => console.log(res))
  } 

  const countTotalAmountAgain = () => {
    var totalCart = 0
    productDetails.map(e => {
      totalCart += Number(e?.donGiaSauKhuyenMai === 0 ? e?.donGia : e?.donGiaSauKhuyenMai) * Number(changeCount.get(e.idSanPhamChiTiet))
    })
    setTotalAmount(totalCart)
  }

  useEffect(() => {
    if(user.id === null || user.id === ""){
      dispatch(checkUserAnonymous())
    }
    if(user.id !== null || user.id !== ""){
      getProductDetails()
    }
    countTotalAmountAgain()
    dispatch(addToCart());
    dispatch(SetSelectedCart(1));
    dispatch(ResetItemNavbar())
    window.scrollTo(0, 0);
  }, [totalAmount])


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

  const handlePlusCart = async id => {
    await axios
      .post(
        `http://localhost:8080/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${id}&type=plus`
      )
      .then(res => {
        if (res.status === 200) {
          var temp = Number(changeCount.get(id)) + 1
          setChangeCount(map => new Map(map.set(id, temp)))
          countTotalAmountAgain()
        }
      })
      .catch(res =>
        alert(
          'Vượt quá số lượng cho phép. Bạn giàu vl thì bạn có liên hệ với chúng ta để mua sll'
        )
      )
  }

  const handleMinusCart = async id => {
    await axios
      .post(
        `http://localhost:8080/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${id}&type=minus`
      )
      .then(res => {
        if (res.status === 200) {
          var temp = Number(changeCount.get(id)) - 1
          setChangeCount(map => new Map(map.set(id, temp)))
          countTotalAmountAgain()
        }
      })
      .catch(res => alert('Uhm, Xuống 0 mà vẫn còn muốn bấm hả'))
  }

  const deleteCartDetail = async(product) => {
      if(productDetails.length === 1){
        dispatch(addToCart(0));
      }

      if( product.idGioHangChiTiet !== null){
        await axios
        .delete(
          `http://localhost:8080/client/cart-detail/delete-cart-details?id_customer=${user.id}&id_cart_detail=${product.idGioHangChiTiet}`
        )
        .then(res => {
          setProductDetails(res.data)
          var totalCart = 0
          if (res.data.length === 0) return
          res.data.map(e => {
            totalCart += Number(e.donGiaSauKhuyenMai === 0 ? e?.donGia : e?.donGiaSauKhuyenMai ) * Number(e.soLuongSapMua)
          })
          setTotalAmount(totalCart)
          dispatch(addToCart());
        })
        .catch(res => console.log(res))
      }
  }

  return (
    <>
      <h3 className='text-center fw-5' style={{ marginTop: 20, transform: 'translateY(17px)' }}>
       
       <span>
       </span>
       
       <span style={{ fontWeight: 600 }}>
          Giỏ hàng của bạn
        </span>
      </h3>
      <Divider style={{ margin:' 20px auto', width: '48%', minWidth: '47%' }}/>
      <div
        className='cart bg-white'
        style={{ margin: `20px auto`, width: `50%`, borderRadius: '20px' }}
      >
        <div className='container'>
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
                          style={{ width: 112, height: 115 }}
                          src={product?.duongDan}
                        />

                        <button
                          type='button'
                          className='delete-btn text-dark'
                          onClick={() => deleteCartDetail(product)}
                          style={{
                            color: '#999',
                            position: 'relative',
                            right: '-42px',
                            marginTop: '7px'
                          }}
                        >
                          <i class='fa-regular fa-circle-xmark'></i> Xóa
                        </button>
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
                          <div style={{ width: '127%' }}>
                            <span className='cart-ctxtf fw-7'>
                              {product?.tenSanPham +
                                ' ' +
                                product?.dungLuongRam +
                                'GB ' +
                                product?.dungLuongRom +
                                'GB'}
                            </span>
                            <br />
                            <span>Màu : {product.tenMauSac}</span>
                          </div>
                          <div style={{ width: '58%' }}>
                            <span
                              className='cart-ctxt'
                              style={{ color: 'rgb(18, 141, 226)', fontSize: '16px' }}
                            >
                              {formatMoney(product?.donGiaSauKhuyenMai === 0 ? product?.donGia : product?.donGiaSauKhuyenMai)}
                            </span>
                            <br />
                            <del style={{ color: '#999', fontSize: '16px' }}>
                              {product?.donGiaSauKhuyenMai === 0 ? "" : formatMoney(product?.donGia)}
                            </del>
                          </div>
                        </div>
                      </div>
                      <div className='cart-ctd'></div>
                      <div className='cart-ctd'>
                        <div
                          className='qty-change flex align-center'
                          style={{
                            position: `relative`,
                            top: `39px`,
                            right: `171px`
                          }}
                        >
                          <button
                            type='button'
                            className='qty-decrease flex align-center justify-center'
                            onClick={() => handleMinusCart(product.idSanPhamChiTiet)}
                          >
                            <i className='fas fa-minus'></i>
                          </button>

                          <div className='qty-value flex align-center justify-center'>
                            {changeCount.get(product.idSanPhamChiTiet)}
                          </div>

                          <button
                            type='button'
                            className='qty-increase flex align-center justify-center'
                            onClick={() => handlePlusCart(product.idSanPhamChiTiet)}
                          >
                            <i className='fas fa-plus'></i>
                          </button>
                        </div>
                      </div>

                      <div className='cart-ctd'>
                      </div>

                      <div className='cart-ctd'></div>
                    </div>
                  </>
                )
              })}
            </div>

            <div className='countProductTemp'>
              <div>
                Tạm tính :
                <br/>
                <span style={{ fontWeight:'bold', color: '#128DE2'}}>
                 {formatMoney(totalAmount)}
                </span>
              </div>
              <div>
                <Link to='/check-out'>
                <Button
                variant="contained"
                style={{
                  width: "100%",
                  marginTop: 5,
                  fontSize: 16,
                }}
                >
                 Mua ngay({productDetails.length})
              </Button>
              </Link>
              </div>
            </div>

            {/* <Divider />

            <Checkout />

            <div
              style={{
                display: 'flex',
                justifyContent: `space-between`,
                width: '90%',
                margin: '0px auto',
                marginTop: '-30px'
              }}
            >
              <div className='fw-6'>Tổng tiền :</div>
              <div style={{ color: 'red' }}>
                {totalAmount}{' '}
                <sup>
                  <ins>đ</ins>
                </sup>
              </div>
            </div>

            <div>
              <Button
                onClick={() => alert('Đặt Hàng Thành  công')}
                variant='contained'
                style={{
                  width: '90%',
                  marginTop: 22,
                  marginLeft: '35px',
                  fontSize: 16
                }}
              >
                Đặt hàng
              </Button>
            </div> */}

            <br />
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
