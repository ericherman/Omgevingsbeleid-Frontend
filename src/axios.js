import axios from 'axios'

const access_token = localStorage.getItem('access_token')
const api_version = 'v0.1'
const instance = axios.create({
  baseURL: `https://api-acctest-ob.westeurope.cloudapp.azure.com/test/${api_version}`,
  headers: {
  	'Content-Type': 'application/json',
  	'Authorization': `Token ${access_token}`
  }
})

instance.interceptors.request.use(function (config) {
  const access_token = localStorage.getItem('access_token')
  config.headers.Authorization = `Token ${access_token}`
  return config;
})

// export function setAccessToken() {
//   console.log("New Access Token has been set.")
//   const access_token = localStorage.getItem('access_token')
//   instance.defaults.headers.common['Authorization'] = access_token // for all requests
// }

export default instance