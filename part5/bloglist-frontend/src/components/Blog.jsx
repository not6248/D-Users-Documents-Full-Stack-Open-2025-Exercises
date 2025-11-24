import { useState } from 'react'

const Blog = ({ addLike, deleteBlog, user, blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = (event) => {
    event.preventDefault()
    const updateBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog?.user?.id,
    }
    addLike(updateBlog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    const isConfirm = confirm(`Remove blog ${blog.title} ${blog.author}`)
    if (isConfirm) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author} {''}
        <button style={hideWhenVisible} onClick={toggleVisibility}>
          view
        </button>
        <button style={showWhenVisible} onClick={toggleVisibility}>
          hide
        </button>
      </div>
      <div className='showWhenVisible' style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          <form onSubmit={handleLike}>
            likes {blog.likes} <button type='submit'>like</button>
          </form>
        </div>
        <div>{blog.user?.name}</div>
        {user.name === blog.user?.name && (
          <form onSubmit={handleRemove}>
            <button type='submit'>remove</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Blog
