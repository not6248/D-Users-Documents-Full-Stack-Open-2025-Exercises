import { Link } from 'react-router'

const Blog = ({ user, blog, addLike, deleteBlog }) => {
  if (!blog) return

  const handleLike = (event) => {
    event.preventDefault()
    const updateBlog = {
      ...blog,
      likes: blog.likes + 1,
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
    <div>
      <div>
        <h1>
          {blog.title} {blog.author}
        </h1>
      </div>
      <div>
        <div>{blog.url}</div>
        <div>
          <form onSubmit={handleLike}>
            likes {blog.likes} <button type="submit">like</button>
          </form>
        </div>
        <div>added by {blog.user?.name}</div>
        {user.name === blog.user?.name && (
          <form onSubmit={handleRemove}>
            <button type="submit">remove</button>
          </form>
        )}
      </div>
      <div>
        <h3>comments</h3>
        <ul>
          {blog.comments?.map((comment) => (
            <li>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog
