import axios from 'axios'
const baseUrl = '/api/users'

const get = async (id) => {
  const respone = await axios.get(`${baseUrl}/${id}`)
  return respone.data
}

const getAll = async () => {
  const respone = await axios.get(baseUrl)
  return respone.data
}

export default { get, getAll }
