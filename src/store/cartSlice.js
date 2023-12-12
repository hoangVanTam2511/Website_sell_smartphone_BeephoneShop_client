import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { request, setAuthHeader } from '../helpers/axios_helper'
import {  setUserNoToken } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'

export const addToCart = createAsyncThunk('cart/addToCart', async data => {
  let user = localStorage.getItem('user')
  // const navigate = useNavigate()
  user = JSON.parse(user)
  let quantity = 0
  // console.log("redux is number one")
  if (data !== 0) {
    await request("GET",`/client/cart-detail/count-of-cart-detail?id_customer=${user.id}`
      )
      .then(res => {
        if (res.status === 200) {
          quantity = res.data
          return quantity;
        }
      })
      .catch(res => {
        setUserNoToken()
        if(res.response.status === 400) {
          // navigate("/403-not-found")
        }
      })
  }
  localStorage.setItem('quantity', quantity)
  return quantity
})

export const SetNote = createAsyncThunk('cart/SetNote', async data => {
  localStorage.setItem('note', data)
  return data
})

export const SetSelectedCart = createAsyncThunk('cart/SetSelectedCart', async data => {
  localStorage.setItem('selectedCart', data)
  return data
})

export const ResetSelectedCart = createAsyncThunk('cart/ResetSelectedCart', async () => {
  localStorage.setItem('selectedCart', 0)
  return 0
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    quantity: 0,
    note: "",
    selectedCart:0,
    carts: "",
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.quantity = action.payload
    })
    .addCase(SetNote.fulfilled, (state, action) => {
      state.note = action.payload
    })
    .addCase(SetSelectedCart.fulfilled, (state, action) => {
      state.selectedCart = action.payload
    })
    .addCase(ResetSelectedCart.fulfilled, (state, action) => {
      state.selectedCart = action.payload
    })
     }
})

export default cartSlice.reducer
