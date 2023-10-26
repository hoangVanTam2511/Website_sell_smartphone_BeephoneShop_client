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

  //ram, rom, color
  const [config, setConfig] = useState({
    ram: '',
    rom: '',
    color: ''
  })

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
  useEffect(
    () => {
      dispatch(fetchAsyncProductSingle(id))

      if (cartMessageStatus) {
        setTimeout(() => {
          dispatch(setCartMessageOff())
        }, 2000)
      }
    },
    [cartMessageStatus],
    [config]
  )

  let discountedPrice =
    product?.price - product?.price * (product?.discountPercentage / 100)
  if (productSingleStatus === STATUS.LOADING) {
    return <Loader />
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

  const addConfigs = value => {
    if (value.indexOf('ram') !== -1) {
      var textRam = value.split('-')[0]
      var textRom = value.split('-')[1]

      setConfig({
        ...config,
        ram: textRam.slice(textRam.indexOf(':') + 1, textRam.length),
        rom: textRom.slice(textRom.indexOf(':') + 1, textRom.length)
      })
    }

    if (value.indexOf('color') !== -1) {
      var text = value.split('-')[0]
      setConfig({
        ...config,
        color: text.slice(text.indexOf(':') + 1, text.length)
      })
    }

    console.log(config)
  }

  const borderButtonChoise = {
    marginRight: 10,
    width: 150,
    height: 46,
    color: 'black',
    border: '1px solid #128DE2'
  }

  const borderButtonNoChoise = {
    marginRight: 10,
    width: 150,
    height: 46,
    color: 'black',
    border: '1px solid #d1d5db'
  }

  return (
    <main className='py-5 bg-white'>
      <div className='product-single' style={{ height: '1129px' }}>
        <div className='container'>
          <div className='title fs-20 fw-7' style={{ marginTop: 20 }}>
            {' '}
            Điện thoại {product?.title}
          </div>
          <Divider style={{ margin: '4px 0' }} />
          <div className='product-single-content bg-white grid'>
            <div className='product-single-l'>
              <Carousel />
            </div>

            <div className='product-single-r'>
              <div className='product-details font-manrope'>
                <div>
                  <Button
                    onClick={() => addConfigs('ram:4-rom:60')}
                    type='primary'
                    style={
                      config.ram === '4' && config.rom === '60'
                        ? borderButtonChoise
                        : borderButtonNoChoise
                    }
                    ghost
                  >
                    {config.ram === '4' && config.rom === '60' ? (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: '#128DE2',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    ) : (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: 'white',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    )}

                    <span
                      className=' fw-6'
                      style={{ display: 'block', fontSize: 10 }}
                    >
                      {' '}
                      4 GB - 60 GB{' '}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: '#444',
                        marginLeft: 5,
                        position: 'relative',
                        top: '-5px'
                      }}
                    >
                      {' '}
                      50.000.000 đ{' '}
                    </span>
                  </Button>

                  <Button
                    onClick={() => addConfigs('ram:9-rom:80')}
                    type='primary'
                    style={
                      config.ram === '9' && config.rom === '80'
                        ? borderButtonChoise
                        : borderButtonNoChoise
                    }
                    ghost
                  >
                    {config.ram === '9' && config.rom === '80' ? (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: '#128DE2',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    ) : (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: 'white',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    )}

                    <span
                      className=' fw-6'
                      style={{ display: 'block', fontSize: 10 }}
                    >
                      {' '}
                      9 GB - 80 GB{' '}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: '#444',
                        marginLeft: 5,
                        position: 'relative',
                        top: '-5px'
                      }}
                    >
                      {' '}
                      150.000.000 đ{' '}
                    </span>
                  </Button>
                </div>

                <div className='fw-6' style={{ marginTop: 10, fontSize: 13 }}>
                  Chọn màu để xem giá :
                </div>

                <div
                  className='info flex align-center flex-wrap fs-14'
                  style={{ marginTop: 10 }}
                >
                  <Button
                    type='primary'
                    onClick={() => addConfigs('color:Đen')}
                    style={
                      config.color === 'Đen'
                        ? borderButtonChoise
                        : borderButtonNoChoise
                    }
                    ghost
                  >
                    {config.color === 'Đen' ? (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: '#128DE2',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    ) : (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: 'white',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    )}

                    <div style={{ display: 'flex' }}>
                      <div>
                        <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:80/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxy-z-fold-5-xam-1_1__1_2.jpg' />
                      </div>

                      <div>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#444',
                            display: 'block',
                            textAlign: 'left',
                            marginLeft: '5px'
                          }}
                          className='fw-6'
                        >
                          Đen
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#444',
                            position: 'relative',
                            top: '-3px',
                            left: '5px'
                          }}
                        >
                          {' '}
                          50.000.000 đ{' '}
                        </span>
                      </div>
                    </div>
                  </Button>

                  <Button
                    type='primary'
                    onClick={() => addConfigs('color:Kem')}
                    style={
                      config.color === 'Kem'
                        ? borderButtonChoise
                        : borderButtonNoChoise
                    }
                    ghost
                  >
                    {config.color === 'Kem' ? (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: '#128DE2',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    ) : (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: 'white',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    )}
                    <div style={{ display: 'flex' }}>
                      <div>
                        <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:80/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxy-z-fold-5-kem-1_3_2.jpg' />
                      </div>

                      <div>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#444',
                            display: 'block',
                            textAlign: 'left',
                            marginLeft: '5px'
                          }}
                          className='fw-6'
                        >
                          Kem
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#444',
                            position: 'relative',
                            top: '-3px',
                            left: '5px'
                          }}
                        >
                          {' '}
                          50.000.000 đ{' '}
                        </span>
                      </div>
                    </div>
                  </Button>

                  <Button
                    type='primary'
                    onClick={() => addConfigs('color:Xanh dương')}
                    style={
                      config.color === 'Xanh dương'
                        ? borderButtonChoise
                        : borderButtonNoChoise
                    }
                    ghost
                  >
                    {config.color === 'Xanh dương' ? (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: '#128DE2',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    ) : (
                      <i
                        class='fa fa-check'
                        style={{
                          position: 'absolute',
                          width: 14,
                          height: 14,
                          background: 'white',
                          top: 0,
                          left: 0,
                          borderTopLeftRadius: '3px',
                          borderBottomRightRadius: '7px',
                          fontSize: 11,
                          color: 'white'
                        }}
                      ></i>
                    )}

                    <div style={{ display: 'flex' }}>
                      <div>
                        <img src='https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:80/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxy-z-fold-5-xanh-1_1_1_1.jpg' />
                      </div>

                      <div>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#444',
                            display: 'block',
                            textAlign: 'left',
                            marginLeft: '5px'
                          }}
                          className='fw-6'
                        >
                          Xanh dương
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#444',
                            position: 'relative',
                            top: '-3px',
                            left: '5px'
                          }}
                        >
                          {' '}
                          50.000.000 đ{' '}
                        </span>
                      </div>
                    </div>
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
                        style={{ marginLeft: 5, fontSize: 17, marginTop: 8 }}
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

              <div className='title fs-20 fw-7' style={{}}>
                Mới đây thì chiếc điện thoại iPhone 14 Pro Max 256GB cũng đã
                được chính thức lộ diện trên toàn cầu và đập tan bao lời đồn
                đoán bấy lâu nay, bên trong máy sẽ được trang bị con chip hiệu
                năng khủng cùng sự nâng cấp về camera đến từ nhà Apple.
              </div>

              <img
                src='https://cdn.tgdd.vn/Products/Images/42/289700/iphone-14-pro-max-256gb-080922-102929.jpg'
                style={{ marginTop: 10 }}
              />

              <Button
                type='primary'
                ghost
                style={{
                  marginTop: 20,
                  height: 40,
                  width: `90%`,
                  marginLeft: `6%`
                }}
              >
                Xem thêm thông tin
              </Button>
            </div>
            <div className='product-single-r'>
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

              <Button
                type='primary'
                ghost
                style={{
                  marginTop: 20,
                  height: 40,
                  width: `90%`,
                  marginLeft: `6%`
                }}
              >
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
