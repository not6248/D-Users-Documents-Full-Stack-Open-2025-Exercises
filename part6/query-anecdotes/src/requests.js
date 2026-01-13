const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch (baseUrl)

  if(!response.ok){
    throw new Error('Failed to fetch anecdotes')
  }

  return await response.json()
}

export const createAnecdote = async (newAnecdote) => {
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

export const updateAnecdote = async (updatedAncdote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify(updatedAncdote)
  }

  const response = await fetch (`${baseUrl}/${updatedAncdote.id}`,options)

    if(!response.ok){
    throw new Error('Failed to update anecdotes')
  }

  return await response.json()
}
