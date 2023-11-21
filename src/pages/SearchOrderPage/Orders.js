import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import { Divider, DatePicker,  } from "antd";
import { useSelector } from 'react-redux'
import axios from 'axios'

const { RangePicker } = DatePicker;
const Orders = () => {
  const user = useSelector(state => state.user.user)
  const [listBill, setListBill] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    getBillsByIdCustomer()
  },[])

  const getBillsByIdCustomer = async() => {
      if(listBill  && listBill.length > 0) return
      let sum = 0;
      await axios.get(`http://localhost:8080/client/bill/get-list-bills?id_customer=${user.id}`).then(
        res => {
          setListBill(res.data)
          console.log(res.data)
          res.data.forEach(item => {
            sum += item.tongTienSauKhiGiam
          })
          setTotalAmount(sum)
        }
      )
  }

  const formatMoney = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
  }

  return (
    <>
      <div style={{ width: `25%`, margin: `0px auto` }}>
        <div
          style={{
            width: `70px`,
            display: `block`,
            border: `1px solid #707070`,
            borderRadius: `50%`,
            padding: `10px`,
            display: "block",
            marginLeft: "32%",
            height: "70px",
            backgroundImage: `url(${user.anhDaiDien})`,
            backgroundSize: "cover",
          }}
        >
          {" "}
        </div>
        <h4 style={{ textAlign: "center" }}>
          Xin chào
          <br />{" "}
          <span className="fw-7 fs-20" style={{ color: `#128DE2` }}>
          {user.hoVaTen}
          </span>
        </h4>
        <h4></h4>
      </div>

      <div
        class="card title"
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
          <span className="fs-20 fw-8">Tổng tiền tích luỹ</span>
        </div>

        <div></div>
      </div>

      <div style={{ marginLeft: 59}}>
          <Button
            style={{ backgroundColor: `#128DE2`, color: `white`, margin:'20px 0', fontSize: '10 px', fontWeight: '600' }}
            variant="outlined"
          >
            Tất cả
          </Button>

          <Button
            style={{ color: `#128DE2`, margin:'20px 10px', fontSize: '10px', fontWeight: '600' }}
            variant="outlined"
          >
            Chờ xác nhận
          </Button>

          <Button
            style={{ color: `#128DE2`, margin:'20px 10px', fontSize: '10px', fontWeight: '600' }}
            variant="outlined"
          >
            Đã xác nhận
          </Button>


          <Button
            style={{ color: `#128DE2`, margin:'20px 10px', fontSize: '10px', fontWeight: '600' }}
            variant="outlined"
          >
            Đang vận chuyển
          </Button>


          <Button
            style={{ color: `#128DE2`, margin:'20px 10px', fontSize: '10px', fontWeight: '600' }}
            variant="outlined"
          >
            Đã giao hàng
          </Button>


          <Button
            style={{ color: `#128DE2`, margin:'20px 10px', fontSize: '10px', fontWeight: '600' }}
            variant="outlined"
          >
            Đã hủy
          </Button>
          
          
      </div>

      <RangePicker style={{ marginBottom: '10px', position: 'relative', right: '-505px', backgroundColor: 'transparentaceholder' }}/>
      {
        listBill.map((bill, index) => (
          <>
          <div class="card">
          <div class="title">
            <h4>
              {" "}
              <span className="fw-6">Đơn hàng</span>: {bill.ma}
            </h4>
            <h4>
              {" "}
              <span className="fw-6" style={{ color: `green` }}>
                {bill.trangThai === 'PENDING_CONFIRM' ? 'Chờ xác nhận' : 'Đang giao hàng'}
              </span>
            </h4>
          </div>
  
          <Divider></Divider>
  
          <div class="title">
            <h4 class="title">
               <img
                    style={{ width: `20%` }}
                    src="https://cdn.tgdd.vn/Products/Images/522/281633/Redmi-Pad-Sliver-thumb-org-200x200.jpg"
                  />
                  <span className="fw-6" style={{ marginLeft: "-120px" }}></span>
                  {bill.orderItems[0].sanPhamChiTiet.sanPham.tenSanPham +
                  "(" + bill.orderItems[0].sanPhamChiTiet.ram.dungLuong + "GB +" + bill.orderItems[0].sanPhamChiTiet.rom.dungLuong + "GB" + ") "+
                  bill.orderItems[0].sanPhamChiTiet.mauSac.tenMauSac
                  } 
              
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
  );
};
export default Orders;
