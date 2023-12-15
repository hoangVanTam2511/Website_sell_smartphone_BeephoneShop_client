import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// add item
export const addProductToCart = createAsyncThunk(
  'cartDetail/addProductToCart',
  async data => {
    localStorage.setItem('products', data)
    return data
  }
)

export const removeProductToCart = createAsyncThunk(
  'cartDetail/removeProductToCart',
  async data => {
    localStorage.setItem('products', data)
    return data
  }
)

export const deleteProduct = createAsyncThunk(
  'cartDetail/deleteProduct',
  async data => {
    localStorage.setItem('products', data)
    return data
  }
)

export const resetAllCartDetail = createAsyncThunk(
  'cartDetail/resetAllCartDetail',
  async () => {
    return null;
  }
)

const cartDetailSlice = createSlice({
  name: 'cartDetail',
  initialState: {
    products: [],
    quantity: 0,
    totalAmount: ''
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addProductToCart.fulfilled, (state, action) => {
      var indexOfItem = -1
      var listOfConfigProducts = [...state.products]
      listOfConfigProducts.forEach((e, index) => {
        if (e.data.id === action.payload.id) {
          indexOfItem = index
        }
      })
      
      if (indexOfItem === -1) {
        listOfConfigProducts.push({
          data: action.payload,
          quantity: 1
        })


        state.products = listOfConfigProducts
      } else {
        state.products = listOfConfigProducts.fill(
          {
            data: action.payload,
            quantity: state.products[indexOfItem].quantity + 1
          },
          indexOfItem,
          indexOfItem + 1
        )
      }

      // calculate count of cart and totalPrice
      var totalPrice = 0;
      var countOfProduct = 0
      listOfConfigProducts.forEach(e => {
        countOfProduct += Number(e.quantity)
        totalPrice += (Number(e.data.priceDiscount) === 0 ? Number(e.data.price) : Number(e.data.priceDiscount)) * Number(e.quantity)
      })

      state.quantity = countOfProduct
      state.totalAmount = totalPrice
    })
    .addCase(removeProductToCart.fulfilled, (state, action) => {
      var listOfConfigProducts = [...state.products]
      
      var indexOfItem = -1
      var listOfConfigProducts = [...state.products]
      listOfConfigProducts.forEach((e, index) => {
        if (e.data.id === action.payload.id) {
          indexOfItem = index
        }
      })

      if(indexOfItem === -1){
        console.log("Không tìm thấy sản phẩm")
      }else if((listOfConfigProducts[indexOfItem].quantity) === 1){
        state.products = listOfConfigProducts.splice(indexOfItem, 1)
        state.products = listOfConfigProducts
      }else{
        state.products = listOfConfigProducts.fill(
          {
            data: action.payload,
            quantity: state.products[indexOfItem].quantity - 1
          },
          indexOfItem,
          indexOfItem + 1
        )
      }

      // calculate count of cart and totalPrice
      var totalPrice = 0;
      var countOfProduct = 0
      listOfConfigProducts.forEach(e => {
        countOfProduct += Number(e.quantity)
        totalPrice += (Number(e.data.priceDiscount) === 0 ? Number(e.data.price) : Number(e.data.priceDiscount)) * Number(e.quantity)
      })

      state.quantity = countOfProduct
      state.totalAmount = totalPrice
    })
    .addCase(resetAllCartDetail.fulfilled, (state, action) => {
      state.products = []
      state.quantity = 0
      state.totalAmount = 0
    })
    .addCase(deleteProduct.fulfilled, (state, action) => {
      var indexOfItem = -1
      var listOfConfigProducts = [...state.products]
      listOfConfigProducts.forEach((e, index) => {
        if (e.data.id === action.payload.id) {
          indexOfItem = index
        }
      })

      if(indexOfItem !== -1){
        state.products = listOfConfigProducts.splice(indexOfItem, 1)
        state.products = listOfConfigProducts
      }

      // calculate count of cart and totalPrice
      var totalPrice = 0;
      var countOfProduct = 0
      listOfConfigProducts.forEach(e => {
        countOfProduct += Number(e.quantity)
        totalPrice += (Number(e.data.priceDiscount) === 0 ? Number(e.data.price) : Number(e.data.priceDiscount)) * Number(e.quantity)
      })

      state.quantity = countOfProduct
      state.totalAmount = totalPrice
    })


  }
})

export default cartDetailSlice.reducer
