import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const loginUser = createAsyncThunk('user/login', async data => {
  let user = {
    id: '',
    ma: ''
  }
  await axios
    .post('http://localhost:8080/client/account/login', data)
    .then(res => {
      if (res.status === 200) {
        user = res.data
      }
    })
    .catch(error => console.log(error))
  localStorage.setItem('user', JSON.stringify(user))
  return user
})

export const checkUserAnonymous = createAsyncThunk(
  'user/checkUser',
  async () => {
    let user = null
    await axios
      .get('http://localhost:8080/client/account/create-account-anonymous')
      .then(res => {
        if (res.status === 200) {
          user = res.data
        }
      })
      .catch(error =>
        user = {
          id: '',
          ma: ''
        }
        )
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
