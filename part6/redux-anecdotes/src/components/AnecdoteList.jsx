import { useDispatch, useSelector } from 'react-redux'
import { voteOf } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    return state.filter.length === 0 
    ? state.anecdote
    : state.anecdote.filter(note => 
      note.content.toLowerCase().includes(state.filter.toLowerCase()) 
    )
  }).sort((a , b) => b.votes - a.votes)

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => dispatch(voteOf(anecdote.id))}
        />
      ))}
    </div>
  )
}

export default AnecdoteList
