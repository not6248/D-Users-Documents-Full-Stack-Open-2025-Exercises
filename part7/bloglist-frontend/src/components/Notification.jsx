const Notification = ({ message,isError }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = isError ? 'error' : 'add'

  return (
    <div className={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification