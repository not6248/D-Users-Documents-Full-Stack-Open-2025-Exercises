import { createContext, useReducer } from 'react'

const initialState = {
  message: null,
  isError: false,
}

const noficationReducer = (state, action) => {
  switch (action.type) {
    case 'setNotificationValue':
      return action.playload
    case 'clearNotification':
      return initialState
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    noficationReducer,
    initialState,
  )

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

const NotificationContext = createContext()

export default NotificationContext
