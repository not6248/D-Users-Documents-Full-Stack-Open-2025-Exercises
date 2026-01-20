import { useContext } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAnecdotes , updateAnecdote } from "./requests"
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from "./NotificationContext"


const App = () => {
  const { notificationDispatch } = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const updateAnecdotes = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ['anecdotes']})
      
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdotes.mutate({...anecdote,votes: anecdote.votes + 1})
    const notification = `anecdote '${anecdote.content}' voted`

    notificationDispatch({ type: 'setNotificationValue', payload: notification })
    setTimeout(()=>{
      notificationDispatch({ type: 'clearNotification' })
    },5000)
    
  }

  const result = useQuery({
    queryKey:['anecdotes'],
    queryFn:getAnecdotes,
    refetchOnWindowFocus: false,
    retry : 1
  }) 

  console.log(JSON.parse(JSON.stringify(result)))

  if(result.isLoading){
    return <div>loading data...</div>
  }

  if(result.isError){
    return <div>anecdote service not avaliable due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
