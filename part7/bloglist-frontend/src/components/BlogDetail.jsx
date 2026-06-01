import { useState } from 'react'
import { Link } from 'react-router'

const Blog = ({ user, blog, addLike, deleteBlog, addComment }) => {
  const [comment, setComment] = useState('')
  if (!blog) return

  const handleLike = (event) => {
    event.preventDefault()
    const updateBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    addLike(updateBlog)
  }

  const handleComment = (event) => {
    event.preventDefault()

    addComment(blog.id, {
      comments: comment,
    })

    setComment('')
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
        <div class="card bg-base-100 w-96 shadow-sm">
          <div class="card-body">
            <h2 class="card-title">
              {blog.title} {blog.author}
            </h2>
            <div>{blog.url}</div>
            <div>
              <form onSubmit={handleLike}>
                likes {blog.likes}{' '}
                <button type="submit" className="btn">
                  like
                </button>
              </form>
            </div>
            <div>added by {blog.user?.name}</div>
            {user.name === blog.user?.name && (
              <form onSubmit={handleRemove}>
                <button type="submit" className="btn btn-error">
                  remove
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3>comments</h3>
        <form onSubmit={handleComment}>
          <div class="join">
            <input
              type="text"
              className="join-item input"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button
              type="submit"
              className="btn join-item rounded-r-full h-auto"
            >
              add comment
            </button>
          </div>
        </form>
        <ul className="list bg-base-100 rounded-box shadow-md w-1/2">
          {blog.comments?.map((comment, index) => (
            <li key={index} className="list-row">
              <div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {comment}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog
