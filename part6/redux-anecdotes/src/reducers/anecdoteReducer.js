import { createSlice } from '@reduxjs/toolkit'

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

export const { createAnecdotes, voteOf,setAnecdotes} = anecdoteSlice.actions
export default anecdoteSlice.reducer