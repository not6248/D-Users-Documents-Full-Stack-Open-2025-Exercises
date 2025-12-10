import ReactDOM from 'react-dom/client'
import { createStore,combineReducers } from 'redux'
import { Provider } from 'react-redux'

import App from './App'
import filterReducer from './reducers/filterReducer'
import anecdoteReducer from './reducers/anecdoteReducer'

const reducer = combineReducers({
  anecdote: anecdoteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
