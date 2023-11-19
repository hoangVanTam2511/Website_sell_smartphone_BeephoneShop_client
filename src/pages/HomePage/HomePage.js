import React, {useEffect, useState} from 'react';
import "./HomePage.scss";
import "./HomePage.css";
import HeaderSlider from "../../components/Slider/HeaderSlider";
import { useSelector, useDispatch } from 'react-redux';
import { getAllCategories } from '../../store/categorySlice';
import ProductList from "../../components/ProductList/ProductList";
import { getAllProductsStatus } from '../../store/productSlice';
import Loader from "../../components/Loader/Loader";
import { STATUS } from '../../utils/status';
import axios from 'axios';

const HomePage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(getAllCategories);

  useEffect(() => {
    getNewProducts()
  }, []);

  const [products, setProducts] = useState([]);
  const productStatus = useSelector(getAllProductsStatus);

  const getNewProducts = async () => {
    await axios.get(`http://localhost:8080/client/product-detail/get-list-products`)
    .then(res => {
      if(res.status === 200){
        setProducts(res.data)
      }
      console.log(res)
    })
    .catch(error => console.log(error));
  }


  return (
    <main>
      <div className='slider-wrapper' >
        <HeaderSlider/>
      </div>
      <div className='main-content bg-white'>
        <div className='container'>
          <div className='categories'>
            <div className='categories-item'>
              <div 
                style={{
                  width: '97%',
                  margin: '0 auto',
                }}
              >
                <h3 style={{ color: '#444', fontWeight: '600', fontSize: '22px'   }}>Sản phẩm mới nhất</h3>
              </div>
              { productStatus === STATUS.LOADING ? <Loader /> : <ProductList products = {products} />}
            </div>

            <div className='categories-item'>
              <div 
               style={{
                width: '97%',
                margin: '0 auto',
              }}
              >
                <h3 style={{
                  color: '#444', fontWeight: '600', fontSize: '22px'
                }}
                >Sản phẩm bán chạy</h3>
              </div>
              { productStatus === STATUS.LOADING ? <Loader /> : <ProductList products = {products} />}
            </div>

            </div>
        </div>
      </div>
    </main>
  )
}

export default HomePage