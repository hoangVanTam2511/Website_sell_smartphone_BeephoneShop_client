import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import './style.css'

export default function App (props) {
  const [itemSelected, setItemSelected] = useState(0)
  const [items, setItems] = useState([])
  const [indexSelected, setIndexSelected] = useState(1000000)

  useEffect(() => {
    setItems(props.images)
    changeImageByColor(props.colorSelected)
  })
  const cssNoSelected = () => {
    return {
      width: '10%',
      height: '20%',
      borderRadius: '10px',
      marginRight: '10px',
      border: '1px solid #d1d5db',
      padding: '8px'
    }
  }

  const changeImageByColor = data => {
    if (indexSelected === 1000000) {
      items.forEach((element, index) => {
        if (element.tenMauSac === data) {
          setItemSelected(index)
          setIndexSelected(index)
        }
      })
    } else if (props.colorSelected !== items[indexSelected].tenMauSac) {
      items.forEach((element, index) => {
        if (element.tenMauSac === data) {
          setItemSelected(index)
          setIndexSelected(index)
        }
      })
    }
  }

  const handleChangeSlide = data => {
    if (data === 'left') {
      var value = itemSelected - 1
      if (value < 0) {
        setItemSelected(items.length - 1)
      } else {
        setItemSelected(value)
      }
    } else {
      var value = itemSelected + 1
      if (value > items.length - 1) {
        setItemSelected(0)
      } else {
        setItemSelected(value)
      }
    }
  }

  const cssSelected = () => {
    return {
      width: '10%',
      height: '20%',
      borderRadius: '10px',
      marginRight: '10px',
      border: '1px solid rgb(18, 141, 226)',
      padding: '8px'
    }
  }

  return (
    <div>
      {items.length === 0 ? (
        <>
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24
                }}
                spin
              />
            }
          />
        </>
      ) : (
        <>
          <div
            id='toRight'
            style={{
              backgroundImage: `url(${items[itemSelected].url})`,
              width: '95%',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              height: '347px',
              backgroundRepeat: `no-repeat`,
              backgroundPosition: 'center',
              backgroundSize: '40%'
            }}
          >
            <i
              class='fa fa-angle-left arrow arrow-left'
              onClick={() => handleChangeSlide('left')}
            ></i>

            <i
              class='fa fa-angle-right arrow arrow-right'
              onClick={() => handleChangeSlide('right')}
            ></i>
          </div>
          {
            items.length > 3 ? (
              <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
                position: 'relative',
                left: '2%'
              }}
            >
              {items.map((item, index) => (
                <img
                  src={item.url}
                  alt=''
                  onClick={() => setItemSelected(index)}
                  style={index === itemSelected ? cssSelected() : cssNoSelected()}
                />
              ))}
            </div>
            ):(
              <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
                position: 'relative',
                left: '31%'
              }}
            >
              {items.map((item, index) => (
                <img
                  src={item.url}
                  alt=''
                  onClick={() => setItemSelected(index)}
                  style={index === itemSelected ? cssSelected() : cssNoSelected()}
                />
              ))}
            </div>
            )
          }
        
        </>
      )}
    </div>
  )
}
