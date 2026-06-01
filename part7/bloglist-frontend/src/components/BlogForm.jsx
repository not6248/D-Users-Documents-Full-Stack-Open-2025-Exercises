import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title:
          <input
            className="input"
            placeholder="Type here"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            className="input"
            placeholder="Type here"
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            className="input"
            placeholder="Type here"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
      </div>
      <button className="btn btn-success" type="submit">
        create
      </button>
    </form>
  )
}

export default BlogForm
