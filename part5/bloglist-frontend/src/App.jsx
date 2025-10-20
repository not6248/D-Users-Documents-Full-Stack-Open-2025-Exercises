import { useState, useEffect,useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (ex) {
      if (ex.response.data.error === 'invalid username or password') {
        setErrorMessage(`wrong username or password`)
      } else {
        setErrorMessage(`has error`)
      }

      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }

      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))

      setTitle('')
      setAuthor('')
      setUrl('')
      
      blogFormRef.current.toggleVisibility()
      setMessage(`a new blog ${returnedBlog.title} added`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch {
      setErrorMessage(`has error`)

      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} />
        <Notification message={errorMessage} isError={true} />

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type='text'
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <Notification message={errorMessage} isError={true} />

      <form onSubmit={handleLogout}>
        <p>
          {user.name} logged in
          <button type='submit'>logout</button>
        </p>
      </form>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm
          title = {title}
          author = {author}
          url = {url}
          handleTitleChange = {({ target }) => setTitle(target.value)}
          handleAuthorChange = {({ target }) => setAuthor(target.value)}
          handleUrlChange = {({ target }) => setUrl(target.value)}
          handleSubmit={addBlog}
        />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App