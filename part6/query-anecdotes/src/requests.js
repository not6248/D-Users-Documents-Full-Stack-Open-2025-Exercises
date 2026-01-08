const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const respone = await fetch (baseUrl)

  if(!respone.ok){
    throw new Error('Failed to fetch anecdotes')
  }

  return await respone.json()
}

export const createAnecdotes = async (newAncdotes) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type' : 'applocation/json' },
    body: JSON.stringify(newAncdotes)
  }

  const respone = await fetch (baseUrl,options)

    if(!respone.ok){
    throw new Error('Failed to create anecdotes')
  }

  return await respone.json()
}

export const updateAnecdotes = async (updatedAncdotes) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type' : 'applocation/json' },
    body: JSON.stringify(updatedAncdotes)
  }

  const respone = await fetch (`${baseUrl}/${updatedAncdotes.id}`,options)

    if(!respone.ok){
    throw new Error('Failed to update anecdotes')
  }

  return await respone.json()
}
