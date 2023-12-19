import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request, setAuthHeader } from '../helpers/axios_helper'
import {  getUser } from '../store/userSlice'

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
        // setUserNoToken()
        if(res.response.status === 400) {
          // navigate("/403-not-found")
        }
      })
  }else if(data === 0) {
    await request("DELETE",`/client/cart-detail/delete-all-cart?id_customer=${user.id}`
    )
    .then(res => {
      if (res.status === 200) {
        quantity = res.data
        return quantity;
      }
    })
    .catch(res => {
      // setUserNoToken()
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

export const setSelectedCartDetail = (data) => {
  var user = getUser();
  if(user.id === '') {
    window.localStorage.setItem('selectedCartNoLogin', JSON.stringify(data));
  }else{
    console.log(data)
    window.localStorage.setItem('selectedCartLogin', JSON.stringify(data));
  }
};

export const getSelectedCartDetail = () => {
  var user = getUser();
  if(user.id === '') {
    var productDetail = window.localStorage.getItem('selectedCartNoLogin');
    return JSON.parse(productDetail)
  }else{
    var productDetail = window.localStorage.getItem('selectedCartLogin')
    return JSON.parse(productDetail)
  }
};

export const changeSelectedProductDetail = (item) => {
  var user = getUser();

  console.log(item)
  var totalCart = 0
    if(user.id === ""){
      item.map(e => {
        totalCart +=
          Number(
            e?.data.priceDiscount === 0 ? e?.data.price : e?.data.priceDiscount
          ) * Number(e?.quantity)
      })
    }else{
      item.map(e => {
        totalCart +=
          Number(
            e?.donGiaSauKhuyenMai === 0 ? e?.donGia : e?.donGiaSauKhuyenMai
          ) * Number(e.soLuongSapMua)
      })
    }
  
  window.localStorage.setItem('selectedProductDetail', JSON.stringify(item));
  window.localStorage.setItem('totalPriceSelected', totalCart);

  console.log(item)
  console.log(totalCart)
}

export const getSelectedProductDetails = () => {
  var productDetails = window.localStorage.getItem('selectedProductDetail')
  return JSON.parse(productDetails)
}

export const getTotalProductDetails = () => {
  var totalPriceSelected = window.localStorage.getItem('totalPriceSelected')
  return totalPriceSelected
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    quantity: 0,
    note: "",
    selectedCart:0,
    carts: "",
    newProductAddToCart: "",
    selectedProductDetails: "",
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
