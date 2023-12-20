import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import './SearchOrderPage.css'
import { Divider } from 'antd'
import { Select, Space, Input, Checkbox } from 'antd'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { getUser, setUserNoToken } from '../../store/userSlice'
import toast, { Toaster } from 'react-hot-toast'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
const { confirm } = Modal

const Orders = (props) => {
  const host = 'https://provinces.open-api.vn/api/'
  const user = getUser()
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [listOfAddress, setListOfAddress] = useState([])
  const [view, setView] = useState(0)

  const [provincesSelected, setProvinceSelected] = useState()
  const [districtSelected, setDistrictSelected] = useState()
  const [wardSelected, setWardSelected] = useState()
  const [addressSelected, setAddressSelected] = useState()


  useEffect(() => {
    callAPI('https://provinces.open-api.vn/api/?depth=2')
    getAllAddress()
  }, [listOfAddress.length])

  const getAllAddress = async () => {
    request("GET",`/client/address/get-all-address?id_account=${user.id}`
      )
      .then(res => {
        if (res.status === 200) {
          setListOfAddress(res.data)
          console.log(res.data)
        }
      })
      .catch(error => {
        setUserNoToken()
        console.log(error)})
  }

  var callAPI = api => {
    axios
      .get(api)
      .then(response => {
        const modifiedData = [{ value: '', label: 'Chọn Tỉnh/Thành phố' }]
        response.data.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name })
        })
        setProvinces(modifiedData)
        setDistricts([{ value: '', label: 'Chọn Quận/huyện' }])
        setWards([{ value: '', label: 'Chọn Phường/Xã' }])
      })
      .catch(error => console.log(error))
  }

  var callApiDistrict = api => {
    axios
      .get(api)
      .then(response => {
        const modifiedData = [{ value: '', label: 'Chọn Quận/huyện' }]
        response.data.districts.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name })
        })

        setDistricts(modifiedData)
      })
      .catch(error => console.log(error))
  }

  var callApiWard = api => {
    axios
      .get(api)
      .then(response => {
        const modifiedData = [{ value: '', label: 'Chọn Phường/Xã' }]
        response.data.wards.map((value, index) => {
          modifiedData.push({ value: value.code, label: value.name })
        })
        setWards(modifiedData)
      })
      .catch(error => console.log(error))
  }

  const handleChangeProvinces = value => {
    callApiDistrict(host + 'p/' + value + '?depth=2')
    console.log(value)
    provinces.forEach(e => {
      if(e.value === value) {
        setProvinceSelected(e.label)
      }
    })
  }

  const handleChangeDistricts = value => {
    callApiWard(host + 'd/' + value + '?depth=2')
    districts.forEach(e => {
      if(e.value === value) {
        setDistrictSelected(e.label)
      }
    })
  }

  const handleChangeWards = value => {
    wards.forEach(e => {
      if(e.value === value) {
        setWardSelected(e.label)
      }
    })
  }

  const onChange = e => {
    console.log(`checked = ${e.target.checked}`)
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US')
  }

  const addNewAddress = () => {
    setView(0)

    if(provincesSelected === undefined || districtSelected === undefined || wardSelected === undefined || addressSelected === undefined) {
      toast.error("Bạn phải nhập đầy đủ các thông tin");
      return;
    }
    
    confirm({
      title: 'Xác nhận thêm địa chỉ',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn đồng ý với thông tin và xác nhận thêm địa chỉ.',
      onOk () {
        let position = provincesSelected.search("Thành phố");
        let result = ''

        if(position !== -1){
          result = provincesSelected.slice(10)
        }else{
          position = provincesSelected.search("Tỉnh");
          result = provincesSelected.slice(5)
        }
        
        request("POST",`/client/address/add-new-address`,{
          id: user.id,
          province: result,
          district: districtSelected,
          ward: wardSelected,
          stress:addressSelected
      }).then(
        res => {
          getAllAddress()
        }
      )
      toast.success("Bạn đã thêm địa chỉ thành công!!!")
      },
      onCancel () {
        console.log("Bạn đã không thay đổi thông tin ... Bạn đúng là thiên tài cmnr")
      }
    })
  
  }

  const deleteAddress = (id) => {
    request("DELETE",`/client/address/delete-address?id=${id}`).then(
      res => {
        getAllAddress()
      }
    )

  }

  return (
    <>
      <div class='card bg-white'>
        <div 
        >
          <h4
            style={{
              display: 'inline-block',
              fontSize: 20
            }}
          >
            <i class='fa-solid fa-arrow-left'
              style={{ 
                width: `25%`, 
                cursor: `pointer`,
                zIndex: 44,
                position: 'relative',
        }}
         onClick={() => {
          props.changeView()
         }}
            ></i>
          </h4>

          <h4 style={{ display: 'inline-block', marginLeft: `36%`,
                        marginBottom: `2%`}}>
            {' '}
            <span className='fw-6 fs-20' style={{ textAlign: 'center'}}>Thông tin địa chỉ</span>
          </h4>
        </div>
        {listOfAddress.map((value, index) => (
          <div class='card' style={{ width: `100%`, marginBottom: 20 }}>
            <div class='title'>
              <h4>
                {' '}
                <span className='fw-6'>Địa chỉ {index + 1}</span>
                {value.trangThai === 1 ? (
                  <div
                    style={{
                      display: 'inline-block',
                      marginLeft: 10,
                      color: '#128DE2',
                      fontSize: 9,
                      padding: 4,
                      border: '1px solid #128DE2',
                      borderRadius: 5,
                      transform: `translateY(-4px)`
                    }}
                  >
                    Mặc định
                  </div>
                ) : (
                  <></>
                )}
              </h4>
              <h4>
                <div
                  style={{
                    display: 'inline-block',
                    marginLeft: 610,
                    color: '#128DE2',
                    fontSize: 17,
                    padding: 4
                  }}
                >
                  <i class='fa-solid fa-trash'
                   onClick={() => deleteAddress(value.id)}
                  ></i>
                </div>{' '}
              </h4>
            </div>

            <Divider style={{ margin: `10px auto` }} />

            <div>
              <Space wrap style={{ display: 'flex' }}>
                <div style={{ fontSize: 18 }}>
                  Địa chỉ: {value.diaChi}, {value.xaPhuong}, {value.quanHuyen},{' '}
                  {value.tinhThanhPho}{' '}
                  <div
                    style={{
                      display: 'inline-block'
                    }}
                    variant='outlined'
                  >
                    {' '}
                    {/* <i
                      style={{
                        backgroundColor: `#128DE2`,
                        color: `white`,
                        fontSize: '15px',
                        display: 'inline-block',
                        padding: '6px',
                        borderRadius: '5px'
                      }}
                      class='fa-regular fa-pen-to-square'
                    ></i>{' '} */}
                  </div>
                </div>
              </Space>
            </div>

            {value.trangThai === 1 ? (
              <></>
            ) : (
              // <Checkbox style={{ marginTop: `10px` }} onChange={onChange}>
              //   Đặt làm mặc định
              // </Checkbox>
              <>
              </>
            )}
          </div>
        ))}

        <br />
        {
          view === 1 ? <>
          
          <div class='card'  style={{ width: `100%`, marginBottom: 20 }}>
        <div class='title'>
          <h4>
            {' '}
            <span className='fw-6'>Địa chỉ nhận hàng</span>
          </h4>
          <h4></h4>
        </div>

        <Divider></Divider>

        <div>
          <Space wrap>
            <Select
              defaultValue=''
              style={{ width: `430px`, height: 40 }}
              onChange={handleChangeProvinces}
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={provinces}
              showSearch
            />

            <Select
              defaultValue=''
              style={{ width: `430px`, height: 40 }}
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              onChange={handleChangeDistricts}
              options={districts}
              showSearch
            />

            <Select
              defaultValue=''
              style={{ width: `430px`, height: 40 }}
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              onChange={handleChangeWards}
              options={wards}
              showSearch
            />

            <Input
              placeholder='Số nhà/Tên đường'
              style={{ width: `430px`, height: 40, borderRadius: 13 }}
              onChange={(e) => setAddressSelected(e.target.value)}
            />
          </Space>

          <br/>
          <br />
          <Button
          style={{
            backgroundColor: `#128DE2`,
            color: `white`,
            width: `380px`,
            fontSize: '15px',
            marginLeft: '250px'
          }}
          variant='outlined'
          startIcon={<i class='fa-solid fa-plus'></i>}
          onClick={
            () => addNewAddress()
          }
        >
          Thêm mới
        </Button>
        </div>
      </div>
      <br/>

          </> :
          <>
              <Button
          style={{
            backgroundColor: `#128DE2`,
            color: `white`,
            width: `380px`,
            fontSize: '15px',
            marginLeft: '250px'
          }}
          variant='outlined'
          startIcon={<i class='fa-solid fa-plus'></i>}
          onClick={() => setView(1)}
        >
          Thêm địa chỉ mới
        </Button>
          </>
        }

    
      </div>

      <br />
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
        }}/>
    
    </>
  )
}
export default Orders
