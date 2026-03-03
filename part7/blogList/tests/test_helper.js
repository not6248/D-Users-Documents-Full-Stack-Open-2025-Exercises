const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    "title": "hello world",
    "author": "is me",
    "url": "www.example.com",
    "likes": 0
  }
]

const initialUsers = async () => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash("12345", saltRounds)

  return [
    {
      "username":"admin12345",
      "name":"admin",
      "passwordHash" : passwordHash
    }
  ]
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,initialUsers, blogsInDb, usersInDb
}