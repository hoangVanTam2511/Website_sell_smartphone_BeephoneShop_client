import React, { useState, useEffect } from "react";
import "./CartPage.scss";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Select, Space, Input, Checkbox, Divider, Radio } from "antd";
import axios from "axios";

const CartPage = () => {
  const host = "https://provinces.open-api.vn/api/";
  const [age, setAge] = React.useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [radioReceive, setRadioReceive] = useState();
  const [radioVocative, setRadioVocative] = useState();

  useEffect(() => {
    callAPI("https://provinces.open-api.vn/api/?depth=2");
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

  const onChangeRadioGroupReceive = (e) => {
    setRadioReceive(e.target.value);
  };

  const onChangeRadioGroupVocative = (e) => {
    setRadioVocative(e.target.value);
  };

  return (
    <>
      <div style={{ width: "90%", margin: "0px auto" }}>
        <div>THÔNG TIN KHÁCH HÀNG</div>

        <div>
          <div style={{ margin: " 10px 0px" }}>
            <Radio.Group
              onChange={onChangeRadioGroupVocative}
              value={radioVocative}
            >
              <Radio value={1}>Anh</Radio>
              <Radio value={2}>Chị</Radio>
            </Radio.Group>
          </div>
        </div>

        <div>
          <Input
            id="outlined-basic"
            placeholder="Họ và tên"
            style={{ width: 259, height: 40 }}
          />
          <Input
            placeholder="Số điện thoại"
            style={{ width: 259, height: 40, marginLeft: 20 }}
          />
        </div>

        <div style={{ margin: "10px 0" }}>CHỌN CÁCH THỨC NHẬN HÀNG</div>
        <div style={{ marginLeft: 0 }}>
          <Radio.Group
            onChange={onChangeRadioGroupReceive}
            value={radioReceive}
          >
            <Radio value={3}>Giao tận nơi</Radio>
            <Radio value={4}>Nhận tại cửa hàng</Radio>
          </Radio.Group>
        </div>

        <div>
          <div class="card" style={{ width: `100%` }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu
                có)
              </Typography>
              <Space wrap style={{ marginTop: "10px" }}>
                <Select
                  defaultValue=""
                  style={{ width: `240px`, height: 40 }}
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
                  style={{ width: `240px`, height: 40 }}
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
                  style={{ width: `240px`, height: 40 }}
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
                  style={{ width: `240px`, height: 40, borderRadius: 13 }}
                />
              </Space>
            </CardContent>
          </div>
        </div>

        <div>
          <Input
            placeholder="Yêu cầu khác không bắt buộc"
            style={{ width: "100%", margin: `20px 0px`, fontSize: 16 }}
          />
        </div>

        <div>
          <div style={{ marginLeft: 9 }}>
            <Checkbox>Gọi người khác nhận hàng (nếu có)</Checkbox>
            <Checkbox>Hướng dẫn sử dụng, giải đáp thắc mắc sản phẩm</Checkbox>
            <Checkbox style={{ width: "500px" }}>Xuất hóa đơn công ty</Checkbox>
          </div>

          <Divider />

          <div style={{ marginTop: "-20px", marginBottom: "-20px" }}>
            <Input
              placeholder="Nhập mã giảm giá hoặc phiếu mua hàng"
              style={{
                width: "60%",
                margin: `0px 0px`,
                fontSize: 16,
                position: "relative",
                top: "12px",
                height: 40,
              }}
            />
            <Button
              variant="contained"
              style={{
                width: "20%",
                marginLeft: 40,
                marginTop: 22,
                fontSize: 16,
              }}
            >
              Áp dụng
            </Button>
          </div>

          <Divider />
        </div>
      </div>
      <br />
    </>
  );
};

export default CartPage;
