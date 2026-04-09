import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const { notification: { message, isError } = {} } =
    useContext(NotificationContext)

  if (message === null) {
    return null
  }

  const notificationStyle = isError ? 'error' : 'add'

  return <div className={notificationStyle}>{message}</div>
}

export default Notification
