import axios from 'axios'
import qs from 'qs'

const api = window.api
  ? window.api
  : axios.create({
      baseURL: process.env.API_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

const handleResponse = (res, resolve, reject) => {
  res.status === 200 ? resolve(res.data) : reject(res.statusText)
}

export const buildPromise = (method, endPoint, data, config) => {
  return new Promise((resolve, reject) => {
    method(endPoint, data, config)
      .then(res => handleResponse(res, resolve, reject))
      .catch(reason => {
        reject(reason)
      })
  })
}

export function apiGet(endPoint, config) {
  return buildPromise(api.get, endPoint, config)
}

export function apiPost(endPoint, data, config) {
  // if config given, don't stringify. User should stringify itslef if required
  // addCredentials added as we do not support cookies in this app.
  const parsedData = config
    ? addCredentials(data)
    : qs.stringify(addCredentials(data))

  return buildPromise(api.post, endPoint, parsedData, config)
}

export function apiPut(endPoint, data) {
  return buildPromise(api.put, endPoint, data)
}

export function apiDelete(endPoint, data) {
  return buildPromise(api.delete, endPoint, data)
}

function addCredentials(data) {
  const email = localStorage.getItem('email')
  const password = localStorage.getItem('password')

  if (email && password) {
    return Object.assign({}, data, {
      email,
      password
    })
  } else {
    return data
  }
}
