import { useState } from 'react'

const Blog = ({ addLike, blog }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} {''}
        <button style={hideWhenVisible} onClick={toggleVisibility}>
          view
        </button>
        <button style={showWhenVisible} onClick={toggleVisibility}>
          hide
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          <form onSubmit={handleLike}>
            likes {blog.likes}{' '}
            <button type='button' onClick={handleLike}>
              like
            </button>
          </form>
        </div>
        <div>{blog.user?.name}</div>
      </div>
    </div>
  )
}

export default Blog
