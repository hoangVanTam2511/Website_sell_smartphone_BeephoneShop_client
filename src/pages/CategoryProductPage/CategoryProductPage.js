import React, { useEffect } from 'react'
import './CategoryProductPage.scss'
import './CategoryProduct.css'
import ProductList from '../../components/ProductList/ProductList'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  getAllProductsByCategory,
  fetchAsyncProductsOfCategory,
  getCategoryProductsStatus
} from '../../store/categorySlice'
import Loader from '../../components/Loader/Loader'
import { STATUS } from '../../utils/status'
import Slider from 'react-slick'
import { Col, Row, Select } from 'antd'

const CategoryProductPage = () => {
  const dispatch = useDispatch()
  const { category } = useParams()
  const categoryProducts = useSelector(getAllProductsByCategory)
  const categoryProductsStatus = useSelector(getCategoryProductsStatus)

  const handleChange = value => {
    console.log(value) // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  }

  let settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  useEffect(() => {
    dispatch(fetchAsyncProductsOfCategory(category))
  }, [dispatch, category])

  return (
    <div className='cat-products py-5 bg-white'>
      <div className='container'>
        <div className='slider-content overflow-x-hidden slider-products'>
          <Row>
            <Col span={12}>
              <Slider {...settings}>
                <div className='slider-item'>
                  <img
                    src='https://cdn2.cellphones.com.vn/insecure/rs:fill:595:0/q:80/plain/https://dashboard.cellphones.com.vn/storage/realme-2010-cate-th10.jpg'
                    alt=''
                  />
                </div>
                <div className='slider-item'>
                  <img
                    src='https://cdn2.cellphones.com.vn/insecure/rs:fill:595:0/q:80/plain/https://dashboard.cellphones.com.vn/storage/cate-ip15-th10.png'
                    alt=''
                  />
                </div>
              </Slider>
            </Col>
            <Col span={12}>
              <Slider {...settings}>
                <div className='slider-item'>
                  <img
                    src='https://cdn2.cellphones.com.vn/insecure/rs:fill:595:0/q:80/plain/https://dashboard.cellphones.com.vn/storage/xiaomi-13t-seriess-cate1.jpg'
                    alt=''
                  />
                </div>
                <div className='slider-item'>
                  <img
                    src='https://cdn2.cellphones.com.vn/insecure/rs:fill:595:0/q:80/plain/https://dashboard.cellphones.com.vn/storage/dt-xiaomi-cate-new-001.jpg'
                    alt=''
                  />
                </div>
              </Slider>
            </Col>
          </Row>
        </div>
        <div className='cat-products-content'>
            <h3 style={{  marginBottom:`10px`, marginTop:10 }}> <span className='text-capitalize' style={{ color: 'black', fontSize:18, fontWeight:600, position:`relative`, right: `-20px`, }}>Chọn theo tiêu chí</span></h3>
          <div>
            <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Dung lượng ram'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `0 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Nhu cầu sử dụng'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />

            <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Loại điện thoại'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `0 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Bộ nhớ trong'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />

            <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Tính năng đặc biệt'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `0 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Tính năng camera'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />

            <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Tính năng camera'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `0 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Tần số quét'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />

            <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Tính năng camera'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `0 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Tính năng camera'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />    


            <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Bộ nhớ trong'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `0 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Tính năng camera'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />    

          <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Kích thước màn hình'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `10px 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Tính năng camera'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />   

               <Select
              labelInValue
              defaultValue={{
                value: 'Ram',
                label: 'Chip xử lý'
              }}
              style={{
                width: 160,
                height: 40,
                margin: `10px 10px`
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Chip xử lý'
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)'
                }
              ]}
            />    

            
          </div>

          {categoryProductsStatus === STATUS.LOADING ? (
            <Loader />
          ) : (
            <ProductList products={categoryProducts} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryProductPage
