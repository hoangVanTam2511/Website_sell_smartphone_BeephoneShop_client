import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const AddItemNavbar = createAsyncThunk(
  'navbar/AddItemNavbar',
  async data => {
    localStorage.setItem('status', 1)
    var navbars = [
    ]
    navbars.push(data)
    localStorage.setItem('navbar', navbars)
    return data
  }
)

export const RemoveItemNavbar = createAsyncThunk(
  'navbar/RemoveItemNavbar',
  async data => {
    localStorage.setItem('status', 0)
    localStorage.setItem('navbar', data)
    return data
  }
)

export const ResetItemNavbar = createAsyncThunk(
  'navbar/ResetItemNavbar',
  async data => {
    localStorage.setItem('status', 0)
    localStorage.setItem('navbar', data)
    return data
  }
)

const navbarSlice = createSlice({
  name: 'navbar',
  initialState: {
    status: 0,
    flag: 0,
    navbar: [
    ]
  },
  extraReducers: builder => {
    builder
      .addCase(AddItemNavbar.fulfilled, (state, action) => {
        var navbars = [
        ]
        action.payload.forEach(e => {
           navbars.push(e)
        });
        state.status = 1
        state.flag = (Math.random() * 100000).toFixed(0)
        state.navbar = navbars
        console.log(navbars)
      })
      .addCase(RemoveItemNavbar.fulfilled, (state, action) => {
        state.status = 0
        var navbars = [
        ]
        navbars = navbars.filter(
          navbar => navbar.path !== action.payload.path
        )
        state.navbar = navbars
      })
      .addCase(ResetItemNavbar.fulfilled, (state, action) => {
        state.status = 0
        state.navbar = [
        ]
      })
  }
})

export default navbarSlice.reducer
