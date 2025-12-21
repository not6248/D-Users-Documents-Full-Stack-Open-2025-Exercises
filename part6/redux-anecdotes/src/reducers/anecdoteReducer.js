import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState : [],
  reducers: {
    createAnecdotes(state, action){
      state.push(action.payload)
    },
    voteOf(state,action){
      const id = action.payload
      const anecdotesToChange = state.find(n => n.id === id)
      const changedAnecdotes = {
        ...anecdotesToChange,
        votes: anecdotesToChange.votes + 1
      }
      return state.map(anecdotes => (anecdotes.id !== id ? anecdotes : changedAnecdotes))
    },
    setAnecdotes(state, action){
      return action.payload
    }
  }
})

const { setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdote = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const { createAnecdotes, voteOf} = anecdoteSlice.actions
export default anecdoteSlice.reducer