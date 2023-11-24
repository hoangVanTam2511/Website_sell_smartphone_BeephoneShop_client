import React, { useState } from 'react'
import './style.css'

export default function App () {
  const [itemSelected, setItemSelected] = useState(0)
  const [items, setItems] = useState([
    {
      url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-pro-2-usb-c_3_.png'
    },
    {
      url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/4/_/4_197.jpg'
    },
    {
      url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-pro-2-usb-c_4_.png'
    }
  ])

  const cssNoSelected = () => {
    return {
      width: '10%',
      height: '20%',
      borderRadius: '10px',
      marginRight: '10px',
      border: '1px solid #d1d5db'
    }
  }

  const demoAnimationsOne = {
    nextAnimation: 'cubeToLeft',
    prevAnimation: 'toRightEasing'
  }
  const demoAnimationsTwo = {
    nextAnimation: 'toLeftEasing',
    prevAnimation: 'cubeToRight'
  }
  const demoAnimationsThree = {
    nextAnimation: 'scaleDownFromRight',
    prevAnimation: 'scaleDownFromTop'
  }
  const demoAnimationsFour = {
    nextAnimation: 'toLeftEasing',
    prevAnimation: 'toRightEasing'
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
      border: '1px solid rgb(18, 141, 226)'
    }
  }

  return (
    <div>
      <div
        id='toRight'
        style={{
          backgroundImage: `url(${items[itemSelected].url})`,
          width: '95%',
          borderRadius: '10px',
          border: '1px solid #d1d5db',
          height: '347px',
          backgroundRepeat: `no-repeat`
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
    </div>
  )
}
