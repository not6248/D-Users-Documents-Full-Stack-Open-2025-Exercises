const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch (baseUrl)

  if(!response.ok){
    throw new Error('Failed to fetch anecdotes')
  }

  return await response.json()
}

export const createAnecdotes = async (newAnecdote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify(newAnecdote)
  }

  const response = await fetch (baseUrl,options)

    if(!response.ok){
    throw new Error('Failed to create anecdotes')
  }

  return await response.json()
}

export const updateAnecdotes = async (updatedAncdotes) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify(updatedAncdotes)
  }

  const response = await fetch (`${baseUrl}/${updatedAncdotes.id}`,options)

    if(!response.ok){
    throw new Error('Failed to update anecdotes')
  }

  return await response.json()
}
