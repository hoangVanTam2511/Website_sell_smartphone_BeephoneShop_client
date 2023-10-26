import React, { useState } from 'react'
import './CartPage.scss'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import { Divider } from 'antd'
import Button from '@mui/material/Button'

const CartPage = () => {
  const [age, setAge] = React.useState('')

  const handleChange = event => {
    setAge(event.target.value)
  }

  const bull = (
    <Box
      component='span'
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  )

  return (
    <>
      <div style={{ width: '90%', margin: '0px auto' }}>
        <div>THÔNG TIN KHÁCH HÀNG</div>

        <div>
          <RadioGroup
            row
            aria-labelledby='demo-row-radio-buttons-group-label'
            name='row-radio-buttons-group'
          >
            <FormControlLabel value='male' control={<Radio />} label='Anh' />
            <FormControlLabel value='female' control={<Radio />} label='Chị' />
          </RadioGroup>
        </div>

        <div>
          <TextField
            id='outlined-basic'
            label='Họ và tên'
            variant='outlined'
            style={{ width: 230 }}
          />
          <TextField
            id='outlined-basic'
            label='Số điện thoại'
            variant='outlined'
            style={{ width: 230, marginLeft: 20, fontSize: 16 }}
          />
        </div>

        <div style={{ margin: '10px 0' }}>CHỌN CÁCH THỨC NHẬN HÀNG</div>
        <div>
          <RadioGroup
            row
            aria-labelledby='demo-row-radio-buttons-group-label'
            name='row-radio-buttons-group'
          >
            <FormControlLabel
              value='male'
              control={<Radio />}
              label='Giao tận nơi'
            />
            <FormControlLabel
              value='female'
              control={<Radio />}
              label='Nhận tại cửa hàng'
            />
          </RadioGroup>
        </div>

        <div>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant='h5' component='div'>
                Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu
                có)
              </Typography>

              <FormControl sx={{ m: 1, minWidth: 230 }}>
                <InputLabel id='select-city'>Chọn thành phố</InputLabel>
                <Select
                  labelId='select-city'
                  id='demo-simple-select-helper'
                  value={age}
                  label='Age'
                  onChange={handleChange}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 230 }}>
                <InputLabel id='select-city'>Chọn Quận/Huyện</InputLabel>
                <Select
                  labelId='select-city'
                  id='demo-simple-select-helper'
                  value={age}
                  label='Age'
                  onChange={handleChange}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 230 }}>
                <InputLabel id='select-city'>Chọn Phường/Xã</InputLabel>
                <Select
                  labelId='select-city'
                  id='demo-simple-select-helper'
                  value={age}
                  label='Age'
                  onChange={handleChange}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <TextField
                id='outlined-basic'
                label='Số nhà/Tên đường'
                variant='outlined'
                style={{
                  width: 230,
                  marginLeft: 10,
                  marginTop: 7,
                  minHeight: `1.4375em`,
                  fontSize: 16
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <TextField
            id='outlined-basic'
            label='Yêu cầu khác không bắt buộc'
            variant='outlined'
            style={{ width: '100%', margin: `20px 0px`, fontSize: 16 }}
          />
        </div>

        <div>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label='Gọi người khác nhận hàng (nếu có)'
            />
            <FormControlLabel
              required
              control={<Checkbox />}
              label='Hướng dẫn sử dụng, giải đáp thắc mắc sản phẩm'
            />
            <FormControlLabel
              required
              control={<Checkbox />}
              label='Xuất hóa đơn công ty'
            />
          </FormGroup>

          <Divider />

          <div style={{ marginTop:'-20px',marginBottom:'-20px'}}>
            <TextField
              id='outlined-basic'
              placeholder='Nhập mã giảm giá hoặc phiếu mua hàng'
              variant='outlined'
              style={{ width: '60%', margin: `20px 0px`, fontSize: 16 }}
            />
            <Button variant='contained' style={{ width: '20%', marginLeft:40, marginTop:22, fontSize: 16 }}>Áp dụng</Button>
          </div>

          <Divider />

        </div>
      </div>
      <br />
    </>
  )
}

export default CartPage
