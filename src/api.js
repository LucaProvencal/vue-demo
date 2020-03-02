// import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    // let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      // headers: {
      //   Authorization: `Bearer ${accessToken}`
      // }
    }).then(req => {
      return req.data
    })
  },
  getShapes () {
    return this.execute('get', '/shapes')
  },
  getShape (id) {
    return this.execute('get', `/shapes/${id}`)
  },
  createShape (data) {
    return this.execute('post', '/shapes', data)
  },
  updateShape (id, data) {
    return this.execute('put', `/shapes/${id}`, data)
  },
  deleteShape (id) {
    return this.execute('delete', `/shapes/${id}`)
  }
}