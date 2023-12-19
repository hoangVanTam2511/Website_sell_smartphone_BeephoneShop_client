import React, { useEffect, useReducer, useState } from 'react'
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
import { addProductToCart } from '../../store/cartDetailSlice'
import { ResetSelectedCart, setSelectedCartDetail } from '../../store/cartSlice'
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { getUser, setUserNoToken } from '../../store/userSlice'
import { changNewProductAddToCart } from '../../store/cartSlice'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
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
  const user = getUser()
  const selectedCart = useSelector(state => state.cart.selectedCart)
  var cartDetails = useSelector(state => state.cartDetail.products) 
  const navigate = useNavigate()

  //loading
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState(false)

  // camnera
  const [cameraRear, setCameraRear] = useState([])
  const [cameraFront, setCameraFront] = useState([])
  
  //ram, rom, color
  const [config, setConfig] = useState({
    id: '',
    ram: '',
    rom: '',
    color: '',
    price: 0,
    priceDiscount: 0,
    discount: 0,
    nameProduct: '',
    urlImage: '',
    quantityInventory: 0,
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
    if(user.id === '') {
      setProductCart(cartDetails)
    }else{
      request("GET",`/client/cart-detail/get-cart-details?id_customer=${user.id}`
      )
      .then(res => {
        setProductCart(res.data)
      })
      .catch(res => {
        setUserNoToken()
        console.log(res)})
    }
  }

  function createData (name, value) {
    return { name, value }
  }

  const findCameraRearNotMain = () => {
    if(cameraRear.length > 1) {
      var text = "& Phụ"
      cameraRear.forEach((e, index) => {
        if(e.isCameraMain === false) {
          text += e.doPhanGiai + " MP "
        }
        
      })

      return text
    }else{
      return ""
    }
  }
    
  const findCameraFrontNotMain = () => {
    if(cameraFront.length > 1) {
      var text = "& Phụ"
      cameraFront.forEach((e, index) => {
        if(e.isCameraMain === false) {
          text += e.doPhanGiai + " MP "
        }
        
      })

      return text
    }else{
      return ""
    }
  
  }

  const rows = [
    createData('Màn hình :', `${product.sizeDisplay} inch, ${product.typeDisplay}, ${product.widthDisplay} x ${product.lengthDisplay} Pixels`),
    createData('Hệ điều hành :', `${product.system === 0 ? "Android" : "IOS"}`),
    createData('Camera sau :', `Chính ${cameraRear.length === 0 ? "" : cameraRear.find(e => e.isCameraMain === true).doPhanGiai} MP ${findCameraRearNotMain()}`),
    createData('Camera trước :', `Chính ${cameraFront.length === 0 ? "" : cameraFront.find(e => e.isCameraMain === true).doPhanGiai} MP  ${findCameraFrontNotMain()}`),
    createData('Chip', `${product.nameChip}`),
    createData('Ram', `${config.ram} GB`),
    createData('ROM', `${config.rom} GB`),
    createData('SIM', '1 Nano SIM & 1 eSIM'),
    createData('Pin:', `${product.batteryCapacity} mah`),
    createData('Hãng:', `${product.nameBrand} `),
    createData('Thẻ Nhớ:', `${product.memoryCardType == null ? "Không có": product.memoryCardType} `)
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
    request("GET",`/client/product-detail/get-config/${id}`)
      .then(res => {
        if (res.status === 200) {
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
                donGiaSauKhuyenMai: e.donGiaSauKhuyenMai,
                duongDan: e.duongDan,
                tenSanPham: e.tenSanPham,
                soLuongTonKho: e.soLuongTonKho
              })
            }
          })
          setRamRomConfigs(listRamRomDistinct)
          addConfigs(listRamRomDistinct[0])
        }
      })
      .catch(error => {
        setUserNoToken()
        console.log(error)})

      request("GET",`/client/product-detail/get-product/${id}`)
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
            memoryCardType: res.loaiTheNho,
            refreshRate: res.tanSoQuet,
            lengthDisplay: res.chieuDai,
            widthDisplay: res.chieuRong,
            system: res.heDieuHanh
          })
        }
      })
      .catch(error => {
        setUserNoToken()
        console.log(error)})

      request("GET",`/client/product-detail/get-images/${id}`)
      .then(item => {
        if (item.status === 200) {
          var res = item.data
          setImages(res)
        }
      })
      .catch(error => {
        setUserNoToken()
        console.log(error)})

        request("GET",`/client/product-detail/camera-rear?id=${id}`)
        .then(item => {
          if (item.status === 200) {
            var res = item.data
            setCameraRear(res)
          }
        })
        .catch(error => {
          setUserNoToken()
          console.log(error)})

          request("GET",`/client/product-detail/camera-front?id=${id}`)
          .then(item => {
            if (item.status === 200) {
              console.log(item.data)
              var res = item.data
              setCameraFront(res)
            }
          })
          .catch(error => {
            setUserNoToken()
            console.log(error)})
  }

  const addToCartHandler = async product => {
    var soLuong = 0
    var product = null;
    var quantityInventory = 0

    await request("GET", `/client/product-detail/get-quantity-inventory?id=${config.id}`)
    .then(res => {
        quantityInventory = res.data
    }).catch(
      error => {
        console.log(error)
      }
    )

    if(user.id === ''){
      product = cartDetails.find(e=> e.data.id === config.id);
     
    }else{
      product = productCart.find(e=> e.idSanPhamChiTiet === config.id);
    }

    var productDetail = productDetails.find(e=> e.id === config.id);
    if(product === undefined || product === null){ 
      soLuong = 0
    }else{
      if(user.id !== ''){
        soLuong = product.soLuongSapMua
      }else{
        soLuong = product.quantity
      }
    }

    if(productDetail === undefined || productDetail === null){ 
      return;
    }

    if((soLuong+1) > quantityInventory ){
      toast.error("Sản phẩm trong kho không đủ.Vui lòng chọn sản phẩm khác.")
    }else
    if(soLuong >= 4){
      toast.error("Sản phẩm trong giỏ hàng đã đạt tới số lượng giới hạn.Vui lòng chọn sản phẩm khác.")
    }else{
      setIsLoadingAddToCart(true)
      if(selectedCart === 0){
        if(user.id === ''){
          dispatch(addProductToCart(config))
          getCartProduct()
          setSelectedCartDetail({data: config})
          setTimeout(() => {
            setIsLoadingAddToCart(false)
            toast.success("Thêm sản phẩm vào giỏ hàng thành công")
          }, 500)
        }else{
          request("POST",`/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${config.id}&type=plus`
          )
          .then(res => {
            if (res.status === 200) {
              dispatch(addToCart())
              getCartProduct()
              console.log(res.data)
              setSelectedCartDetail(res.data)
              setTimeout(() => {
                setIsLoadingAddToCart(false)
                toast.success("Thêm sản phẩm vào giỏ hàng thành công")
              }, 500)
            }
          })
          .catch(res => {
            setUserNoToken()
            console.log(res)})
        }
      }
    }

  }

  const buyNowHandler = async product => {
    var soLuong = 0
    var product = null;
    var quantityInventory = 0

    await request("GET", `/client/product-detail/get-quantity-inventory?id=${config.id}`)
    .then(res => {
        quantityInventory = res.data
    }).catch(
      error => {
        console.log(error)
      }
    )

    if(user.id === ''){
      product = cartDetails.find(e=> e.data.id === config.id);
     
    }else{
      product = productCart.find(e=> e.idSanPhamChiTiet === config.id);
    }

    var productDetail = productDetails.find(e=> e.id === config.id);
    if(product === undefined || product === null){ 
      soLuong = 0
    }else{
      if(user.id !== ''){
        soLuong = product.soLuongSapMua
      }else{
        soLuong = product.quantity
      }
    }

    if(productDetail === undefined || productDetail === null){ 
      return;
    }

    if((soLuong+1) > quantityInventory ){
      toast.error("Sản phẩm trong kho không đủ.Vui lòng chọn sản phẩm khác.")
    }else
    if(soLuong >= 4){
      toast.error("Sản phẩm trong giỏ hàng đã đạt tới số lượng giới hạn.Vui lòng chọn sản phẩm khác.")
    }else{
      setIsLoading(true)
      if(selectedCart === 0){
        if(user.id === ''){
          dispatch(addProductToCart(config))
          setSelectedCartDetail({data: config})
          getCartProduct()
          setTimeout(() => {
            setIsLoading(false)
            navigate('/cart')
          },1000)
        }else{
          request("POST",`/client/cart-detail/add-to-cart?id_customer=${user.id}&id_product_detail=${config.id}&type=plus`
          )
          .then(res => {
            if (res.status === 200) {
              dispatch(addToCart())
              getCartProduct()
              console.log(res.data)
              setSelectedCartDetail(res.data)
              setTimeout(() => {
                setIsLoading(false)
                navigate('/cart')
              },1000)
              
            }
          })
          .catch(res =>{
            setUserNoToken()
            console.log(res)})
        }
      }
    }
  }


  const addConfigs = value => {
    console.log(value)
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
      ).toFixed(0),
      nameProduct: value.tenSanPham,
      urlImage: value.duongDan,
      quantityInventory: value.soLuongTonKho
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

  const borderButtonNoSell = {
    marginRight: 10,
    width: 150,
    height: 46,
    color: 'black',
    border: '1px solid #d1d5db',
    marginBottom: 10,
    opacity: 0.5
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

              <div
                className='title fs-20 fw-7'
                style={{ marginBottom: 20, textAlign: `center`, marginTop: '10px' }}
              >
                Thông tin điện thoại
              </div>

              <div className='title fs-20 fw-7' style={{ width: '95%'}}>
                Mới đây thì chiếc điện thoại {product.nameProduct + " " + config.rom + " GB"} cũng đã
                được chính thức lộ diện trên toàn cầu và đập tan bao lời đồn
                đoán bấy lâu nay, bên trong máy sẽ được trang bị con chip hiệu
                năng khủng cùng sự nâng cấp về camera đến từ nhà {product.nameBrand}.
              </div>

              <img
                src={images.find(e => e.tenMauSac === config.color) === undefined ? "" : images.find(e => e.tenMauSac === config.color).url}
                style={{ marginTop: 10, width: 340, height: 340, marginLeft: '143px' }}
              />

              <div className=' fs-17 ' style={{ width: '95%', marginTop: '10px'}}>
               Máy được chế tác có độ hoàn thiện cực cao với thiết kế nguyên khối, khung nhôm và mặt sau là kính cường lực cao cấp toát lên vẻ ngoài sang chảnh cũng như mang lại độ hiệu quả an toàn cao mỗi khi sử dụng.
              </div>
             
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

                <div className='fw-6' style={{  fontSize: 13 }}>
                  Chọn màu để xem giá :
                </div>

                <div
                  className='info flex align-center flex-wrap fs-14'
                  style={{ marginTop: 10, marginBottom: 0 }}
                >
                  {productDetails.map(item => {
                    if (
                      config.ram === item.dungLuongRam &&
                      config.rom === item.dungLuongRom
                    ) {
                      return (
                        <>
                        {
                          item.soLuongTonKho > 0 ? (
                            <Button
                            type='primary'
                            onClick={() => addConfigs(item)}
                            style={
                              config.color === item.tenMauSac
                                ? item.soLuongTonKho > 0 ? borderButtonChoise : borderButtonNoSell
                                : borderButtonNoChoise
                            }
                            ghost
                          >
                            {config.color === item.tenMauSac && item.soLuongTonKho > 0 ? (
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
                                  color: 'white',
                                 
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
                          ):(
                            <Button
                            type='primary'
                            disabled
                            onClick={() => addConfigs(item)}
                            style={ borderButtonNoSell  }
                            ghost
                          >
                            {config.color === item.tenMauSac && item.soLuongTonKho > 0 ? (
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
                                  color: 'white',
                                 
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
                          )
                        }
                       
                        </>
                      )
                    }
                  })}
                </div>

                <div>
                  <span
                    className='fs-14 mx-2 text-dark fw-6'
                    style={{ marginLeft: '0px', marginTop:'10px', marginBottom: '10px' }}
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
                      // <div
                      //   className='discount bg-orange fs-13 text-white fw-6 font-poppins'
                      //   style={{
                      //     backgroundColor: '#128DE2',
                      //     border: '  1px solid #128DE2'
                      //   }}
                      // >
                      //   -{config.discount} %
                      // </div>

                      <>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <img
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: '10px',
                      marginBottom: '7px',
                      marginTop: '-4px'
                    }}
                  src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:120/q:80/plain/https://dashboard.cellphones.com.vn/storage/dt-ss-sv-2-productbanner-new11.jpg'/>
                </div>

                <div className='btns'>
                  <button
                    type='button'
                    className='add-to-cart-btn btn'
                    style={{
                      backgroundColor: '#128DE2',
                      border: '  1px solid #128DE2',
                      color: 'white',
                      borderRadius: 10,
                      width: `100%`,
                      height: '60px'
                    }}
                    onClick={() => {
                      buyNowHandler()
                    }}
                  >
                    <span className='btn-text' style={{ fontWeight: '600', fontSize: '20px', marginLeft: '8px'}}>
                    {
                      isLoading === true ? 
                      <>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white', marginLeft: 5 }} spin />} />
                      </>:
                      <>
                        Mua ngay 
                      </>
                    }
                    
                    </span>
                  </button>

                  <button
                    type='button'
                    className='buy-now btn mx-2'
                    style={{
                      backgroundColor: 'white',
                      border: '  1px solid #128DE2',
                      borderRadius: 10,
                      width: `18%`,
                      height: '60px',
                      margin: 0,
                      marginLeft: '10px'
                    }}
                    onClick={() => {
                      addToCartHandler()
                    }}
                  >
                     {
                      isLoadingAddToCart === true ? 
                      <>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#128DE2', marginLeft: 5 }} spin />} />
                      </>:
                      <>
                      <i className='fas fa-shopping-cart' style={{ color: '#128DE2'}}></i>
                      <span className='btn-text mx-2'
                        style={{ color: '#128DE2', display: 'block', fontSize: '8px' }}
                      >Thêm vào giỏ</span>
                      </>
                    }
                    
                  </button>
                </div>

                {/* config */}
                <div
                className='title fs-20 fw-7'
                style={{ marginBottom: 20, textAlign: `center`, marginTop:'10px' }}
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

           
              </div>
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
