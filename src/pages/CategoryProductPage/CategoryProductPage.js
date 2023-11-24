import React, { useEffect, useState } from 'react'
import './CategoryProductPage.scss'
import './CategoryProduct.css'
import ProductListNormal from '../../components/ProductList/ProductListNormal'
import { useDispatch, useSelector } from 'react-redux'
import {
  getCategoryProductsStatus
} from '../../store/categorySlice'
import Loader from '../../components/Loader/Loader'
import { STATUS } from '../../utils/status'
import axios from 'axios'
import { Button, Slider, Select } from 'antd'
import { ResetSelectedCart } from '../../store/cartSlice'

const CategoryProductPage = () => {
  const dispatch = useDispatch()
  const categoryProductsStatus = useSelector(getCategoryProductsStatus)
  // const searchInput = useRef(null);
  const [products, setProducts] = useState([]);
  const [listChip, setlistChip] = useState([])
  const [listRam, setListRam] = useState([])
  const [listManHinh, setlistManHinh] = useState([])
  const [listRom, setlistRom] = useState([])
  const [listPin, setListPin] = useState([])
  const [listNhaSanXuat, setlistNhaSanXuat] = useState([])
  const [listDongSanPham, setListDongSanPham] = useState([])
  const [listTanSoQuet, setListTanSoQuet] = useState([])
  const [priceBiggest, setpriceBiggest] = useState(0)

  const [chiTietSanPham, setchiTietSanPham] = useState({
    sanPham: '',
    dongSanPham: '',
    nhaSanXuat: '',
    mauSac: '',
    pin: '',
    ram: '',
    rom: '',
    chip: '',
    manHinh: '',
    donGiaMin: '',
    donGiaMax: '',
    trangThai: '',
    tanSoQuet:''
  })

  useEffect(() => {
    loadDataComboBox()
    searchProducts()
    dispatch(ResetSelectedCart())
    window.scrollTo(0, 0);
  }, [dispatch, chiTietSanPham])

  const loadDataComboBox = async () => {
    axios
      .get('http://localhost:8080/client/product-line/get-list-product-lines')
      .then(response => {
        var itemAll = {
          label: 'Tất cả',
          value: 'dongSanPham:'
        }
        const modifiedData = response.data.map((item, index) => ({
          label: item.tenDongSanPham,
          value: 'dongSanPham:' + item.tenDongSanPham
        }))
        modifiedData.unshift(itemAll)
        setListDongSanPham(modifiedData)
      })
      .catch(error => console.log(error))

    axios
      .get('http://localhost:8080/client/brand/get-list-brands')
      .then(response => {
        console.log(response)
        var itemAll = {
          label: 'Tất cả',
          value: 'nhaSanXuat:'
        }
        const modifiedData = response.data.map((item, index) => ({
          label: item.tenHang,
          value: 'nhaSanXuat:' + item.tenHang
        }))
        modifiedData.unshift(itemAll)
        setlistNhaSanXuat(modifiedData)
      })
      .catch(error => console.log(error))

    axios
      .get(`http://localhost:8080/client/pin/get-list-pins`)
      .then(response => {
        var itemAll = {
          label: 'Tất cả',
          value: 'pin:'
        }
        const modifiedData = response.data.map((item, index) => ({
          label: item.dungLuong + ' mah',
          value: 'pin:' + item.dungLuong
        }))
        modifiedData.unshift(itemAll)
        setListPin(modifiedData)
      })
      .catch(error => console.log(error))

    axios
      .get(`http://localhost:8080/client/ram/get-all-ram`)
      .then(response => {
        var itemAll = {
          label: 'Tất cả',
          value: 'ram:'
        }
        const modifiedData = response.data.map((item, index) => ({
          label: item.dungLuong + ' GB',
          value: 'ram:' + item.dungLuong
        }))
        modifiedData.unshift(itemAll)
        setListRam(modifiedData)
      })
      .catch(error => console.log(error))

    axios
      .get(`http://localhost:8080/client/rom/get-all-rom`)
      .then(response => {
        var itemAll = {
          label: 'Tất cả',
          value: 'rom:'
        }
        const modifiedData = response.data.map((item, index) => ({
          label: item.dungLuong + ' GB',
          value: 'rom:' + item.dungLuong
        }))
        modifiedData.unshift(itemAll)
        setlistRom(modifiedData)
      })
      .catch(error => console.log(error))

    axios
      .get(`http://localhost:8080/client/chip/get-list-chips`)
      .then(response => {
        var itemAll = {
          label: 'Tất cả',
          value: 'chip:'
        }
        const modifiedData = response.data.map((item, index) => ({
          label: item.tenChip,
          value: 'chip:' + item.tenChip
        }))
        modifiedData.unshift(itemAll)
        setlistChip(modifiedData)
      })
      .catch(error => console.log(error))

    axios
      .get(`http://localhost:8080/client/display/get-list-displays`)
      .then(response => {
        var itemAll = {
          label: 'Tất cả',
          value: 'manHinh:'
        }
        var itemAllTanSoQuet = {
          label: 'Tất cả',
          value: 'tanSoQuet:'
        }
        const modifiedData = response.data.map((item, index) => ({
          label: item.kichThuoc + ' inch',
          value: 'manHinh:' + item.kichThuoc
        }))

        const modifiedDataTanSoQuet = response.data.map((item, index) => ({
          label: item.tanSoQuet + ' Hz',
          value: 'tanSoQuet:' + item.tanSoQuet
        }))
        modifiedData.unshift(itemAll)
        modifiedDataTanSoQuet.unshift(itemAllTanSoQuet)
        setlistManHinh(modifiedData)
        setListTanSoQuet(modifiedDataTanSoQuet)
      })
      .catch(error => console.log(error))

    axios
      .get('http://localhost:8080/client/product-detail/get-max-price')
      .then(response => {
        setpriceBiggest(response.data)
      })
      .catch(error => console.log(error))
  }

  const handleChange = value => {
    console.log(chiTietSanPham)
    setchiTietSanPham({
      ...chiTietSanPham,
      [String(value).slice(0, String(value).indexOf(':'))]: String(value).slice(
        String(value).indexOf(':') + 1
      )
    })
  }

  const sliderChange = e => {
    console.log(chiTietSanPham)
    setchiTietSanPham({
      ...chiTietSanPham,
      ['donGiaMin']: e[0],
      ['donGiaMax']: e[1]
    })
  }

  const searchProducts = async () => {
    await axios.post(`http://localhost:8080/client/product-detail/search`, chiTietSanPham)
    .then(res => {
      if(res.status === 200){
        setProducts(res.data)
      }
      console.log(res)
    })
    .catch(error => console.log(error));
  }

  return (
    <div className='cat-products bg-white'>
      <div className='container'>
        <div className='cat-products-content' style={{ width: '104%'}}>
          <h3 style={{ marginBottom: `0px`, marginTop: 20 }}>
            {' '}
            <span
              className='text-capitalize'
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: 600,
                position: `relative`,
                right: `-20px`
              }}
            >
              Chọn theo tiêu chí
            </span>
          </h3>
          <div className="card " style={{ padding: ` 2% 3%`, width: '94%' }}>
            <div
              className='btn-add'
              style={{
                width: `100%`,
                marginRight: 20,
                justifyContent: 'center'
              }}
            >
              <Select
                defaultValue='Chọn dòng sản phẩm'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một dòng sản phẩm',
                    options: listDongSanPham
                  }
                ]}
              />

              <Select
                listItemHeight={10}
                listHeight={250}
                defaultValue='Chọn hãng'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một hãng',
                    options: listNhaSanXuat
                  }
                ]}
              />

              <Select
                defaultValue='Chọn pin'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một dung lượng pin',
                    options: listPin
                  }
                ]}
              />

              <Select
                defaultValue='Chọn ram'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một dung lượng ram',
                    options: listRam
                  }
                ]}
              />

              <Select
                defaultValue='Chọn rom'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một dung lượng rom',
                    options: listRom
                  }
                ]}
              />

              <Select
                defaultValue='Chọn chip'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một chip',
                    options: listChip
                  }
                ]}
              />

              <Select
                defaultValue='Chọn kích cỡ màn hình'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một kích cỡ màn hình',
                    options: listManHinh
                  }
                ]}
              />

              <Select
                defaultValue='Chọn tần số quét'
                style={{
                  width: `23%`,
                  marginRight: 15,
                  marginBottom: 20,
                  height: 40
                }}
                onChange={handleChange}
                options={[
                  {
                    label: 'Chọn một tần số quét',
                    options: listTanSoQuet
                  }
                ]}
              />

              <div style={{ display: 'flex' }}>
                <label style={{ color: 'black' }}>Lựa chọn khoảng giá : </label>

                <div style={{ display: 'flex' }}>
                  <Button
                    style={{ marginLeft: 40, marginBottom: 20 }}
                    type='primary'
                    ghost
                  >
                    {chiTietSanPham.donGiaMin == ''
                      ? '0'.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
                        ' đ'
                      : chiTietSanPham.donGiaMin
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ'}
                  </Button>
                  <Slider
                    onChange={e => sliderChange(e)}
                    style={{ width: 250, marginLeft: 5, marginBottom: 20 }}
                    min={0}
                    max={Number(priceBiggest)}
                    step={100000}
                    range
                    defaultValue={[0, Number(priceBiggest)]}
                  />
                  <Button
                    style={{ marginLeft: 5, marginBottom: 20 }}
                    type='primary'
                    ghost
                  >
                    {chiTietSanPham.donGiaMax == ''
                      ? priceBiggest
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ'
                      : chiTietSanPham.donGiaMax
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ'}
                  </Button>
                </div>
              </div>
            </div>
            </div>

          {/* 

          <div style={{ display: 'flex'}}>


          <div style={{ color: '#149e9e', borderRadius: '10px',  border: '1px solid #149e9e', width: '14%', fontSize: '13px', padding: '6px', marginLeft: '9px', display: 'flex'}}>
            <span>
            Loại điện thoại: Android 
            </span>
            <i class="fa-solid fa-xmark" style={{ fontSize: '16px', marginTop: 2, marginLeft: 4}}></i>
          </div>

          </div>

          <div style={{ display: 'flex'}}>
            <div style={{ color: '#149e9e', borderRadius: '10px',  border: '1px solid #149e9e', width: '14%', fontSize: '13px', padding: '6px', marginLeft: '9px', display: 'flex'}}>
              <span>
              Loại điện thoại: Android 
              </span>
              <i class="fa-solid fa-xmark" style={{ fontSize: '16px', marginTop: 2, marginLeft: 4}}></i>
            </div>

          </div>

          <div style={{ display: 'flex'}}>
            <div style={{ color: '#149e9e', borderRadius: '10px',  border: '1px solid #149e9e', width: '14%', fontSize: '13px', padding: '6px', marginLeft: '9px', display: 'flex'}}>
              <span>
              Loại điện thoại: Android 
              </span>
              <i class="fa-solid fa-xmark" style={{ fontSize: '16px', marginTop: 2, marginLeft: 4}}></i>
            </div>

          </div> */}

          {categoryProductsStatus === STATUS.LOADING ? (
            <Loader />
          ) : (
            <ProductListNormal products={products} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryProductPage
