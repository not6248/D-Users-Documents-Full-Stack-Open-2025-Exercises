const Blog = require('../models/blog')

const initialBlogs = [
  {
  "title": "hello world",
  "author": "is me",
  "url": "www.example.com",
  "likes": 0
}
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}