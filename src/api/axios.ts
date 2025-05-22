import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.18.21:8000/api',
  withCredentials: true, // si usas Sanctum
})

export default api
