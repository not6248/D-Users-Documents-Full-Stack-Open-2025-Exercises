const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = response.body

  blogs.forEach((blog) => {
    assert.notStrictEqual(blog.id, undefined)
    assert.strictEqual(blog._id, undefined)
  })
})

test('creates a new blog post', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new_blog',
    url: 'www.new_blog.com',
    likes: 10
  }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length,helper.initialBlogs.length + 1)

    const content = blogsAtEnd.map(b => b.title)
    assert(content.includes('new blog'))
})

test('the likes property is missing from the request', async () => {
  const newBlog = {
    title: 'likes missing',
    author: 'likes_missing',
    url: 'www.likes_missing.com'
  }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length,helper.initialBlogs.length + 1)

    const noteToCreate = blogsAtEnd[blogsAtEnd.length - 1]

    assert.strictEqual(noteToCreate.likes, 0)
})

test('responds 400 Bad Request if the title or url properties are missing', async () => {
  const newBlog = {
    author: '400'
  }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    
    assert.strictEqual(blogsAtEnd.length,helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
