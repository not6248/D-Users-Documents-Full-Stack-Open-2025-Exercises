import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState : [],
  reducers: {
    createAnecdotes(state, action){
      state.push(action.payload)
    },
    replaceOf(state,action){
      const id = action.payload.id
      const changedAnecdotes = action.payload
      return state.map(anecdotes => (anecdotes.id !== id ? anecdotes : changedAnecdotes))
    },
    setAnecdotes(state, action){
      return action.payload
    }
  }
})

const { setAnecdotes, createAnecdotes ,replaceOf} = anecdoteSlice.actions

export const initializeAnecdote = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdotes(newAnecdote))
  }
}

export const voteOf = (content) => {
  return async (dispatch) => {
    const id = content
    const anecdotes = await anecdoteService.getAll()

    const anecdotesToChange = anecdotes.find(n => n.id === id)

    const changedAnecdotes = {
      ...anecdotesToChange,
      votes: anecdotesToChange.votes + 1
    }

    const updatedAnecdote = await anecdoteService.update(id,changedAnecdotes)
    dispatch(replaceOf(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer