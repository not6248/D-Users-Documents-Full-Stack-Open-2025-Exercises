// import { useState } from 'react'
import { Link } from 'react-router'

const Blog = ({ blog }) => {
  return (
    <div className="blog card card-border bg-base-100 p-3">
      <div>
        <Link className="link link-info" to={`blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
    </div>
  )
}

export default Blog
