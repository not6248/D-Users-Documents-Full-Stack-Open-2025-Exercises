import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationValue: (state,action) => action.payload,
    clearNotification: () => '',
  },
    
})

const { setNotificationValue , clearNotification} = notificationSlice.actions

export const setNotification = (content,timeOutSec = 0) => {
  return async (dispatch) => {
    dispatch(setNotificationValue(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeOutSec * 1000)
  }
}

export default notificationSlice.reducer
