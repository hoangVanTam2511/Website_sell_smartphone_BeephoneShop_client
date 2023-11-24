import React, { useEffect, useState } from 'react'
import './OrderDetail.css'
import { Divider, DatePicker } from 'antd'
import axios from 'axios'

const OrderDetail = props => {
  const [bill, setBill] = useState([])

  useEffect(() => {
    setBill(props.id_bill)
    console.log()
  }, [])

  const formatMoney = number => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(number)
  }

  return (
    <>
      <div class='card' style={{ width: '100%' }}>
        <div
          style={{
            width: '98%',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ width: '47%', fontWeight: '600' }}>
            <i class='fa fa-arrow-left'></i>
          </div>

          <div style={{ width: '40%', fontWeight: '600' }}>
            Chi tiết đơn hàng {bill.ma} -{' '}
            <span style={{ color: 'orange' }}> Đang vận chuyển</span>
          </div>
        </div>
        <Divider />

        <div style={{ marginLeft: '4%', width: '110%', marginBottom: '107px' }}>
          <ul class='steps'>
            <li className='active'>
              <div class='img'>
                <i class='fa fa-file-invoice'></i>
              </div>
              <div class='caption'>
                <span className='text-top'>Đơn hàng đã đặt</span>
                <span className='text-bottom'>22 4/4/2003</span>
              </div>
            </li>

            <li className='active'>
              <div class='img'>
                <i class='fa fa-file-invoice'></i>
              </div>
              <div class='caption'>
                <span className='text-top'>Đơn hàng đã đặt</span>
                <span className='text-bottom'>22 4/4/2003</span>
              </div>
            </li>

            <li className='active'>
              <div class='img'>
                <i class='fa fa-file-invoice'></i>
              </div>
              <div class='caption'>
                <span className='text-top'>Đơn hàng đã đặt</span>
                <span className='text-bottom'>22 4/4/2003</span>
              </div>
            </li>

            <li className='active'>
              <div class='img'>
                <i class='fa fa-file-invoice'></i>
              </div>
              <div class='caption'>
                <span className='text-top'>Đơn hàng đã đặt</span>
                <span className='text-bottom'>22 4/4/2003</span>
              </div>
            </li>

            <li className='active'>
              <div class='img'>
                <i class='fa fa-file-invoice'></i>
              </div>
              <div class='caption'>
                <span className='text-top'>Hoàn thành</span>
                <span className='text-bottom'>22 4/4/2003</span>
              </div>
            </li>
          </ul>
        </div>

        <br />

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div class='card' style={{ width: '67%' }}>
            <h5>
              THÔNG TIN NHẬN HÀNG
              <Divider></Divider>
            </h5>

            <div>
              <span
                style={{
                  color: '#000000',
                  width: '100px',
                  display: 'inline-block'
                }}
              >
                Người nhận:
              </span>
              <span>
                {bill.tenNguoiNhan} - {bill.soDienThoaiNguoiNhan}
              </span>
            </div>

            <div>
              <span
                style={{
                  color: '#000000',
                  width: '100px',
                  display: 'inline-block'
                }}
              >
                Địa chỉ:
              </span>
              <span>
                {bill.diaChiNguoiNhan +
                  ',' +
                  bill.xaPhuongNguoiNhan +
                  ',' +
                  bill.quanHuyenNguoiNhan +
                  ',' +
                  bill.tinhThanhPhoNguoiNhan}
              </span>
            </div>

            <div>
              <span
                style={{
                  color: '#000000',
                  width: '100px',
                  display: 'inline-block'
                }}
              >
                Nhận lúc:
              </span>
              <span>
                {bill.ngayNhanHang === null
                  ? 'Chưa có thông tin'
                  : bill.ngayNhanHang}
              </span>
            </div>
          </div>

          <div class='card' style={{ width: '30%' }}>
            <h5>
              HÌNH THỨC THANH TOÁN
              <Divider></Divider>
            </h5>

            <div>Thanh toán khi nhận hàng</div>
          </div>
        </div>
        <br />

        <div class='card' style={{ width: '100%' }}>
          <h5>
            THÔNG TIN SẢN PHẨM
            <Divider></Divider>
          </h5>

          {props.id_bill.orderItems.map((product, index) => (
            <>
              <div
                className='cart-ctr'
                key={product?.sanPhamChiTiet.id}
                style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}
              >
                <div className='cart-ctd'>
                  <img
                    style={{ width: 112, height: 105 }}
                    src='https://cdn.tgdd.vn/Products/Images/42/235838/Galaxy-S22-Ultra-Black-200x200.jpg'
                  />
                </div>
                <div
                  className='cart-ctd'
                  style={{ position: 'relative', top: '0px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: 971,
                      height: 140,
                      marginLeft: 10
                    }}
                  >
                    <div style={{ width: '90%', marginTop: 17 }}>
                      <span className='cart-ctxtf fw-7'>
                        {product?.sanPhamChiTiet.sanPham.tenSanPham +
                          ' ' +
                          product?.sanPhamChiTiet.ram.dungLuong +
                          'GB ' +
                          product?.sanPhamChiTiet.rom.dungLuong +
                          'GB - ' +
                          product?.sanPhamChiTiet.mauSac.tenMauSac}
                      </span>
                      <br />
                      <span>
                        <span
                          className='cart-ctxt'
                          style={{
                            color: '#128DE2',
                            fontSize: '17px',
                            fontWeight: 500
                          }}
                        >
                          {formatMoney(
                            product?.donGiaSauGiam === 0
                              ? product?.donGia
                              : product?.donGiaSauGiam
                          )}
                        </span>
                        <del
                          style={{
                            color: '#999',
                            fontSize: '14px',
                            marginLeft: '5px',
                            fontWeight: 500
                          }}
                        >
                          {product?.donGiaSauGiam === 0
                            ? ''
                            : formatMoney(product?.donGia)}
                        </del>
                      </span>
                    </div>
                    <div
                      style={{
                        width: '58%',
                        marginTop: 22,
                        fontWeight: 500
                      }}
                    >
                      Số lượng :
                      <span style={{ color: '#128DE2' }}>
                        {' ' + product?.soLuong}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='cart-ctd'></div>
                <div className='cart-ctd'></div>

                <div className='cart-ctd'></div>
              </div>

              <Divider></Divider>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', float: 'right', fontSize: 14, color: '#222' }}>
                <h4>Tổng tiền hàng</h4>
                <span>{formatMoney(bill.tongTien)}</span>
              </div>
              <br/>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', float: 'right', fontSize: 14, color: '#222' }}>
                <h4>Phí vận chuyển</h4>
                <span>{formatMoney(bill.phiShip)}</span>
              </div>
              <br/>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', float: 'right', fontSize: 14, color: '#222' }}>
                <h4>Voucher từ shop</h4>
                <span>{formatMoney(bill.tongTien - bill.tongTienSauKhiGiam)}</span>
              </div>
               <br/>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', float: 'right' }}>
                <h4>Thành tiền</h4>
                <span>{formatMoney(bill.tongTien)}</span>
              </div>
              <br/>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', float: 'right' }}>
                <h4 className='fw-6'>Cần thanh toán</h4>
                <span style={{ color: '#d0021c', fontWeight: 600 }}>{formatMoney(bill.tongTien + bill.phiShip)}</span>
              </div>
              <br/>
            </>
          ))}
        </div>
      </div>
    </>
  )
}
export default OrderDetail
