import React, { useEffect, useState } from 'react'
import './ProductSinglePage.scss'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchAsyncProductSingle,
  getProductSingle,
  getSingleProductStatus
} from '../../store/productSlice'
import { STATUS } from '../../utils/status'
import Loader from '../../components/Loader/Loader'
import {
  addToCart,
  getCartMessageStatus,
  setCartMessageOff,
  setCartMessageOn
} from '../../store/cartSlice'
import CartMessage from '../../components/CartMessage/CartMessage'
import { Button, Dropdown, Space, Divider } from 'antd'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Carousel from './carousel'

const ProductSinglePage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const product = useSelector(getProductSingle)
  const productSingleStatus = useSelector(getSingleProductStatus)
  const [quantity, setQuantity] = useState(1)
  const cartMessageStatus = useSelector(getCartMessageStatus)

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  }))

  function createData (name, value) {
    return { name, value }
  }

  const rows = [
    createData('Màn hình :', 'OLED, 6.7, 1200 x 2640 Pixels'),
    createData('Hệ điều hành :', 'IOS 13'),
    createData('Camera sau :', 'Chính 48 MP & Phụ 8 MP, 5 MP'),
    createData('Camera trước :', 'Chính 48 MP & Phụ 8 MP, 5 MP'),
    createData('Chip', 'Apple A14 Bionic'),
    createData('Ram', '6 GB'),
    createData('ROM', '128 GB'),
    createData('SIM', '1 Nano SIM & 1 eSIM'),
    createData('Pin, sạc:', '4323 mAh, 20 W')
  ]

  // getting single product
  useEffect(() => {
    dispatch(fetchAsyncProductSingle(id))

    if (cartMessageStatus) {
      setTimeout(() => {
        dispatch(setCartMessageOff())
      }, 2000)
    }
  }, [cartMessageStatus])

  let discountedPrice =
    product?.price - product?.price * (product?.discountPercentage / 100)
  if (productSingleStatus === STATUS.LOADING) {
    return <Loader />
  }

  const increaseQty = () => {
    setQuantity(prevQty => {
      let tempQty = prevQty + 1
      if (tempQty > product?.stock) tempQty = product?.stock
      return tempQty
    })
  }

  const decreaseQty = () => {
    setQuantity(prevQty => {
      let tempQty = prevQty - 1
      if (tempQty < 1) tempQty = 1
      return tempQty
    })
  }

  const addToCartHandler = product => {
    let discountedPrice =
      product?.price - product?.price * (product?.discountPercentage / 100)
    let totalPrice = quantity * discountedPrice

    dispatch(
      addToCart({ ...product, quantity: quantity, totalPrice, discountedPrice })
    )
    dispatch(setCartMessageOn(true))
  }

  return (
    <main className='py-5 bg-white'>
      <div className='product-single'>
        <div className='container'>
          <div className='title fs-20 fw-7' style={{ marginTop: 20 }}>
            {' '}
            Điện thoại {product?.title}
          </div>
          <Divider style={{ margin: '4px 0' }} />
          <div className='product-single-content bg-white grid'>
            <div className='product-single-l' >
              {/* <div className='product-img'>
                <div className='product-img-zoom'>
                  <img
                    src={
                      product ? (product.images ? product.images[0] : '') : ''
                    }
                    alt=''
                    className='img-cover'
                  />
                </div>

                <div className='product-img-thumbs flex align-center my-2'>
                  <div className='thumb-item'>
                    <img
                      src={
                        product ? (product.images ? product.images[1] : '') : ''
                      }
                      alt=''
                      className='img-cover'
                    />
                  </div>
                  <div className='thumb-item'>
                    <img
                      src={
                        product ? (product.images ? product.images[2] : '') : ''
                      }
                      alt=''
                      className='img-cover'
                    />
                  </div>
                  <div className='thumb-item'>
                    <img
                      src={
                        product ? (product.images ? product.images[3] : '') : ''
                      }
                      alt=''
                      className='img-cover'
                    />
                  </div>
                  <div className='thumb-item'>
                    <img
                      src={
                        product ? (product.images ? product.images[4] : '') : ''
                      }
                      alt=''
                      className='img-cover'
                    />
                  </div>
                </div>
              </div> */}
              {/* slide */}
              <Carousel/>
            </div>
            <div className='product-single-r'>
              <div className='product-details font-manrope'>
                <div>
                  <Button
                    type='primary'
                    style={{ marginRight: 10, width: 105, height: 40 }}
                    ghost
                  >
                    60 GB
                  </Button>
                  <Button
                    type='primary'
                    style={{ marginRight: 10, width: 105, height: 40 }}
                    ghost
                  >
                    80 GB
                  </Button>
                </div>
                <div
                  className='info flex align-center flex-wrap fs-14'
                  style={{ marginTop: 10 }}
                >
                  <Button
                    type='primary'
                    style={{ marginRight: 10, width: 105, height: 40 }}
                    ghost
                  >
                    Đen
                  </Button>
                  <Button
                    type='primary'
                    style={{ marginRight: 10, width: 105, height: 40 }}
                    ghost
                  >
                    Xanh
                  </Button>
                </div>

                <div>
                  <span className='fs-14 mx-2 text-dark'>Giá bán</span>
                </div>

                <div className='price' style={{ padding: 4 }}>
                  <div className='flex align-center my-1'>
                    <div
                      className='new-price fw-5 font-poppins fs-24'
                      style={{ display: `flex`, color: `#128DE2` }}
                    >
                      4.0000.000 đ
                      <div
                        className='old-price text-gray'
                        style={{ marginLeft: 5 }}
                      >
                        3.600.000 đ
                      </div>
                    </div>
                    <div
                      className='discount bg-orange fs-13 text-white fw-6 font-poppins'
                      style={{
                        backgroundColor: '#128DE2',
                        border: '  1px solid #128DE2'
                      }}
                    >
                      {product?.discountPercentage}%
                    </div>
                  </div>
                </div>

                <img
                  src='https://cdn.tgdd.vn/2023/10/banner/920x230-920x230-4.png'
                  style={{ marginBottom: 10 }}
                />

                <div className='btns'>
                  <button
                    type='button'
                    className='add-to-cart-btn btn'
                    style={{
                      backgroundColor: '#fb6e2e',
                      border: '  1px solid #fb6e2e',
                      color: 'white',
                      borderRadius: 10,
                      width: `47%`
                    }}
                  >
                    <i className='fas fa-shopping-cart'></i>
                    <span
                      className='btn-text mx-2'
                      onClick={() => {
                        addToCartHandler(product)
                      }}
                    >
                      Mua ngay
                    </span>
                  </button>
                  <button
                    type='button'
                    className='buy-now btn mx-3'
                    style={{
                      backgroundColor: '#128DE2',
                      border: '  1px solid #128DE2',
                      borderRadius: 10,
                      width: `47%`
                    }}
                  >
                    <i className='fas fa-shopping-cart'></i>
                    <span className='btn-text mx-2'>Thêm vào giỏ hàng</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='product-single-content bg-white grid'>
            <div className='product-single-l'>
            <div
                className='title fs-20 fw-7'
                style={{ marginBottom: 20, textAlign: `center` }}
              >
               Thông tin điện thoại
              </div>

              <div
                className='title fs-20 fw-7'
                style={{}}
              >
              Mới đây thì chiếc điện thoại iPhone 14 Pro Max 256GB cũng đã được chính thức lộ diện trên toàn cầu và đập tan bao lời đồn đoán bấy lâu nay, bên trong máy sẽ được trang bị con chip hiệu năng khủng cùng sự nâng cấp về camera đến từ nhà Apple.
              </div>

              <img
                  src='https://cdn.tgdd.vn/Products/Images/42/289700/iphone-14-pro-max-256gb-080922-102929.jpg'
                  style={{ marginTop: 10 }}
                />

            <Button type='primary' ghost  style={{ marginTop:20, height:40, width: `90%`, marginLeft:`6%`}}>
                Xem thêm thông tin
              </Button>   


            </div>
            <div className='product-single-r' style={{transform:`translateY(-67%)`}}>
              <div
                className='title fs-20 fw-7'
                style={{ marginBottom: 20, textAlign: `center` }}
              >
                Cấu hình điện thoại {product?.title}
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ maxWidth: `100%` }} aria-label='customized table'>
                  <TableBody>
                    {rows.map(row => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell scope='row'>
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell scope='row'>
                          {row.value}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button type='primary' ghost  style={{ marginTop:20, height:40, width: `90%`, marginLeft:`6%`}}>
                Xem thêm cấu hình chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>

      {cartMessageStatus && <CartMessage />}
    </main>
  )
}

export default ProductSinglePage
