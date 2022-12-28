import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://127.0.0.1:6000/api',
  baseURL: 'https://weitang.tuozhanad.com/api',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // var username = 'miaohf'
    // var password = 'fireman'
    // var basicAuth = 'Basic ' + btoa(username + ':' + password)
    // config.headers.Authorization = basicAuth

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // console.log('aaaaa') // for debug
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // const res = response.data
    console.log(response.status)

    // if the custom code is not 200, it is judged as an error.
    if (response.status !== 200) {
      console.log()


    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    // if (error.response.status === 401 || error.response.status === 403 || error.response.status === 405 ) {
    if (error.response.status === 401 || error.response.status === 403 || error.response.status === 405 || error.response.status === 50008) {
      // to re-login
      this.$confirm('您的登录凭证已经过期，请重新登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      return Promise.reject(error)
    }
  }
)

export default service
