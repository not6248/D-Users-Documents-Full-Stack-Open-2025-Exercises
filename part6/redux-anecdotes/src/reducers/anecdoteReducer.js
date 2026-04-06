import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    replaceOf(state, action) {
      const id = action.payload.id
      const changedAnecdotes = action.payload
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdotes,
      )
    },
  },
})

const { setAnecdotes, createAnecdote, replaceOf } = anecdoteSlice.actions

export const initializeAnecdote = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const voteOf = (content) => {
  return async (dispatch) => {
    const id = content
    const anecdotes = await anecdoteService.getAll()

    const anecdotesToChange = anecdotes.find((n) => n.id === id)

    const changedAnecdotes = {
      ...anecdotesToChange,
      votes: anecdotesToChange.votes + 1,
    }

    const updatedAnecdote = await anecdoteService.update(id, changedAnecdotes)
    dispatch(replaceOf(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
