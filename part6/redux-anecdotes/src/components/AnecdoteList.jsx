import { useDispatch, useSelector } from 'react-redux'
import { voteOf } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'

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

  const handleClick = (anecdote) => {
    dispatch(voteOf(anecdote.id))
    dispatch(notificationChange(`You voted '${anecdote.content}'`))

    setTimeout(() => {
      dispatch(notificationChange(''))
    }, 5000)
  }

  const anecdotes = [
    ...useSelector((state) => {
      return state.filter.length === 0
        ? state.anecdote
        : state.anecdote.filter((note) =>
            note.content.toLowerCase().includes(state.filter.toLowerCase())
          )
    }),
  ].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => handleClick(anecdote)}
        />
      ))}
    </div>
  )
}

export default AnecdoteList
