import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, isError } = useSelector((state) => state.notification)

  if (message === null) {
    return null
  }

  const notificationStyle = isError ? 'error' : 'info'

  return message && <div className={notificationStyle}>{message}</div>
}

export default Notification
