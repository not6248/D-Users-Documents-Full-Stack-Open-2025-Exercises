import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import { useDispatch, useSelector } from 'react-redux'
import {
  setNotification,
  clearNotification,
} from './reducers/notificationReducer'
import {
  initializeBlog,
  appendBlog,
  likeOf,
  deleteBlogOf,
} from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlog())
  }, [dispatch])

  const blogs = [...useSelector((state) => state.blog)]
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const oggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(oggedUser))
      blogService.setToken(oggedUser.token)
    }
  }, [dispatch])

  const setErrorMessage = (message) => {
    dispatch(
      setNotification({
        message: message,
        isError: true,
      }),
    )
  }

  const setMessage = (message) => {
    dispatch(
      setNotification({
        message: message,
      }),
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (ex) {
      if (ex.response.data.error === 'invalid username or password') {
        setErrorMessage('wrong credentials')
      } else {
        setErrorMessage('has error')
      }

      setTimeout(() => {
        dispatch(clearNotification())
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
  }

  const addBlog = async (blogObject) => {
    try {
      dispatch(appendBlog(blogObject))
      blogFormRef.current.toggleVisibility()
      setMessage(`a new blog ${blogObject.title} added`)
      setTimeout(() => {
        dispatch(clearNotification())
      }, 3000)
    } catch {
      setErrorMessage('has error')

      setTimeout(() => {
        dispatch(clearNotification())
      }, 3000)
    }
  }

  const addLike = async (blogObject) => {
    try {
      dispatch(likeOf(blogObject.id))
    } catch {
      setErrorMessage('has error')

      setTimeout(() => {
        dispatch(clearNotification())
      }, 3000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      dispatch(deleteBlogOf(id))
    } catch {
      setErrorMessage('has error')

      setTimeout(() => {
        dispatch(clearNotification())
      }, 3000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                autoComplete="true"
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />

      <form onSubmit={handleLogout}>
        <p>
          {user.name} logged in
          <button type="submit">logout</button>
        </p>
      </form>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          addLike={addLike}
          deleteBlog={deleteBlog}
          user={user}
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}

export default App
