import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import "./SearchOrderPage.css";
import { Divider, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InformationAddress from "./InformationAddress";
import { request, setAuthHeader } from "../../helpers/axios_helper";
import { getUser, setUserNoToken } from "../../store/userSlice";
import { SetSelectedCart } from "../../store/cartSlice";
import { ExclamationCircleFilled } from '@ant-design/icons'
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Modal } from 'antd'
import toast, { Toaster } from 'react-hot-toast'
import { changeInformationUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal
const Orders = () => {
  const host = "https://provinces.open-api.vn/api/";
  const user = getUser();
  const dispatch = useDispatch();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [changeAddress, setChangeAddress] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [diaChiList, setDiaChiList] = useState([]);
  const [value1, setValue1] = useState("Nam");
  const [addressSelected, setAddressSelected] = useState();
  const [viewPass, setViewPass] = useState(0)
  const navigate = useNavigate()
  // redux
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);

  // new pass
  const [newPass, setNewPass] = useState()
  const [newPassAgain, setNewPassAgain] = useState()

  const plainOptions = ["Nam", "Nữ"];
  const [account, setAccount] = useState();

  const getBillsByIdCustomer = async () => {
    let sum = 0;
    request("GET", `/client/bill/get-list-bills?id_customer=${user.id}`)
      .then((res) => {
        console.log(res.data);
        res.data.forEach((item) => {
          sum += item.tongTienSauKhiGiam;
        });
        setTotalAmount(sum);
      })
      .catch((error) => {
        setUserNoToken();
        console.log(error);
      });
  };

  useEffect(() => {
    callAPI("https://provinces.open-api.vn/api/?depth=2");
    dispatch(SetSelectedCart(1));
    getBillsByIdCustomer();
    getAllAddress();
    changeGender(user.gioiTinh);
    console.log(user)
    setAccount(user);
  }, []);

  useEffect(() => {
    // update address selected 
  }, [addressSelected])

  const getAllAddress = async () => {
    request("GET", `/client/address/get-all-address?id_account=${user.id}`)
      .then((res) => {
        console.log(res.data)
        if(  res.data.find(item => item.trangThai === 1) === undefined){
          setAddressSelected(res.data[0])
        }else{
          setAddressSelected(res.data.find(item =>  item.trangThai === 1))
        }

        setDiaChiList(res.data);
        // setTimeout(() => {
        //   setIsLoadingRequest(true);
        //   console.log(addressSelected)
        // }, 200);
      })
      .catch((error) => {
        console.log(error);
        setUserNoToken();
      });
  };

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US");
  };

  const formatMoney = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  const changeGender = (e) => {
    setViewPass(2)
    setValue1(e)
  };

  const changePositionUser = (e) => {
    setViewPass(2)
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const changePassword = () => {
    setViewPass(1)
  }
  
  const changeInforUser = async() => {

    confirm({
      title: 'Xác nhận thay đổi thông tin tài khoản',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn đồng ý với thông tin và xác nhận thay đổi thông tin tài khoản.',
      onOk () {
        request("PUT", "/client/account/change-infor", {
          id:account.id,
          name:account.hoVaTen,
          gender: value1,
          email: account.email,
          phoneNumber: account.soDienThoai
        }).then(
          (res) => {
            dispatch(changeInformationUser(res.data))
          }
        ).catch(error => console.log(error))

        setTimeout(()=>{
          toast.success("Bạn đã thay đổi thông tin tài khoản thành công!!!")
          setIsLoadingRequest(false)
        }, 300)
        
        setTimeout(()=>{
          setIsLoadingRequest(true)
          navigate("/")
        }, 500)

      },
      onCancel () {
        console.log("Bạn đã không thay đổi thông tin ... Bạn đúng là thiên tài cmnr")
      }
    })
  
  }

  const changePass = () => {
    
    //validate
    if(newPass !== newPassAgain){
      toast.error("Mật khẩu nhập lại không đúng.Vui lòng nhập lại mật khẩu")
      return;
    }

    confirm({
      title: 'Xác nhận thay đổi mật khẩu',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn đồng ý với thông tin và xác nhận thay đổi thông tin mật khẩu.',
      onOk () {
        setIsLoadingRequest(false)

        request("PUT", `/client/account/change-pass?pass=${newPass}&id=${account.id}`).then(
          (res) => {
           
          }
        ).catch()

        setTimeout(()=>{
          setViewPass(0)
          setIsLoadingRequest(true)
          toast.success("Bạn đã thay đổi mật khẩu thành công!!!")
        }, 300)
        
      },
      onCancel () {
        console.log("Bạn đã không thay đổi thông tin ... Bạn đúng là thiên tài cmnr")
      }
    })

  }

  const changeView = () => {
    setChangeAddress(1)
  }

  return (
    <>
      {isLoadingRequest === true ? (
        <> </>
      ) : (
        <div className="custom-spin" style={{ width: `66%`}}>
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 40, color: "#126de4", marginLeft: 5 }}
                spin
              />
            }
          />
        </div>
      )}

      {account === null || account === undefined || account === "" ? (
        <div className="custom-spin">
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 40, color: "#126de4", marginLeft: 5 }}
                spin
              />
            }
          />
        </div>
      ) : (
        <>
          {changeAddress === 1 ? (
            <div>
              <div class="card bg-white">
                <div class="title" style={{ marginLeft: "36%" }}>
                  <h4>
                    {" "}
                    <span className="fw-6 fs-18">Thông tin cá nhân</span>
                  </h4>
                  <h4></h4>
                </div>

                <Divider></Divider>

                <div style={{ marginTop: "35px" }}>
                  <div className="title">
                    <span>
                      {" "}
                      <TextField
                        style={{ width: "937px" }}
                        label="Họ và tên"
                        id="standard-basic"
                        variant="standard"
                        name="hoVaTen"
                        onChange={(e) => changePositionUser(e)}
                        value={account.hoVaTen}
                      />
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "35px" }}>
                  <div className="title">
                    <span>Giới tính:</span>
                    <div
                     style={{
                        width: `104px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginRight: '76%',
                        lineHeight: '28px',
                     }}
                    >
                      <span>
                        <input type='radio' value = "true" name="gender" onChange={(e) => changeGender(true)} checked={value1 === true? true: false} /> Nam
                      </span>

                      <span>
                        <input type='radio' value = "true" name="gender" onChange={(e) => changeGender(false)} checked={value1 === false? true: false} /> Nữ
                      </span>
                     
                    </div>
                    <br />
                  </div>
                  <Divider style={{ margin: "5px auto" }}></Divider>
                </div>

                <div style={{ marginTop: "35px" }}>
                  <div className="title">
                    <span>
                      {" "}
                      <TextField
                        style={{ width: "937px" }}
                        label="Số điện thoại"
                        id="standard-basic"
                        variant="standard"
                        value={account.soDienThoai}
                        name="soDienThoai"
                        onChange={(e) => changePositionUser(e)}
                      />
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "35px" }}>
                  <div className="title">
                    <span>
                      {" "}
                      <TextField
                        style={{ width: "937px" }}
                        label="Email"
                        id="standard-basic"
                        variant="standard"
                        name="email"
                        value={account.email}
                        onChange={(e) => changePositionUser(e)}
                      />
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "35px" }}>
                  <div className="title">
                    <span>
                      {
                    
                    addressSelected === undefined  ? 
                    <>
                     
                    </>
                    :
                    <>
                       Địa chỉ: {addressSelected.diaChi}, {addressSelected.xaPhuong}, {addressSelected.quanHuyen},{' '}
                      {addressSelected.tinhThanhPho}{' '} 
                    </>
                   }
                    </span>

                    <button
                      style={{
                        color: `white`,
                        marginLeft: "5px",
                      }}
                      onClick={() => setChangeAddress(2)}
                    >
                      {" "}
                      <i
                        class="fa-regular fa-pen-to-square"
                        style={{ fontSize: "22px", color: "#128DE2" }}
                      ></i>{" "}
                    </button>
                  </div>
                  <Divider style={{ margin: "5px auto" }}></Divider>
                </div>

                {
                  viewPass === 0 || viewPass === 2 ? 
                  <div style={{ marginTop: "35px", cursor: 'pointer' }}
                
                  onClick={() => changePassword()}
                >
                  <div className="title">
                    <span>Đổi mật khẩu </span>
                  </div>
                  <Divider style={{ margin: "5px auto" }}></Divider>
                </div>
                  :
                  <>
                    <div style={{ marginTop: "35px" }}>
                      <div className="title">
                        <span>
                          {" "}
                          <TextField
                            style={{ width: "937px" }}
                            label="Nhập mật khẩu mới"
                            id="standard-basic"
                            variant="standard"
                            name="newPass"
                            value={newPass}
                            type="password"
                            onChange={(e) =>{
                              setNewPass(e.target.value)
                            }}
                          />
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: "35px" }}>
                      <div className="title">
                        <span>
                          {" "}
                          <TextField
                            style={{ width: "937px" }}
                            label="Nhập lại mật khẩu"
                            id="standard-basic"
                            variant="standard"
                            name="newPassAgain"
                            type="password"
                            value={newPassAgain}
                            onChange={(e) => {
                              setNewPassAgain(e.target.value)
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  </>

                }
                <br />

                {
                  viewPass === 2 ?(
                    <Button
                    style={{
                      backgroundColor: `#128DE2`,
                      color: `white`,
                      marginTop: "5px",
                      width: `380px`,
                      fontSize: "15px",
                      marginLeft: "31%",
                      height: "45px",
                    }}
                    variant="outlined"
                    onClick={() => changeInforUser()}
                    startIcon={<i class="fa-regular fa-pen-to-square"></i>}
                  >
                    Cập nhật thông tin
                  </Button>
                  ): viewPass === 1 ? (
                    <Button
                    style={{
                      backgroundColor: `#128DE2`,
                      color: `white`,
                      marginTop: "5px",
                      width: `380px`,
                      fontSize: "15px",
                      marginLeft: "31%",
                      height: "45px",
                    }}
                    variant="outlined"
                    onClick={() => changePass()}
                    startIcon={<i class="fa-regular fa-pen-to-square"></i>}
                  >
                    Đổi mật khẩu
                    
                  </Button>
                  ):(
                    <></>
                  )
                }
              
              </div>
            </div>
          ) : (
            <InformationAddress
              changeView={changeView}
            />
          )}
        </>
      )}

       {/* toaster */}
       <Toaster
        position='top-center'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
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
              primary: 'green',
              secondary: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#4caf50'
            },
            style: {
              background: '#4caf50',
              color: 'white'
            }
          },

          error: {
            duration: 3000,
            theme: {
              primary: '#f44336',
              secondary: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#f44336'
            },
            style: {
              background: '#f44336',
              color: 'white'
            }
          }
        }}
      />
    </>
  );
};
export default Orders;
