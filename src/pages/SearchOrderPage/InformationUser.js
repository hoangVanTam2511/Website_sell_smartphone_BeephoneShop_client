import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import { Divider } from "antd";
import { Select, Space, Input, Checkbox } from "antd";
import axios from "axios";

const Orders = () => {
  const host = "https://provinces.open-api.vn/api/";

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    callAPI("https://provinces.open-api.vn/api/?depth=2");
    console.log(districts);
  }, []);

  var callAPI = (api) => {
    axios
      .get(api)
      .then((response) => {
        const modifiedData = [{ value: "", label: "Chọn Tỉnh/Thành phố" }];
        response.data.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name });
        });
        setProvinces(modifiedData);
        setDistricts([{ value: "", label: "Chọn Quận/huyện" }]);
        setWards([{ value: "", label: "Chọn Phường/Xã" }]);
      })
      .catch((error) => console.log(error));
  };

  var callApiDistrict = (api) => {
    axios
      .get(api)
      .then((response) => {
        const modifiedData = [{ value: "", label: "Chọn Quận/huyện" }];
        response.data.districts.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name });
        });

        setDistricts(modifiedData);
      })
      .catch((error) => console.log(error));
  };

  var callApiWard = (api) => {
    axios
      .get(api)
      .then((response) => {
        const modifiedData = [{ value: "", label: "Chọn Phường/Xã" }];
        response.data.wards.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name });
        });
        setWards(modifiedData);
      })
      .catch((error) => console.log(error));
  };

  const handleChangeProvinces = (value) => {
    callApiDistrict(host + "p/" + value + "?depth=2");
  };

  const handleChangeDistricts = (value) => {
    callApiWard(host + "d/" + value + "?depth=2");
  };

  const handleChangeWards = (value) => {
    console.log(value);
  };

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

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
            backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz0LTGso_7ubZRD1CZoDauy3NWC6RxMqVf_A&usqp=CAU)`,
            backgroundSize: "cover",
          }}
        >
          {" "}
        </div>
        <h4 style={{ textAlign: "center" }}>
          Xin chào
          <br />{" "}
          <span className="fw-7 fs-20" style={{ color: `#128DE2` }}>
            Hoàng Văn Tám
          </span>
        </h4>
        <h4></h4>
      </div>

      <div class="card">
        <div class="title">
          <h4>
            {" "}
            <span className="fw-6">Thông tin cá nhân</span>
          </h4>
          <h4></h4>
        </div>

        <Divider></Divider>
{/* 
        <div class="title">
          <h4>
            Anh Hoàng Văn Tám - 0326235071
            <Button
              style={{
                backgroundColor: `#128DE2`,
                color: `white`,
                marginLeft: "5px",
              }}
              variant="outlined"
              startIcon={<i class="fa-regular fa-pen-to-square"></i>}
            >
              Sửa
            </Button>
          </h4>
          <h4 className="fs-12"></h4>
        </div> */}

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Họ và tên: Hoàng Văn Tám </span>

            <button
              style={{
                // backgroundColor: `#128DE2`,
                color: `white`,
                marginLeft: "5px",
              }}
              // variant="outlined"
            > <i class="fa-regular fa-pen-to-square" style={{ fontSize: '22px', color:'#128DE2'}}></i> </button>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Giới tính: Nam </span>

            <button
              style={{
                // backgroundColor: `#128DE2`,
                color: `white`,
                marginLeft: "5px",
              }}
              // variant="outlined"
            > <i class="fa-regular fa-pen-to-square" style={{ fontSize: '22px', color:'#128DE2'}}></i> </button>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Số điện thoại: 0326235071 </span>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Sinh nhật: 0326235071 </span>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Ngày tham gia Smember: 15/10/2023 </span>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Tổng tiền đã mua sắm: 1.000.000 đ </span>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Địa chỉ: hh, Cầu Diễn, Hà Nội </span>

            <button
              style={{
                color: `white`,
                marginLeft: "5px",
              }}
            > <i class="fa-regular fa-pen-to-square" style={{ fontSize: '22px', color:'#128DE2'}}></i> </button>
          </div>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>

        <div style={{ marginTop: '35px'}}>
          <div className='title'>
            <span>Đổi mật khẩu </span>
          <Divider style={{ margin: '5px auto'}}></Divider>
        </div>
      
      </div>

      <br />

      <div class="card">
        <div class="title">
          <h4>
            {" "}
            <span className="fw-6">Địa chỉ nhận hàng</span>
          </h4>
          <h4></h4>
        </div>

        <Divider></Divider>

        <div>
          <Space wrap>
            <Select
              defaultValue=""
              style={{ width: `380px`, height: 40 }}
              onChange={handleChangeProvinces}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={provinces}
              showSearch
            />

            <Select
              defaultValue=""
              style={{ width: `380px`, height: 40 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              onChange={handleChangeDistricts}
              options={districts}
              showSearch
            />

            <Select
              defaultValue=""
              style={{ width: `380px`, height: 40 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              onChange={handleChangeWards}
              options={wards}
              showSearch
            />

            <Input
              placeholder="Số nhà/Tên đường"
              style={{ width: `380px`, height: 40, borderRadius: 13 }}
            />
          </Space>

          <br />
          <Checkbox style={{ margin: `10px` }} onChange={onChange}>
            Đặt làm mặc định
          </Checkbox>
          <br />
          <Button
            style={{
              backgroundColor: `#128DE2`,
              color: `white`,
              marginTop: "5px",
              width: `380px`,
              fontSize: "15px",
              marginLeft: "200px",
            }}
            variant="outlined"
            startIcon={<i class="fa-regular fa-pen-to-square"></i>}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </>
  );
};
export default Orders;
