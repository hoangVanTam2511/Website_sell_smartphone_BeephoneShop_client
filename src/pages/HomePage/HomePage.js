import React, { useEffect, useState } from 'react'
import './HomePage.scss'
import './HomePage.css'
import HeaderSlider from '../../components/Slider/HeaderSlider'
import { useSelector, useDispatch } from 'react-redux'
import { getAllCategories } from '../../store/categorySlice'
import ProductList from '../../components/ProductList/ProductList'
import { getAllProductsStatus } from '../../store/productSlice'
import Loader from '../../components/Loader/Loader'
import { STATUS } from '../../utils/status'
import axios from 'axios'
import Button from '@mui/material/Button'
import FlashsalePage from '../../pages/FlashsalePage/FlashsalePage'

const HomePage = () => {
  const dispatch = useDispatch()
  const categories = useSelector(getAllCategories)

  useEffect(() => {
    getNewProducts()
  }, [])

  const [products, setProducts] = useState([])
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

  return (
    <main>
      <div className='slider-wrapper'>
        <HeaderSlider />
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
                  <ProductList products={products} />
                )}
              </div>
            </div>

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
