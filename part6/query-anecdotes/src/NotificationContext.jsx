import { createContext,useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'setNotificationValue':
      return action.payload
    case 'clearNotification':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification,notificationDispatch] = useReducer(notificationReducer,'')

  return (
    <NotificationContext.Provider value={{ notification , notificationDispatch}}>
     {props.children}
    </NotificationContext.Provider>
  )
}

const NotificationContext = createContext()

export default NotificationContext