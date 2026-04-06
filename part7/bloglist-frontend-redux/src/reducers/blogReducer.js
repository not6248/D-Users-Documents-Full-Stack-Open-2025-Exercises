import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import Blog from '../components/Blog'

const initialState = []

const blogReducer = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlog: (state, action) => action.payload,
    createBlog: (state, action) => {
      state.push(action.payload)
    },
    replaceOf: (state, action) => {
      const id = action.payload.id
      const changedBlog = action.payload
      return state.map((blog) => (blog.id !== id ? blog : changedBlog))
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

const { setBlog, createBlog, replaceOf, deleteBlog } = blogReducer.actions

export const initializeBlog = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const appendBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    dispatch(createBlog(newBlog))
  }
}

export const likeOf = (content) => {
  return async (dispatch) => {
    const id = content
    const blogs = await blogService.getAll()

    const blogToChange = blogs.find((n) => n.id === id)

    const changedBlogs = {
      ...blogToChange,
      likes: blogToChange.likes + 1,
    }

    const updatedBlog = await blogService.update(changedBlogs)
    dispatch(replaceOf(updatedBlog))
  }
}

export const deleteBlogOf = (content) => {
  return async (dispatch) => {
    const id = content
    await blogService.deleteData(id)
    dispatch(deleteBlog(id))
  }
}

export default blogReducer.reducer
