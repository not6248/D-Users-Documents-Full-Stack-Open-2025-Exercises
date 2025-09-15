const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
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

  describe('viewing a specific blog', () => {
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
  })
  describe('addition of a new blog', () => {
    test('creates a new blog post', async () => {
      const newBlog = {
        title: 'new blog',
        author: 'new_blog',
        url: 'www.new_blog.com',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const content = blogsAtEnd.map((b) => b.title)
      assert(content.includes('new blog'))
    })

    test('the likes property is missing from the request', async () => {
      const newBlog = {
        title: 'likes missing',
        author: 'likes_missing',
        url: 'www.likes_missing.com',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const noteToCreate = blogsAtEnd[blogsAtEnd.length - 1]

      assert.strictEqual(noteToCreate.likes, 0)
    })

    test('responds 400 Bad Request if the title or url properties are missing', async () => {
      const newBlog = {
        author: '400',
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogAtStart = await helper.blogsInDb()
      const blogToDelete = blogAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const contents = blogsAtEnd.map((b) => b.title)
      assert(!contents.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('update of a blog', () => {
    test('update succeeds with status code 200', async () => {
      const blogAtStart = await helper.blogsInDb()
      const blogToEdit = blogAtStart[0]

      const editBlog = {
        title: 'update blog',
        author: 'update author',
        url: 'www.update.com',
        likes: 99,
      }

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(editBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const content = blogsAtEnd.map((b) => b.title)
      assert(content.includes('update blog'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
