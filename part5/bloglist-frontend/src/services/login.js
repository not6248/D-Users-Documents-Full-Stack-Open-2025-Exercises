import axios from "axios";
const baseUrl = '/api/login'

const login = async credentials => {
  const respone = await axios.post(baseUrl,credentials)
  return respone.data
}

export default { login }