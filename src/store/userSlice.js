import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request, setAuthHeader, getAuthToken } from '../helpers/axios_helper'
import axios from 'axios'

export const loginUser = createAsyncThunk('user/login', async data => {
  let user = {
    id: '',
    ma: ''
  }
  request("POST",'/client/account/login', data)
    .then(res => {
      setAuthHeader(res.data.token);
      console.log(res.data)
      user = res.data
      localStorage.setItem('user', JSON.stringify(user))
      return user
    })
    .catch(error => {
      console.log(error)
      setAuthHeader(null);
      // setUserNoToken()
    })
  localStorage.setItem('user', JSON.stringify(user))
  return user
})

export const checkUserAnonymous = createAsyncThunk(
  'user/checkUser',
  async () => {
    let user = {
      id: '',
      ma: '',
      soDienThoai: '',
    }
    localStorage.setItem('user', JSON.stringify(user))
    return user
  }
)

export const changeInformationUser = createAsyncThunk(
  'user/changeInformationUser',
  async data => {
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }
)

export const getUser = () => {
  var token = getAuthToken();
  
  if(token === null){
    const user = {
      id: '',
      ma: '',
      soDienThoai: '',
    }
    return user;
  }else{
    var user = localStorage.getItem('user');
    return JSON.parse(user) 
  }
};

export const setUserNoToken = () => {
  // const user = {
  //   id: '',
  //   ma: '',
  //   soDienThoai: '',
  // }

  // // set user
  // setAuthHeader(null);
  // localStorage.setItem('user', JSON.stringify(user))
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      id: '',
      ma: ''
    },
    error: null
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = {
          id: '',
          ma: ''
        }
        state.error = action.error.message
      })
      .addCase(checkUserAnonymous.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(checkUserAnonymous.rejected, (state, action) => {
        state.user = {
          id: '',
          ma: ''
        }
        state.error = action.error.message
      })
      .addCase(changeInformationUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(changeInformationUser.rejected, (state, action) => {
        state.user = {
          id: '',
          ma: ''
        }
        state.error = action.error.message
      })
  }
})

export default userSlice.reducer
