import { useState, useEffect, useRef, useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import NotificationContext from './NotificationContext'
import UserContext from './UserContext'

const App = () => {
  const { notificationDispatch } = useContext(NotificationContext)
  const { user, userDispatch } = useContext(UserContext)

  const queryClient = useQueryClient()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'setUserValue',
        playload: user,
      })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({
        type: 'setUserValue',
        playload: user,
      })
      setUsername('')
      setPassword('')
    } catch (ex) {
      if (ex.response.data.error === 'invalid username or password') {
        notificationDispatch({
          type: 'setNotificationValue',
          playload: {
            message: `wrong credentials`,
            isError: true,
          },
        })
      } else {
        notificationDispatch({
          type: 'setNotificationValue',
          playload: {
            message: `has error`,
            isError: true,
          },
        })
      }

      setTimeout(() => {
        notificationDispatch({ type: 'clearNotification' })
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
  }

  const getAllBlog = async () => {
    const blogs = await blogService.getAll()
    return [...blogs].sort((a, b) => b.likes - a.likes)
  }

  const createBlog = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))

      notificationDispatch({
        type: 'setNotificationValue',
        playload: {
          message: `a new blog ${newBlog.title} added`,
          isError: false,
        },
      })
      setTimeout(() => {
        notificationDispatch({ type: 'clearNotification' })
      }, 3000)
      blogFormRef.current.toggleVisibility()
    },
  })

  const addBlog = async (blogObject) => {
    try {
      createBlog.mutate(blogObject)
    } catch {
      notificationDispatch({
        type: 'setNotificationValue',
        playload: {
          message: `has error`,
          isError: true,
        },
      })
      setTimeout(() => {
        notificationDispatch({ type: 'clearNotification' })
      }, 3000)
    }
  }

  const updateBlog = useMutation({
    mutationFn: blogService.update,
    onSuccess: (returnedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlog = blogs
        .map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
        .sort((a, b) => b.likes - a.likes)
      queryClient.setQueryData(['blogs'], updatedBlog)
    },
  })

  const deleteBlog = useMutation({
    mutationFn: blogService.deleteData,
    onSuccess: (_, deletedId) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlog = blogs.filter((blog) => blog.id !== deletedId)
      queryClient.setQueryData(['blogs'], updatedBlog)
    },
  })

  const handleLike = async (blogObject) => {
    try {
      updateBlog.mutate(blogObject)
    } catch {
      notificationDispatch({
        type: 'setNotificationValue',
        playload: {
          message: `has error`,
          isError: true,
        },
      })
      setTimeout(() => {
        notificationDispatch({ type: 'clearNotification' })
      }, 3000)
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      deleteBlog.mutate(id)
    } catch {
      notificationDispatch({
        type: 'setNotificationValue',
        playload: {
          message: `has error`,
          isError: true,
        },
      })
      setTimeout(() => {
        notificationDispatch({ type: 'clearNotification' })
      }, 3000)
    }
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getAllBlog,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const blogs = result.data

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
      {blogs?.map((blog) => (
        <Blog
          addLike={handleLike}
          deleteBlog={handleDeleteBlog}
          user={user}
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}

export default App
