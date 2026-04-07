import { createSlice } from '@reduxjs/toolkit'

const userReducer = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser: () => null,
  },
})

export const { setUser, clearUser } = userReducer.actions
export default userReducer.reducer
