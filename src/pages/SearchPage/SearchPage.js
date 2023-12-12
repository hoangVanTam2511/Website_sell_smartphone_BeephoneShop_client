import React, {useEffect, useState} from 'react';
import "./SearchPage.scss";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { STATUS } from '../../utils/status';
import Loader from '../../components/Loader/Loader';
import ProductListNormal   from '../../components/ProductList/ProductList';
import { getSearchProductsStatus, clearSearch } from '../../store/searchSlice';
import { ResetSelectedCart } from '../../store/cartSlice'
import { setUserNoToken } from '../../store/userSlice';
import { Empty } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { request, setAuthHeader } from '../../helpers/axios_helper'

const SearchPage = () => {
  const dispatch = useDispatch();
  const {searchTerm } = useParams();
  const [searchProducts, setSearchProducts] = useState([]);
  const searchProductsStatus = useSelector(getSearchProductsStatus);
  
  useEffect(() => {
    searchProductsByAllPosition()
    dispatch(clearSearch());
    dispatch(ResetSelectedCart());
  }, [searchTerm]);

  const searchProductsByAllPosition = async () => {
    request("POST",`/client/product-detail/search`,
        {
          tenSanPham: searchTerm,
          dongSanPham: '',
          nhaSanXuat: ``,
          mauSac: '',
          pin: '',
          ram: '',
          rom: '',
          chip: '',
          manHinh: '',
          donGiaMin: '',
          donGiaMax: '',
          trangThai: '',
          tanSoQuet: ''
        }
      )
      .then(res => {
        if (res.status === 200) {
          setSearchProducts(res.data)
          console.log(res.data)
          window.scrollTo(0,0)
        }
       
      })
      .catch(error => {
        setUserNoToken()
        console.log(error)})
  }

  if(searchProducts.length === 0){
    return (
      <div className='container bg-white' style = {{
        minHeight: "60vh", paddingTop: 80
      }}>
        <Empty description={"Không tìm thấy sản phẩm nào phù hợp với tiêu chí!"} />
        <br/>
        <Link
            to='/'
            className='shopping-btn text-white fw-5'
            style={{
              backgroundColor: `#128DE2`,
              border: '1px solid #128DE2',
              borderRadius: '10px',
              marginLeft: '530px',
              marginTop: '5%'
            }}
          >
            Đi tới trang chủ
          </Link>
      </div>
    )
  }

  return (
    <main>
      <div className='search-content bg-white'>
        <div className='container'>
          <div >
            <div className='search-title'>
              <h3>Tìm thấy
                <strong style={{ fontWeight: 600}}> {searchProducts.length} </strong> 
                sản phẩm cho từ khoá
                <strong style={{ fontWeight: 600}}> {searchTerm} </strong>
                :</h3>
            </div>
            {
              searchProductsStatus === STATUS.LOADING ? <Loader /> : <ProductListNormal products = {searchProducts} />
            }
          </div>
        </div>
      </div>
    </main>
  )
}

export default SearchPage;