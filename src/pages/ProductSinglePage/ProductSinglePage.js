import React, { useEffect, useState } from 'react'
import './ProductSinglePage.scss'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider } from 'antd'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Carousel from './carousel'
import { addToCart } from '../../store/cartSlice'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { ResetSelectedCart } from '../../store/cartSlice'

var stompClient = null
const ProductSinglePage = () => {
  const { id } = useParams()
  
  // products
  const [ramRomConfigs, setRamRomConfigs] = useState([])
  const [productDetails, setProductDetails] = useState([])
  const [images, setImages] = useState([])
  const [productCart, setProductCart] = useState([])

  //redux
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const selectedCart = useSelector(state => state.cart.selectedCart)
  const cartProducts = useSelector(state => state.cart.carts)
  const navigate = useNavigate()

  //ram, rom, color
  const [config, setConfig] = useState({
    id: '',
    ram: '',
    rom: '',
    color: '',
    price: 0,
    priceDiscount: 0,
    discount: 0,
  })

  // product
  const [product, setProduct] = useState({
    nameProduct: '',
    typeDisplay: '',
    sizeDisplay: '',
    nameBrand: '',
    nameChip: '',
    nameProductLine: '',
    batteryCapacity: '',
    memoryCardType: ''
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

  const getCartProduct = async () => {
    await axios
      .get(
        `http://localhost:8080/client/cart-detail/get-cart-details?id_customer=${user.id}`
      )
      .then(res => {
        setProductCart(res.data)
      })
      .catch(res => console.log(res))
  }

  function createData (name, value) {
    return { name, value }
  }

  const rows = [
    createData('Màn hình :', `6.7 inch, AMOLED, 1200 x 2640 Pixels`),
    createData('Hệ điều hành :', 'IOS 13'),
    createData('Camera sau :', 'Chính 48 MP & Phụ 8 MP, 5 MP'),
    createData('Camera trước :', 'Chính 48 MP & Phụ 8 MP, 5 MP'),
    createData('Chip', `A13 Bionic`),
    createData('Ram', `${config.ram} GB`),
    createData('ROM', `${config.rom} GB`),
    createData('SIM', '1 Nano SIM & 1 eSIM'),
    createData('Pin, sạc:', `3400 mah, 20 W`)
  ]

  // getting single product
  useEffect(() => {
    getConfig()
    dispatch(ResetSelectedCart())
    window.scrollTo(0, 0);
    getCartProduct()
  }, [])

  const checkRomRamDistinct = (listRamRomDistinct, ram, rom) => {
    if (listRamRomDistinct.length === 0) {
      return true
    } else {
      var flag = 0
      listRamRomDistinct.forEach(item => {
        if (item.dungLuongRam === ram && item.dungLuongRom === rom) {
          flag++
        }
      })

      if (flag === 0) {
        return true
      } else {
        return false
      }
    }
  }

  const getConfig = async () => {
    await axios
      .get(`http://localhost:8080/client/product-detail/get-config/${id}`)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data)
          setProductDetails(res.data)
          let listRamRomDistinct = []
          res.data.map(e => {
            if (
              checkRomRamDistinct(
                listRamRomDistinct,
                e.dungLuongRam,
                e.dungLuongRom
              )
            ) {
              listRamRomDistinct.push({
                id: e.id,
                dungLuongRam: e.dungLuongRam,
                dungLuongRom: e.dungLuongRom,
                tenMauSac: e.tenMauSac,
                donGia: e.donGia,
                donGiaSauKhuyenMai: e.donGiaSauKhuyenMai
              })
            }
          })
          setRamRomConfigs(listRamRomDistinct)
          addConfigs(listRamRomDistinct[0])
        }
      })
      .catch(error => console.log(error))

    await axios
      .get(`http://localhost:8080/client/product-detail/get-product/${id}`)
      .then(item => {
        if (item.status === 200) {
          var res = item.data
          console.log(res)
          setProduct({
            nameProduct: res.tenSanPham,
            typeDisplay: res.loaiManHinh,
            sizeDisplay: res.kichThuocManHinh,
            nameBrand: res.tenHang,
            nameChip: res.tenChip,
            batteryCapacity: res.dungLuongPin,
            memoryCardType: res.loaiTheNho
          })
        }
      })
      .catch(error => console.log(error))

      await axios
      .get(`http://localhost:8080/client/product-detail/get-images/${id}`)
      .then(item => {
        if (item.status === 200) {
          var res = item.data
          setImages(res)
        }
      })
      .catch(error => console.log(error))
  }

  const addToCartHandler = async product => {
    var soLuong = 0
    var product = productCart.find(e=> e.idSanPhamChiTiet === config.id);
    var productDetail = productDetails.find(e=> e.id === config.id);
    if(product === undefined || product === null){ 
      soLuong = 0
    }else{
      soLuong = product.soLuongSapMua
    }

    if(productDetail === undefined || productDetail === null){ 
      return;
    }

    if(soLuong > productDetail.soLuongTonKho){
      toast.error("Sản phẩm trong kho không đủ.Vui lòng chọn sản phẩm khác.")
    }else
    if(soLuong >= 4){
      toast.error("Sản phẩm trong giỏ hàng đã đạt tới số lượng giới hạn.Vui lòng chọn sản phẩm khác.")
    }else{
      if(selectedCart === 0){
        await axios
          .post(
            `http://localhost:8080/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${config.id}&type=plus`
          )
          .then(res => {
            if (res.status === 200) {
              dispatch(addToCart())
              toast.success("Bạn đã thêm sản phẩm giỏ hàng thành công")
              getCartProduct()
            }
          })
          .catch(res => console.log(res))
        }
    }
  }

  const buyNowHandler = async product => {
    var soLuong = 0
    var product = productCart.find(e=> e.idSanPhamChiTiet === config.id);
    var productDetail = productDetails.find(e=> e.id === config.id);
    if(product === undefined || product === null){ 
      soLuong = 0
    }else{
      soLuong = product.soLuongSapMua
    }

    if(productDetail === undefined || productDetail === null){ 
      return;
    }

    if(soLuong > productDetail.soLuongTonKho  ){
      toast.error("Sản phẩm trong kho không đủ.Vui lòng chọn sản phẩm khác.")
    }else
    if(soLuong >= 4){
      toast.error("Sản phẩm trong giỏ hàng đã đạt tới số lượng giới hạn.Vui lòng chọn sản phẩm khác.")
    }else{
      if(selectedCart === 0){
        await axios
          .post(
            `http://localhost:8080/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${config.id}&type=plus`
          )
          .then(res => {
            if (res.status === 200) {
              dispatch(addToCart())
              getCartProduct()
              navigate('/cart')
            }
          })
          .catch(res => console.log(res))
        }
    }
  }


  const addConfigs = value => {
    setConfig({
      id: value.id,
      ram: value.dungLuongRam,
      rom: value.dungLuongRom,
      color: value.tenMauSac,
      price: value.donGia,
      priceDiscount: value.donGiaSauKhuyenMai,
      discount: (
        ((value.donGia - value.donGiaSauKhuyenMai) / value.donGia) *
        100
      ).toFixed(0)
    })
  }

  const formatMoney = number => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(number)
  }

  const borderButtonChoise = {
    marginRight: 10,
    width: 150,
    height: 46,
    color: 'black',
    border: '1px solid #128DE2',
    marginBottom: 10
  }

  const borderButtonNoChoise = {
    marginRight: 10,
    width: 150,
    height: 46,
    color: 'black',
    border: '1px solid #d1d5db',
    marginBottom: 10
  }

  return (
    <main className='py-5 bg-white'>
      <div className='product-single' style={{ height: '1129px' }}>
        <div className='container'>
          <div className='title fs-20 fw-7' style={{ marginTop: 65 }}>
            {' '}
            Điện thoại {product.nameProduct}
          </div>
          <Divider style={{ margin: '4px 0' }} />
          <div className='product-single-content bg-white grid'>
            <div className='product-single-l'>
              <Carousel images={images} colorSelected={config.color} />
            </div>

            <div className='product-single-r'>
              <div className='product-details font-manrope'>
                <div>
                  {ramRomConfigs.map(e => {
                    return (
                      <>
                        <Button
                          onClick={() => addConfigs(e)}
                          type='primary'
                          style={
                            config.ram === e.dungLuongRam &&
                            config.rom === e.dungLuongRom.toString()
                              ? borderButtonChoise
                              : borderButtonNoChoise
                          }
                          ghost
                        >
                          {config.ram === e.dungLuongRam &&
                          config.rom === e.dungLuongRom ? (
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
                            {e.dungLuongRam} GB - {e.dungLuongRom} GB{' '}
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
                            {formatMoney(e.donGia)}
                          </span>
                        </Button>
                      </>
                    )
                  })}
                </div>

                <div className='fw-6' style={{ marginTop: 10, fontSize: 13 }}>
                  Chọn màu để xem giá :
                </div>

                <div
                  className='info flex align-center flex-wrap fs-14'
                  style={{ marginTop: 10 }}
                >
                  {productDetails.map(item => {
                    if (
                      config.ram === item.dungLuongRam &&
                      config.rom === item.dungLuongRom
                    ) {
                      return (
                        <>
                          <Button
                            type='primary'
                            onClick={() => addConfigs(item)}
                            style={
                              config.color === item.tenMauSac
                                ? borderButtonChoise
                                : borderButtonNoChoise
                            }
                            ghost
                          >
                            {config.color === item.tenMauSac ? (
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
                                <img
                                  style={{ width: 38, height: 38 }}
                                  src={images.find(e => e.tenMauSac === item.tenMauSac) === undefined ? "" : images.find(e => e.tenMauSac === item.tenMauSac).url}
                                />
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
                                  {item.tenMauSac}
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
                                  {formatMoney(item.donGia)}
                                </span>
                              </div>
                            </div>
                          </Button>
                        </>
                      )
                    }
                  })}
                </div>

                <div>
                  <span
                    className='fs-14 mx-2 text-dark fw-6'
                    style={{ marginLeft: '0px' }}
                  >
                    Giá bán
                  </span>
                </div>

                <div className='price' style={{ padding: 0 }}>
                  <div
                    className='flex align-center my-1'
                    style={{ backgroundColor: 'white' }}
                  >
                    <div
                      className='new-price fw-5 font-poppins fs-24'
                      style={{ display: `flex`, color: `#128DE2` }}
                    >
                      {formatMoney(
                        config.priceDiscount === 0
                          ? config.price
                          : config.priceDiscount
                      )}
                      <div
                        className='old-price text-gray'
                        style={{ marginLeft: 5, fontSize: 17, marginTop: 8 }}
                      >
                        {config.priceDiscount === 0
                          ? ''
                          : formatMoney(config.price)}
                      </div>
                    </div>
                    {config.priceDiscount === 0 ? (
                      ''
                    ) : (
                      <div
                        className='discount bg-orange fs-13 text-white fw-6 font-poppins'
                        style={{
                          backgroundColor: '#128DE2',
                          border: '  1px solid #128DE2'
                        }}
                      >
                        -{config.discount} %
                      </div>
                    )}
                  </div>
                </div>

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
                    onClick={() => {
                      buyNowHandler()
                    }}
                  >
                    <i className='fas fa-shopping-cart'></i>
                    <span className='btn-text mx-2'>Mua ngay</span>
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
                    onClick={() => {
                      addToCartHandler()
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
            <div className='product-single-r' style={{ marginLeft: 45 }}>
              <div
                className='title fs-20 fw-7'
                style={{ marginBottom: 20, textAlign: `center` }}
              >
                Cấu hình điện thoại
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

      {/* toaster */}
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
    </main>
  )
}

export default ProductSinglePage
