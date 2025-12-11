import { configureStore } from '@reduxjs/toolkit'

import filterReducer from './reducers/filterReducer'
import anecdoteReducer from './reducers/anecdoteReducer'

const store = configureStore({
  reducer: {
  anecdote: anecdoteReducer,
  filter: filterReducer
  }
})

export default store