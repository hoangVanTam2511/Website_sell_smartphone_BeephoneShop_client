import React from 'react'
import { Tabs, Card } from 'antd'
const App = () => {
  return (
    <>
      <div style={{ width: '80%', margin: `20px auto`, display: 'flex' }}>
        <div style={{ width: '20%' }}>
          Anh <span className='fw-8'>Hoàng Văn Tám</span>
        </div>
        <div style={{ width: '70%' }}>
          <span className='fw-5' style={{ fontSize: 20 }}>
            Đơn hàng đã mua
          </span>
          <span className='fw-3' style={{ marginLeft: 20, fontSize: 14 }}>
            Từ ngày 26/10/2023 - 26/10/2023
          </span>
        </div>
      </div>

      <div style={{ width: '80%', margin: `20px auto` }}>
        <Tabs
          defaultActiveKey='1'
          tabPosition={`left`}
          style={{
            height: 220
          }}
          items={new Array(2).fill(null).map((_, i) => {
            const id = String(i)
            return {
              label: `${
                id === '0' ? 'Đơn hàng đã mua' : 'Thông tin về sổ đia chỉ'
              }`,
              key: id,
              disabled: i === 4,
              children: `${
                id === '0' ? 
                  <>
                    <Card
                      title='hehe'
                      bordered={false}
                      style={{
                        width: 300
                      }}
                    >
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </>
                : (
                  'Thông tin về sổ đia chỉ'
                )
              }`
            }
          })}
        />
      </div>
    </>
  )
}
export default App
