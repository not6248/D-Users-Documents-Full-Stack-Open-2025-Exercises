import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { notificationDispatch } = useContext(NotificationContext)

  const newAnecdoteForm = useMutation({
    mutationFn:createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'],anecdotes.concat(newAnecdote))
    },
    onError: (err) => {
      notificationDispatch({ type: 'setNotificationValue', payload: err.message })
      setTimeout(()=>{
        notificationDispatch({ type: 'clearNotification' })
      },5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteForm.mutate({content,votes: 0})
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
