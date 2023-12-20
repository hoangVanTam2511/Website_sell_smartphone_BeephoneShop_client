import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import { Divider, DatePicker,  } from "antd";
import { useSelector } from 'react-redux'
import  OrderDetail from './OrderDetail'
import axios from 'axios'
import { Empty } from 'antd';
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { getUser, setUserNoToken } from '../../store/userSlice'
import toast, { Toaster } from 'react-hot-toast'

const Orders = () => {
  const user = getUser()
  const [listBill, setListBill] = useState([])
  const [listBillFillter, setListBillFillter] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [billSelected, setBillSelected] = useState(0)
  const [billId, setBillId] = useState()
  const [stateOfOrder, setStateOfOrder] = useState(0)

  useEffect(() => {
    getBillsByIdCustomer()
  },[])

  const getBillsByIdCustomer = async() => {
      if(listBill  && listBill.length > 0) return
      let sum = 0;
      request("GET",`/client/bill/get-list-bills?id_customer=${user.id}`).then(
        res => {
          // console.log(res.data)
          setListBill(res.data)
          setListBillFillter(res.data)
          // console.log(res.data)
          res.data.forEach(item => {
            console.log(item)
            sum += item.tongTienSauKhiGiam 
          })
          setTotalAmount(sum)
        }
      ).catch(error => {
        setUserNoToken()
        console.log(error)
      })
  }

  const formatMoney = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
  }

  const setTab = (data) => {
    setBillSelected(data === null ? 0 : data)
  }

  const cssButtonSelected = () => {
    return {
      backgroundColor: `#128DE2`,
       color: `white`,
        margin:'20px 10px',
         fontSize: '10px', 
         fontWeight: '600' 
    }
  }

  const cssButtonNoSelected = () => {
    return {
      color: `#128DE2`, 
      margin:'20px 10px', 
      fontSize: '10px', 
      fontWeight: '600',
      background: 'white'
    }
  }

  const loadDataWhenSelectButton = (state)=> {
    if(state === 0) {
      setListBillFillter(listBill)
    }else{
      var data = []
      listBill.forEach(item => {
        if(item.trangThai === state){
          data.push(item)
        }
      })
      setListBillFillter(data)
    }
  }

  const getDetailBill = async (id) => {
    await request("GET",`/client/bill/get-bill?id_bill=${id}`).then(
      res => {
        console.log(res.data)
        setBillSelected(1)
        setBillId(res.data)
      }
    ).catch(error => {
      setUserNoToken()
      console.log(error)
    })
  }

  return (
    <>
    {
      billSelected === 0 ?(
        <>
        <div
          class="card title bg-white"
          style={{ justifyContent: "space-around", marginTop: "10px" }}
        >
          <div style={{ textAlign: "center", width: "45%", color: "#128DE2" }}>
            <span className="fs-20 fw-8">{listBill.length}</span>
            <br />
            <span className="fs-20 fw-8">Đơn hàng</span>
          </div>
  
          <div
            style={{ width: "1px", height: "70px", background: "black" }}
          ></div>
  
          <div style={{ textAlign: "center", width: "45%", color: "#128DE2" }}>
            <span className="fs-20 fw-8">{formatMoney(totalAmount)}</span>
            <br />
            <span className="fs-20 fw-8">Tổng tiền đã mua</span>
          </div>
  
          <div></div>
        </div>
  
        <div style={{ marginLeft: '12%'}}>
            <Button
              style={stateOfOrder === 0 ? cssButtonSelected() : cssButtonNoSelected()}
              variant="outlined"
              onClick={() =>{
                 setStateOfOrder(0)
                 loadDataWhenSelectButton(0)
                }}
            >
              Tất cả
            </Button>
  
            <Button
              style={stateOfOrder === 1 ? cssButtonSelected() : cssButtonNoSelected()}
              variant="outlined"
              onClick={() => 
                {
                  setStateOfOrder(1)
                  loadDataWhenSelectButton("PENDING_CONFIRM")
                 }
              }
            >
              Chờ xác nhận
            </Button>
  
            <Button
               style={stateOfOrder === 2 ? cssButtonSelected() : cssButtonNoSelected()}
              variant="outlined"
              onClick={() => 
                {
                  setStateOfOrder(2)
                  loadDataWhenSelectButton("CONFIRMED")
                 }}
            >
              Đã xác nhận
            </Button>
  
  
            <Button
               style={stateOfOrder === 3 ? cssButtonSelected() : cssButtonNoSelected()}
              variant="outlined"
              onClick={() => {
                setStateOfOrder(3)
                loadDataWhenSelectButton("DELIVERING")
               }}
            >
              Đang vận chuyển
            </Button>
  
  
            <Button
              style={stateOfOrder === 4 ? cssButtonSelected() : cssButtonNoSelected()}
              variant="outlined"
              onClick={() => 
                {
                  setStateOfOrder(4)
                  loadDataWhenSelectButton("SUCCESS_DELIVERY")
                 }}
            >
              Đã giao hàng
            </Button>
  
  
            <Button
               style={stateOfOrder === 5 ? cssButtonSelected() : cssButtonNoSelected()}
              variant="outlined"
              onClick={() => 
                {
                  setStateOfOrder(5)
                  loadDataWhenSelectButton("CANCELLED")
                 }}
            >
              Đã hủy
            </Button>
            
            
        </div>

        {
          listBillFillter.length === 0 ? (
            <Empty description={"Không có đơn hàng nào được tìm thấy"} />
          ):<></>
        }
  
        {
          listBillFillter.map((bill, index) => (
            <>
            <div class="card bg-white">
            <div class="title">
              <h4>
                {" "}
                <span className="fw-6">Đơn hàng</span>: {bill.ma}
              </h4>
              <h4>
                {" "}
                <span className="fw-6" style={{ color: `green` }}>
                  {bill.trangThai === 'PENDING_CONFIRM' ? 'Chờ xác nhận' :
                  bill.trangThai === 'CONFIRMED' ? "Đã xác nhận" :
                  bill.trangThai === 'DELIVERING' ? "Đang vận chuyển" :
                  bill.trangThai === 'SUCCESS_DELIVERY' ? "Đã giao hàng" 
                  : 'Đã huỷ'}
                </span>
              </h4>
            </div>
    
            <Divider></Divider>
    
            <div class="title">
              <h4 class="title">
                 <img
                      style={{ width: `20%` }}
                      src={bill.duongDan}
                    />
                    <span className="fw-6" style={{ marginLeft: "-120px", width: '78%',  }}>
                    {bill.tenSanPham +
                    "(" + bill.ram + "GB +" + bill.rom + "GB" + ") "+
                    bill.tenMauSac
                    } 
                    <span
                     style={{
                      textTransform: `lowercase`,
                      color: `rgb(18, 141, 226)`,
                      textDecoration: `underline`,
                      fontSize: `14px`,
                      marginLeft: `4px`,
                     }}
                     onClick={() => getDetailBill(bill.id)}
                    >
                      {
                        bill.soLuongSanPham -1 === 0 ?(
                          <></>
                        ):(
                          <>
                           và {bill.soLuongSanPham-1} sản phẩm khác...
                          </>
                        )
                      }
                    
                    </span>
                    </span>
                
              </h4>
              <h4 className="fs-12">
                {" "}
                Tổng tiền: <span className="fw-6 fs-16">{formatMoney(bill.tongTienSauKhiGiam)}</span>
              </h4>
            </div>
    
            <div className="title">
              <div></div>
              <div>
                <Button
                  style={{ backgroundColor: `#128DE2`, color: `white` }}
                  variant="outlined"
                  onClick={() => getDetailBill(bill.id)}
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </div>
    
          <br />
          </>
          ))
        } 
        </>  
      ):(
        <>
        <div style={{ width: `110%`, margin: `0px auto` }}>
          <OrderDetail id_bill={billId} setTab={setTab} />
        </div>
        </>

      )
    }
    
       
    </>
  );
};
export default Orders;
