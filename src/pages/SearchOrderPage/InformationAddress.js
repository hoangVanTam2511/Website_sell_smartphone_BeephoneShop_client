import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import './SearchOrderPage.css'
import { Divider } from 'antd'
import { Select, Space, Input, Checkbox } from 'antd'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Orders = () => {
  const host = 'https://provinces.open-api.vn/api/'
  const user = useSelector(state => state.user.user)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [listOfAddress, setListOfAddress] = useState([])

  useEffect(() => {
    callAPI('https://provinces.open-api.vn/api/?depth=2')
    getAllAddress()
  }, [])

  const getAllAddress = async () => {
    await axios
      .get(
        `http://localhost:8080/client/address/get-all-address?id_account=${user.id}`
      )
      .then(res => {
        if (res.status === 200) {
          setListOfAddress(res.data)
          console.log(res.data)
        }
      })
      .catch(error => console.log(error))
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
  }

  const handleChangeDistricts = value => {
    callApiWard(host + 'd/' + value + '?depth=2')
  }

  const handleChangeWards = value => {
    console.log(value)
  }

  const onChange = e => {
    console.log(`checked = ${e.target.checked}`)
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US')
  }

  return (
    <>
      <div class='card'>
        <div style={{ width: `25%`, margin: `10px auto` }}>
          <h4
            style={{
              display: 'inline-block',
              fontSize: 20
            }}
          >
            <i style={{ marginLeft: -280 }} class='fa-solid fa-arrow-left'></i>
          </h4>

          <h4 style={{ display: 'inline-block' }}>
            {' '}
            <span className='fw-6 fs-20'>Thông tin địa chỉ</span>
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
                  <i class='fa-solid fa-trash'></i>
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
                    <i
                      style={{
                        backgroundColor: `#128DE2`,
                        color: `white`,
                        fontSize: '15px',
                        display: 'inline-block',
                        padding: '6px',
                        borderRadius: '5px'
                      }}
                      class='fa-regular fa-pen-to-square'
                    ></i>{' '}
                  </div>
                </div>
              </Space>
            </div>

            {value.trangThai === 1 ? (
              <></>
            ) : (
              <Checkbox style={{ marginTop: `10px` }} onChange={onChange}>
                Đặt làm mặc định
              </Checkbox>
            )}
          </div>
        ))}

        <br />

        <Button
          style={{
            backgroundColor: `#128DE2`,
            color: `white`,
            width: `380px`,
            fontSize: '15px',
            marginLeft: '225px'
          }}
          variant='outlined'
          startIcon={<i class='fa-solid fa-plus'></i>}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      <br />

      <div class='card'>
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
              style={{ width: `380px`, height: 40 }}
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
              style={{ width: `380px`, height: 40 }}
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
              style={{ width: `380px`, height: 40 }}
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
              marginTop: '5px',
              width: `380px`,
              fontSize: '15px',
              marginLeft: '200px'
            }}
            variant='outlined'
            startIcon={<i class='fa-regular fa-pen-to-square'></i>}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </>
  )
}
export default Orders
