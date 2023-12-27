import React, { useState, useEffect } from "react";
import "../CartPage/CartPage.scss";
import Button from "@mui/material/Button";
import { Space, Input } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { changeInformationUser } from "../../store/userSlice";
import {
  SetNote,
  SetSelectedCart,
  getTotalProductDetails,
} from "../../store/cartSlice";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import toast, { Toaster } from "react-hot-toast";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector } from "react-redux";
import { ResetItemNavbar } from "../../store/navbarSlice";
import { request, setAuthHeader } from "../../helpers/axios_helper";
import { setUserNoToken } from "../../store/userSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const CartPage = (props) => {
  const host = "https://provinces.open-api.vn/api/";
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [account, setAccount] = useState();
  const [typeReceiveGift, setTypeReceiveGift] = useState(3);
  const [note, setNote] = useState();
  const dispatch = useDispatch();
  const [listOfAddress, setListOfAddress] = useState([]);
  const [addressSelected, setAddressSelected] = useState(1);

  // selected
  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtSelected, setDistrictSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");

  const [nameSelected, setNameSelected] = useState("");
  const [phoneSelected, setPhoneSelected] = useState("");
  const [emailSelected, setEmailSelected] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [shipFee, setShipFee] = useState(0);
  const [receivedDate, setReceivedDate] = useState("");
  const totalAmountRedux = getTotalProductDetails();

  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  // redux
  const selectedCart = useSelector((state) => state.cart.selectedCart);

  useEffect(() => {
    dispatch(ResetItemNavbar());
    setNameSelected(props.informationBill?.name);
    setPhoneSelected(props.informationBill?.phone);
    setEmailSelected(props.informationBill?.email);
    setNote(props.informationBill?.note);
    setAddressInput(props.informationBill?.address);
    getAllProvinceGhn();
    if (account === undefined) {
      setAccount({
        ...props.account,
      });
      setNameSelected(props.account.hoVaTen);
      setPhoneSelected(props.account.soDienThoai);
      setEmailSelected(props.account.email);
      getAllAddress();
      if (selectedCart === 0) {
        dispatch(SetSelectedCart(1));
      }
    }
  }, []);

  // ghn
  const tokenGhn = "62124d79-4ffa-11ee-b1d4-92b443b7a897";
  const shopID = 189389;
  const serviceID = 53320;
  const shopDistrictId = 1482;
  const shopWardCode = 11007;

  const formatMoney = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  // convert time
  const convertTimeToDate = (receiveDate) => {
    const date = new Date(receiveDate * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };

  const getAllProvinceGhnByAddressCustomer = async (data) => {
    axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        {
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setProvinces(response.data.data);
        setTimeout(() => {
          if (props.account.id !== "") {
            var provinceId = response.data.data.find(
              (e) => e.ProvinceName === data.tinhThanhPho
            );
            if (provinceId !== undefined) {
              setProvinceSelected(provinceId.ProvinceID);
              getAllDistrictGhnByIdProvinceByAddressCustomer(
                provinceId.ProvinceID,
                2,
                data
              );
            }
          }
        }, 100);
      })
      .catch((error) => {
        console.log(error);
        setUserNoToken();
      });
  };

  const getAllDistrictGhnByIdProvinceByAddressCustomer = async (
    provinceId,
    type,
    data
  ) => {
    await axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        {
          params: {
            province_id: provinceId,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setDistricts(response.data.data);
        if (type === 2) {
          setTimeout(() => {
            var district_id = response.data.data.find(
              (e) => e.DistrictName === data.quanHuyen
            );
            if (district_id !== undefined) {
              setDistrictSelected(district_id.DistrictID);
              getAllWardGhnByIdDistrictByAddressCustonmer(
                district_id.DistrictID,
                2,
                data
              );
              // setAddressInput(props.account.diaChi)
            }
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllWardGhnByIdDistrictByAddressCustonmer = async (
    districtId,
    type,
    data
  ) => {
    await axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
        {
          params: {
            district_id: districtId,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setWards(response.data.data);
        if (type === 2) {
          setTimeout(() => {
            var ward_id = response.data.data.find(
              (e) => e.WardName === data.xaPhuong
            );
            if (ward_id !== undefined) {
              setWardSelected(ward_id.WardCode);
              getShipFeeGhnWithAddressCustomer(
                ward_id.WardCode,
                ward_id.DistrictID
              );
              getReceiveDateWithAddress(ward_id.WardCode, ward_id.DistrictID);
            }
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
        setUserNoToken();
      });
  };

  const getAllProvinceGhn = async () => {
    axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        {
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setProvinces(response.data.data);
        if (props.informationBill.province !== "") {
          var provinceId = response.data.data.find(
            (e) => e.ProvinceName === props.informationBill.province
          );
          if (provinceId !== undefined) {
            setProvinceSelected(provinceId.ProvinceID);
            getAllDistrictGhnByIdProvince(provinceId.ProvinceID, 1);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllDistrictGhnByIdProvince = async (provinceId, type) => {
    await axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        {
          params: {
            province_id: provinceId,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setDistricts(response.data.data);
        if (props.informationBill.district !== "" && type === 1) {
          var district_id = response.data.data.find(
            (e) => e.DistrictName === props.informationBill.district
          );
          if (district_id !== undefined) {
            setDistrictSelected(district_id.DistrictID);
            getAllWardGhnByIdDistrict(district_id.DistrictID, 1);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllWardGhnByIdDistrict = async (districtId, type) => {
    await axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
        {
          params: {
            district_id: districtId,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setWards(response.data.data);
        if (props.informationBill.ward !== "" && type === 1) {
          var ward_id = response.data.data.find(
            (e) => e.WardName === props.informationBill.ward
          );
          if (ward_id !== undefined) {
            setWardSelected(ward_id.WardCode);
            setShipFee(props.informationBill.shipFee);
            setReceivedDate(props.informationBill.receivedDate);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeProvince = (event) => {
    const value = event.target.value;
    setProvinceSelected(value);
    getAllDistrictGhnByIdProvince(value, 0);
    setWardSelected("");
    setDistrictSelected("");
    if (props.account.id === "") {
      props.setTotalCount(totalAmountRedux);
    } else {
      props.setTotalCount(0);
    }
    setShipFee(0);
  };

  const handleChangeWard = (event) => {
    const value = event.target.value;
    setWardSelected(value);
    getShipFeeGhn(value);
    getReceiveDate(value);

    if (props.account.id === "") {
      props.setTotalCount(Number(totalAmountRedux) + Number(shipFee));
    } else {
      props.setTotalCount(shipFee);
    }
  };

  const handleChangeDistrict = (event) => {
    const value = event.target.value;
    setDistrictSelected(value);
    getAllWardGhnByIdDistrict(value, 0);
    setWardSelected("");
  };

  const handleChooseAddress = (value) => {
    setIsLoadingRequest(false);
    let newAddress = {
      ...props.account,
      diaChiList: value,
      diaChi: value.diaChi,
      tinhThanhPho: value.tinhThanhPho,
      quanHuyen: value.quanHuyen,
      xaPhuong: value.xaPhuong,
    };
    setAccount(newAddress);
    dispatch(changeInformationUser(newAddress));
    getAllProvinceGhnByAddressCustomer(newAddress);
    setAddressInput(value.diaChi);
    setTimeout(() => {
      setIsLoadingRequest(true);
      setAddressSelected(3);
      toast.success("Chọn địa chỉ thành công");
    }, 200);
  };

  const handleChooseAddressCustomer = (value) => {
    setIsLoadingRequest(false);
    let newAddress = {
      ...props.account,
      diaChiList: value,
      diaChi: value.diaChi,
      tinhThanhPho: value.tinhThanhPho,
      quanHuyen: value.quanHuyen,
      xaPhuong: value.xaPhuong,
    };
    setAccount(newAddress);
    dispatch(changeInformationUser(newAddress));
    getAllProvinceGhnByAddressCustomer(newAddress);
    setAddressInput(value.diaChi);
    setTimeout(() => {
      setIsLoadingRequest(true);
      setAddressSelected(3);
    }, 500);
  };

  const getAllAddress = async () => {
    request(
      "GET",
      `/client/address/get-all-address?id_account=${props.account.id}`
    )
      .then((res) => {
        if (res.status === 200) {
          setListOfAddress(res.data);
          setAccount({
            ...props.account,
            diaChiList: [],
          });
          if (res.data.length > 0) {
            if (res.data.find((e) => e.trangThai === 1) !== undefined) {
              handleChooseAddressCustomer(
                res.data.find((e) => e.trangThai === 1)
              );
            } else {
              handleChooseAddressCustomer(res.data[0]);
            }
          }
          if (res.data.length === 0) {
            setAddressSelected(1);
          } else {
            setAddressSelected(1);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setUserNoToken();
      });
  };

  const checkValidate = (data) => {
    var flag = 0;
    var vnf_regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      nameSelected === "" || nameSelected === undefined || nameSelected === null
        ? "fail"
        : "pass" === "fail"
    ) {
      flag++;
      toast.error("Quý khách vui lòng không được bỏ trống họ và tên");
      return;
    }
    if (nameSelected.trim() === "") {
      if (flag === 0) {
        toast.error("Quý khách vui lòng không được bỏ trống họ và tên");
        return;
      }
      flag++;
    }

    if (
      phoneSelected === null ||
      phoneSelected === "" ||
      phoneSelected === undefined
        ? "fail"
        : "pass" === "fail"
    ) {
      if (flag === 0) {
        toast.error("Quý khách vui này điền đầy đủ số điện thoại");
        return;
      }

      flag++;
    }
    if (phoneSelected.trim() === "") {
      if (flag === 0) {
        toast.error("Quý khách vui này điền đầy đủ số điện thoại");
        return;
      }

      flag++;
    }

    if (!vnf_regex.test(phoneSelected)) {
      if (flag === 0) {
        toast.error("Quý khách phải nhập đúng định dạng số điện thoại");
      }

      flag++;
    }

    if (emailSelected !== "" && emailSelected !== null) {
      if (!re.test(emailSelected)) {
        if (flag === 0) {
          toast.error(
            "Quý khách vui lòng nhập đúng định dạng email(abc@gmail.com)"
          );
        }

        flag++;
      }
    }

    if (account.diaChiList.length === 0) {
      if (
        provinceSelected === "" ||
        districtSelected === "" ||
        wardSelected === "" ||
        addressInput === ""
      ) {
        if (flag === 0) {
          toast.error(
            "Quý khách vui lòng này chọn thành phố, quận huyện, địa chỉ"
          );
        }

        flag++;
      }
    }

    if (flag === 0) {
      var data = {
        name: nameSelected,
        address: addressInput,
        phone: phoneSelected,
        email: emailSelected,
        note: note,
        ward: wards.find((item) => item.WardCode === wardSelected).WardName,
        district: districts.find((item) => item.DistrictID === districtSelected)
          .DistrictName,
        province: provinces.find((item) => item.ProvinceID === provinceSelected)
          .ProvinceName,
        shipFee: shipFee,
        receivedDate: receivedDate,
        wardSelected: wardSelected,
        districtSelected: districtSelected,
        provinesSelected: provinceSelected,
      };
      if (props.account.id === "") {
        props.setTotalCount(Number(totalAmountRedux) + Number(shipFee));
      } else {
        props.setTotalCount(shipFee);
      }
      props.changeValueInformationBill(data);
      props.stepCheckOutTwo(2);
    }
  };

  const getShipFeeGhn = (wardCode) => {
    axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
        {
          params: {
            from_district_id: shopDistrictId,
            from_ward_code: shopWardCode,
            service_id: serviceID,
            to_district_id: districtSelected,
            to_ward_code: wardCode,
            weight: 240,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setShipFee(response.data.data.total);
        if (props.account.id === "") {
          props.setTotalCount(totalAmountRedux + response.data.data.total);
        } else {
          props.setTotalCount(response.data.data.total);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getReceiveDate = (wardCode) => {
    axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,
        {
          params: {
            ShopID: shopID,
            service_id: serviceID,
            from_district_id: shopDistrictId,
            to_district_id: districtSelected,
            to_ward_code: wardCode,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        let getDate = response.data.data.leadtime;
        getDate = convertTimeToDate(getDate);
        setReceivedDate(getDate);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getShipFeeGhnWithAddressCustomer = (wardCode, districtId) => {
    axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
        {
          params: {
            from_district_id: shopDistrictId,
            from_ward_code: shopWardCode,
            service_id: serviceID,
            to_district_id: districtId,
            to_ward_code: wardCode,
            weight: 240,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setShipFee(response.data.data.total);
        if (props.account.id === "") {
          props.setTotalCount(totalAmountRedux + response.data.data.total);
        } else {
          props.setTotalCount(response.data.data.total);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getReceiveDateWithAddress = (wardCode, districtId) => {
    axios
      .get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,
        {
          params: {
            ShopID: shopID,
            service_id: serviceID,
            from_district_id: shopDistrictId,
            to_district_id: districtId,
            to_ward_code: wardCode,
          },
          headers: {
            token: tokenGhn,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        let getDate = response.data.data.leadtime;
        getDate = convertTimeToDate(getDate);
        setReceivedDate(getDate);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <div
          style={{
            color: `#212b36`,
            fontSize: `16px`,
            fontWeight: `500`,
            lineHeight: `18px`,
            marginBottom: `10px`,
            marginTop: `15px`,
            textTransform: `uppercase`,
          }}
        >
          THÔNG TIN KHÁCH HÀNG
        </div>

        <div
          className="cart bg-white"
          style={{
            padding: 20,
            backgroundcolor: `#fff!important`,
            border: `1px solid rgba(145,158,171,.239)`,
            borderRadius: `10px`,
            height: "185px",
          }}
        >
          <div style={{ display: `flex`, gap: `20px` }}>
            <div class="brise-input">
              <input
                onChange={(e) => {
                  setNameSelected(e.target.value);
                }}
                type="text"
                name="text"
                value={nameSelected}
                required
              />
              <label>HỌ VÀ TÊN</label>
              <span class="line"></span>
            </div>

            <div class="brise-input">
              <input
                onChange={(e) => {
                  setPhoneSelected(e.target.value);
                }}
                type="text"
                name="text"
                value={phoneSelected}
                required
              />
              <label>SỐ ĐIỆN THOẠI</label>
              <span class="line"></span>
            </div>
          </div>

          <div
            style={{
              borderRadius: `0`,
              height: `50px`,
              position: `relative`,
              width: `100%`,
              marginTop: "10px",
            }}
          >
            <div class="brise-input">
              <input
                onChange={(e) => {
                  setEmailSelected(e.target.value);
                }}
                type="text"
                name="text"
                value={emailSelected}
                required
              />
              <label>EMAIL</label>
              <span class="line"></span>
            </div>

            <span
              style={{
                color: `#919eab`,
                fontSize: `10.5px`,
                fontStyle: `italic`,
                fontWeight: `400`,
                letterSpacing: `0`,
                lineHeight: `9px`,
                textAlign: `left`,
              }}
            >
              (*) Hóa đơn VAT sẽ được gửi qua email này
            </span>
          </div>
        </div>

        <div
          style={{
            color: `#212b36`,
            fontSize: `16px`,
            fontWeight: `500`,
            lineHeight: `18px`,
            marginBottom: `10px`,
            marginTop: `15px`,
            textTransform: `uppercase`,
          }}
        >
          CHỌN ĐỊA CHỈ NHẬN HÀNG
        </div>

        <div style={{ marginLeft: 0, marginTop: "5px" }}>
          {/* <Radio.Group
              onChange={onChangeRadioGroupReceive}
              value={radioReceive}
            > */}
          {/* <Radio value={4} checked={typeReceiveGift === 4 ? true : false}>
                Nhận tại cửa hàng
              </Radio> */}
          {/* <Radio value={3}>Giao tận nơi</Radio>
            </Radio.Group> */}
        </div>

        {typeReceiveGift === 4 ? (
          <></>
        ) : (
          <>
            <div>
              <div
                class="cart bg-white"
                style={{
                  borderRadius: 10,
                  width: "100%",
                  padding: "20px",
                }}
              >
                {addressSelected === 1 ? (
                  <>
                    <div
                      style={{
                        display: `flex`,
                        gap: `15px`,
                        paddingBottom: `15px`,
                        width: `49%`,
                        marginTop: "5px",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: "100%", height: 50 }}
                      >
                        <InputLabel
                          className="label-select"
                          id="demo-simple-select-standard-label"
                        >
                          TỈNH/ THÀNH PHỐ
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={provinceSelected}
                          onChange={handleChangeProvince}
                          sx={{
                            height: `50`,
                          }}
                        >
                          {provinces.map((item, index) => {
                            return (
                              <MenuItem value={item.ProvinceID}>
                                {item.ProvinceName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: "100%", height: 50 }}
                      >
                        <InputLabel
                          className="label-select"
                          id="demo-simple-select-standard-label"
                        >
                          QUẬN/ HUYỆN
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={districtSelected}
                          onChange={handleChangeDistrict}
                          sx={{
                            height: `50`,
                          }}
                        >
                          {districts.map((item, index) => {
                            return (
                              <MenuItem value={item.DistrictID}>
                                {item.DistrictName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    <div
                      style={{
                        display: `flex`,
                        gap: `15px`,
                        paddingBottom: `15px`,
                        width: `49%`,
                        marginTop: "0px",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: "100%", height: 50 }}
                      >
                        <InputLabel
                          className="label-select"
                          id="demo-simple-select-standard-label"
                        >
                          PHƯỜNG/ XÃ
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={wardSelected}
                          onChange={handleChangeWard}
                          sx={{
                            height: `50`,
                          }}
                        >
                          {wards.map((item, index) => {
                            return (
                              <MenuItem value={item.WardCode}>
                                {item.WardName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      <div
                        class="brise-input"
                        style={{
                          minWidth: "100%",
                          height: 50,
                          marginTop: "-3px",
                        }}
                      >
                        <input
                          onChange={(e) => {
                            setAddressInput(e.target.value);
                          }}
                          type="text"
                          name="text"
                          value={addressInput}
                          required
                        />
                        <label>ĐỊA CHỈ </label>
                        <span class="line"></span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {listOfAddress &&
                  addressSelected === 2 &&
                  listOfAddress.map((value, index) => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          style={{ width: "2%" }}
                          type="radio"
                          id="html"
                          name="fav_language"
                          value={value}
                          checked={
                            account.diaChiList.id === value.id ? "checked" : ""
                          }
                          onClick={() => handleChooseAddress(value)}
                        ></input>
                        <div
                          style={{
                            marginTop: "10px",
                            width: "96%",
                            position: "relative",
                            top: "10px",
                          }}
                        >
                          <div class="title">
                            <div
                              style={{
                                color: `#212b36`,
                                display: `flex`,
                                flexWrap: `wrap`,
                                fontSize: `15px`,
                                fontWeight: `600`,
                                gap: `5px`,
                              }}
                            >
                              {" "}
                              <span className="fw-6">Địa chỉ {index + 1}</span>
                              {value.trangThai === 1 ? (
                                <div
                                  style={{
                                    backgroundColor: `rgb(18 141 226/20%)`,
                                    borderRadius: `6px`,
                                    color: `rgb(18 141 226)`,
                                    fontSize: `11px`,
                                    fontWeight: `500`,
                                    padding: `3px 8px`,
                                    textTransform: `uppercase`,
                                  }}
                                >
                                  Mặc định
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: `#637381`,
                                fontSize: `14px`,
                                marginBottom: `5px`,
                                marginTop: `5px`,
                              }}
                            >
                              {value.diaChi}, {value.xaPhuong},{" "}
                              {value.quanHuyen}, {value.tinhThanhPho} <br />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}

                {listOfAddress &&
                  addressSelected === 3 &&
                  listOfAddress.map((value, index) =>
                    account.diaChiList.id === value.id ? (
                      <>
                        <div class="title">
                          <h4>
                            {" "}
                            <span className="fw-6">Địa chỉ {index + 1}</span>
                            {value.trangThai === 1 ? (
                              <div
                                style={{
                                  display: "inline-block",
                                  marginLeft: 10,
                                  color: "#128DE2",
                                  fontSize: 9,
                                  padding: 4,
                                  border: "1px solid #128DE2",
                                  borderRadius: 5,
                                  transform: `translateY(-4px)`,
                                }}
                              >
                                Mặc định
                              </div>
                            ) : (
                              <></>
                            )}
                          </h4>
                          <h4> </h4>
                        </div>

                        <div>
                          <Space wrap style={{ display: "flex" }}>
                            <div
                              style={{
                                fontSize: 18,
                                color: "#637381",
                                fontSize: "14px",
                              }}
                            >
                              {value.diaChi}, {value.xaPhuong},{" "}
                              {value.quanHuyen}, {value.tinhThanhPho} <br />
                            </div>
                          </Space>
                        </div>
                      </>
                    ) : (
                      <></>
                    )
                  )}

                {listOfAddress &&
                listOfAddress.length > 0 &&
                addressSelected === 1 ? (
                  <div
                    style={{
                      textAlign: "right",
                      padding: `0px`,
                      fontSize: 14,
                      color: "#444",
                      marginLeft: -8,
                      width: "97%",
                      color: "rgb(18, 141, 226)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setAddressSelected(2);
                    }}
                  >
                    chọn từ Số địa chỉ{" "}
                    <ArrowForwardIosIcon style={{ fontSize: 11 }} />
                  </div>
                ) : (
                  <></>
                )}

                {listOfAddress &&
                listOfAddress.length > 0 &&
                addressSelected === 2 ? (
                  <>
                    <span
                      style={{
                        marginLeft: "25px",
                      }}
                    >
                      hoặc
                    </span>
                    <div
                      style={{
                        textAlign: "right",
                        padding: `10px`,
                        fontSize: 14,
                        color: "#444",
                        marginLeft: -13,
                        width: "22%",
                        color: "rgb(18, 141, 226)",
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                      onClick={() => {
                        setAddressSelected(1);
                      }}
                    >
                      nhập địa chỉ mới
                      <ArrowForwardIosIcon style={{ fontSize: 11 }} />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {listOfAddress &&
                listOfAddress.length > 0 &&
                addressSelected === 3 ? (
                  <>
                    {listOfAddress.length - 1 === 0 ? (
                      <></>
                    ) : (
                      <span
                        style={{
                          textAlign: "right",
                          padding: `10px`,
                          fontSize: 14,
                          color: "#444",
                          marginLeft: -8,
                          color: "rgb(18, 141, 226)",
                          cursor: "pointer",
                          display: "inline-block",
                          textDecoration: `underline`,
                        }}
                        onClick={() => {
                          setAddressSelected(2);
                        }}
                      >
                        chọn ({listOfAddress.length - 1}) địa chỉ khác
                      </span>
                    )}

                    <span>hoặc</span>
                    <span
                      style={{
                        textAlign: "right",
                        padding: `10px`,
                        fontSize: 14,
                        color: "#444",
                        marginLeft: -8,
                        width: "20%",
                        color: "rgb(18, 141, 226)",
                        cursor: "pointer",
                        display: "inline-block",
                        textDecoration: `underline`,
                      }}
                      onClick={() => {
                        setAddressSelected(1);
                      }}
                    >
                      nhập địa chỉ mới
                    </span>
                  </>
                ) : (
                  <></>
                )}

                <div class="brise-input">
                  <input
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                    type="text"
                    name="note"
                    value={note}
                  />
                  <label>GHI CHÚ</label>
                  <span class="line"></span>
                </div>

                {shipFee > 0 && receivedDate !== "" ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: 15,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(155 148 148)",
                          marginLeft: "-12px",
                          width: "106%",
                        }}
                      >
                        Đơn vị vận chuyển
                      </div>

                      <div style={{ style: "#707070", textAlign: "right" }}>
                        Giao hàng nhanh{" "}
                        <img
                          src="data:image/png;base64,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"
                          style={{ width: "13%", display: "inline-block" }}
                          className="ms-3"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: 15,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(155 148 148)",
                          marginLeft: "-12px",
                        }}
                      >
                        Phí vận chuyển
                      </div>

                      <div style={{ style: "#707070" }}>
                        {formatMoney(shipFee)}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: 15,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(155 148 148)",
                          marginLeft: "-12px",
                        }}
                      >
                        Thời gian nhận hàng dự kiến
                      </div>

                      <div style={{ style: "#707070" }}>{receivedDate}</div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* toaster */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          // className: '',
          // duration: 5000,
          // style: {
          //   background: '#4caf50',
          //   color: 'white'
          // },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#4caf50",
            },
            style: {
              background: "#4caf50",
              color: "white",
            },
          },

          error: {
            duration: 3000,
            theme: {
              primary: "#f44336",
              secondary: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#f44336",
            },
            style: {
              background: "#f44336",
              color: "white",
            },
          },
        }}
      />
      <br />
      <div
        className="countProductTemp"
        style={{ left: 391, width: 710, display: "block" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Tổng tiền tạm tính</span>
          <span style={{ fontWeight: "bold", color: "#128DE2" }}>
            {formatMoney(
              props.account.id === ""
                ? props.totalAmount < Number(totalAmountRedux) + Number(shipFee)
                  ? Number(totalAmountRedux) + Number(shipFee)
                  : props.totalAmount
                : props.totalAmount
            )}
          </span>
        </div>
        <Button
          variant="contained"
          style={{
            width: "100%",
            marginTop: 5,
            fontSize: 14,
          }}
          onClick={() => {
            checkValidate(2);
          }}
        >
          Tiếp tục
        </Button>
      </div>
    </>
  );
};

export default CartPage;
