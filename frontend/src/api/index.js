import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:3000/api/v1'})

const profile = JSON.parse(localStorage.getItem('profile'))

const accessHeader = {
    headers: {
      'Authorization': `token ${profile ? profile.accessToken : null}`
    }
  }

export const loginIn = (formData) => API.post('/auth/loginUser', formData)

export const register = (formData) => API.post('/auth/registerUser', formData)

export const deleteUser = (formData) => API.delete('/user/deleteUser', {headers:accessHeader.headers,data:formData})

export const getUser = (formData) => {
  return axios.post('http://localhost:3000/api/v1/user/userProfile', formData );

}

export const editUser = (formData) => API.put('/user/userProfile', formData)
