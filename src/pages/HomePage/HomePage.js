import React, { useEffect, useState } from 'react'
import './HomePage.scss'
import './HomePage.css'
import HeaderSlider from '../../components/Slider/HeaderSlider'
import { useSelector, useDispatch } from 'react-redux'
import ProductList from '../../components/ProductList/ProductList'
import { getAllProductsStatus } from '../../store/productSlice'
import Loader from '../../components/Loader/Loader'
import { STATUS } from '../../utils/status'
import axios from 'axios'
import { ResetSelectedCart } from '../../store/cartSlice'
import 'react-multi-carousel/lib/styles.css'
import { over } from 'stompjs'
import SockJS from 'sockjs-client'

var stompClient = null
const HomePage = () => {
  const dispatch = useDispatch()
  const [changeRealTime, setChangeRealTime] = useState('')

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
    setChangeRealTime(data.name)
  }

  const onError = err => {
    console.log(err)
  }

  useEffect(() => {
    getNewProducts()
    getListProductBestSeller()

    dispatch(ResetSelectedCart())
    if (stompClient === null) {
      connect()
    }
    window.scrollTo(0, 0);
  }, [changeRealTime])

  const [products, setProducts] = useState([])
  const [productBestSeller, setProductBestSeller] = useState([])
  const productStatus = useSelector(getAllProductsStatus)

  const getNewProducts = async () => {
    await axios
      .get(`http://localhost:8080/client/product-detail/get-list-products`)
      .then(res => {
        if (res.status === 200) {
          setProducts(res.data)
        }
        console.log(res)
      })
      .catch(error => console.log(error))
  }

  const getListProductBestSeller = async () => {
    await axios
      .get(`http://localhost:8080/client/product-detail/get-products-best-seller`)
      .then(res => {
        if (res.status === 200) {
          setProductBestSeller(res.data)
        }
        console.log(res)
      })
      .catch(error => console.log(error))
  }

  return (
    <main>
      <div style={{ backgroundColor: 'white', margin: 0}}>
        <img 
        style={{
          maxWidth: `100%`,
          borderRadius: `0 0 60px 60px`
        }}
        src='https://cdn2.viettelstore.vn/images/Advertises/BANNER-BIG_PC-(1)_62146192221112023.jpg' />
      </div>

      <div className='slider-wrapper'>
        <HeaderSlider />
      </div>

      <div>
        {/* <Carousel
              additionalTransfrom={0}
              showDots={false}
              arrows={true}
              autoPlaySpeed={3000}
              autoPlay={true}
              centerMode={false}
              className="slider"
              containerClass="container-with-dots"
              dotListClass="dots"
              draggable
              focusOnSelect={false}
              infinite
              itemClass="carousel-top"
              keyBoardControl
              minimumTouchDrag={80}
              renderButtonGroupOutside={false}
              renderDotsOutside
              responsive={responsive}
        style={{  }}
        >

          <div>
            <img src='https://cdn2.viettelstore.vn/images/Advertises/BANNER-BIG_PC-(1)_62146192221112023.jpg'/>
          </div>
    </ Carousel> */}
      </div>

      <div className='main-content bg-white'>
        <div className='container'>
          <div className='categories'>
            <div class='slider'>
              <div class='slide-track'>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
                <div class='slide'>
                  <img
                    src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png'
                    height='100'
                    width='250'
                    alt=''
                  />
                </div>
              </div>
            </div>

            {/* <FlashsalePage/> */}

            {
              productBestSeller.length === 0 ? <></> :
              <div className='categories-item'>
              <div className='categories-item'>
                <div
                  style={{
                    width: '97%',
                    margin: '0 auto'
                  }}
                >
                  <h3
                    style={{
                      color: '#444',
                      fontWeight: '600',
                      fontSize: '22px',
                      display: 'inline-block'
                    }}
                  >
                    Sản phẩm bán chạy
                  </h3>

                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <button
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: `10px`,
                        color: `#444`,
                        float: `right`,
                        fontSize: `13px`,
                        height: `34px`,
                        padding: ` 5px 10px`,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Xem tất cả
                    </button>
                  </div>

                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <button
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: `10px`,
                        color: `#444`,
                        float: `right`,
                        fontSize: `13px`,
                        height: `34px`,
                        padding: ` 5px 10px`,
                        whiteSpace: 'nowrap',
                        marginRight: '10px'
                      }}
                    >
                      Sony
                    </button>
                  </div>

                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <button
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: `10px`,
                        color: `#444`,
                        float: `right`,
                        fontSize: `13px`,
                        height: `34px`,
                        padding: ` 5px 10px`,
                        whiteSpace: 'nowrap',
                        marginRight: '10px'
                      }}
                    >
                      Samsung
                    </button>
                  </div>

                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <button
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: `10px`,
                        color: `#444`,
                        float: `right`,
                        fontSize: `13px`,
                        height: `34px`,
                        padding: ` 5px 10px`,
                        whiteSpace: 'nowrap',
                        marginRight: '10px'
                      }}
                    >
                      Xiaomi
                    </button>
                  </div>

                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <button
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: `10px`,
                        color: `#444`,
                        float: `right`,
                        fontSize: `13px`,
                        height: `34px`,
                        padding: ` 5px 10px`,
                        whiteSpace: 'nowrap',
                        marginRight: '10px'
                      }}
                    >
                      Apple
                    </button>
                  </div>
                </div>
                {productStatus === STATUS.LOADING ? (
                  <Loader />
                ) : (
                  <ProductList products={productBestSeller} />
                )}
              </div>
            </div>
            }
       

            <div className='categories-item'>
              <div
                style={{
                  width: '97%',
                  margin: '0 auto'
                }}
              >
                <h3
                  style={{
                    color: '#444',
                    fontWeight: '600',
                    fontSize: '22px',
                    display: 'inline-block'
                  }}
                >
                  Sản phẩm mới nhất
                </h3>

                <div style={{ display: 'inline-block', float: 'right' }}>
                  <button
                    style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: `10px`,
                      color: `#444`,
                      float: `right`,
                      fontSize: `13px`,
                      height: `34px`,
                      padding: ` 5px 10px`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Xem tất cả
                  </button>
                </div>

                <div style={{ display: 'inline-block', float: 'right' }}>
                  <button
                    style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: `10px`,
                      color: `#444`,
                      float: `right`,
                      fontSize: `13px`,
                      height: `34px`,
                      padding: ` 5px 10px`,
                      whiteSpace: 'nowrap',
                      marginRight: '10px'
                    }}
                  >
                    Sony
                  </button>
                </div>

                <div style={{ display: 'inline-block', float: 'right' }}>
                  <button
                    style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: `10px`,
                      color: `#444`,
                      float: `right`,
                      fontSize: `13px`,
                      height: `34px`,
                      padding: ` 5px 10px`,
                      whiteSpace: 'nowrap',
                      marginRight: '10px'
                    }}
                  >
                    Samsung
                  </button>
                </div>

                <div style={{ display: 'inline-block', float: 'right' }}>
                  <button
                    style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: `10px`,
                      color: `#444`,
                      float: `right`,
                      fontSize: `13px`,
                      height: `34px`,
                      padding: ` 5px 10px`,
                      whiteSpace: 'nowrap',
                      marginRight: '10px'
                    }}
                  >
                    Xiaomi
                  </button>
                </div>

                <div style={{ display: 'inline-block', float: 'right' }}>
                  <button
                    style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: `10px`,
                      color: `#444`,
                      float: `right`,
                      fontSize: `13px`,
                      height: `34px`,
                      padding: ` 5px 10px`,
                      whiteSpace: 'nowrap',
                      marginRight: '10px'
                    }}
                  >
                    Apple
                  </button>
                </div>
              </div>
              {productStatus === STATUS.LOADING ? (
                <Loader />
              ) : (
                <ProductList products={products} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomePage
