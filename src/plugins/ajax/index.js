import axios from 'axios'
import qs from 'qs'
import apiList from './apiList'
import baseUtil from '../../util/baseUtil'
import { user } from '../../model/storage'
// import arrayUtil from '../../util/arrayUtil';
import {
  businessCodeHandler,
  specialHandler
} from './handlers'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const env = process.env.NODE_ENV
const methods = ['put', 'delete', 'get']
const axiosConfig = {
  withCredentials: true,
  baseURL: env === 'production' ? 'http://m.duoyingle.com' : '',
  // timeout: 10000,
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

class Ajax {
  /**
   *
   * @param {Object} options
   * @property {Object} options.body
   * @property {Object} options.errorHandler
   * @property {Object} options.headers
   * @property {Object} options.max
   */
  constructor (options = {}) {
    this.errorHandler = options.errorHandler // 异常处理
    this.intercept = options.intercept || (() => { }) // 拦截返回数据

    baseUtil.merge(axiosConfig, options.default)
    this.axios = axios.create(axiosConfig)
    this.apiList = apiList
  }
  /**
   * 类似promis.all
   */
  all (requests = [], callback) {
    if (!baseUtil.isArray(requests)) {
      return
    }
    axios.all(requests)
      .then(axios.spread((acc, pres) => callback(acc, pres)))
  }

  static create (...args) {
    const instance = new Ajax(...args)

    instance.axios.interceptors.response.use((response) => {
      // 对响应数据做点什么
      const data = response.data
      baseUtil.assert(typeof data === 'object', 'res返回格式不正确')
      baseUtil.assert(!!data.data && !!data.error_code && !!data.msg, 'res返回格式不正确')

      businessCodeHandler(data.error_code)
      // specialHandler(data);
      return response.data
    }, (error) => {
      // 对响应错误做点什么
      console.log('i m error', error)
      return Promise.reject(error)
    })

    return instance
  }
  post ({ url, param }) {
    const config = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(param),
      url
    }
    return axios(config)
  }
  form ({ url, param }) {
    const form = new FormData()
    const userInfo = user.read()
    if (userInfo) {
      if (param) {
        param.user_access_token = userInfo.token
        param.uid = userInfo.uuid
      } else {
        param = {
          user_access_token: userInfo.token,
          uid: userInfo.uuid
        }
      }
    }
    const keys = Object.keys(param)
    keys.forEach((key) => {
      if (baseUtil.isArray(param[key])) {
        baseUtil.each(param[key], (val) => {
          form.append(`${key}[]`, encodeURIComponent(val))
        })
      } else {
        form.append(key, param[key])
      }
    })
    const config = {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data' },
      data: form,
      url,
      baseURL: env === 'production' ? 'http://m.duoyingle.com' : ''
    }
    return axios(config)
      .then((res) => {
        if (res.status === 200) {
          return res.data
        }
      })
  }
}
const PPCDataHandler = (data, dataHandler) => { // 数据处理层
  if (data && typeof dataHandler === 'function') {
    dataHandler(data)
  }
}
baseUtil.each(methods, (method) => {
  Ajax.prototype[method] = function ajaxMethod ({ url, param }) {
    // const dataHandler = param.dataHandler
    return this.axios[method](url, param).then(data => PPCDataHandler(data))
      .catch((e) => {
        console.error(e)
      })
  }
})
baseUtil.each(apiList, (url, name) => {
  Ajax.prototype[name] = function ajaxUrl (options) {
    let param = {}
    const userInfo = user.read()
    let success = function success (data) {
      return data
    }
    let dataHandler = () => { }
    if (options) {
      success = options.success || success
      param = options.param
      if (userInfo) {
        if (param) {
          param.user_access_token = userInfo.token
          param.uid = userInfo.uuid
        } else {
          param = {
            user_access_token: userInfo.token,
            uid: userInfo.uuid
          }
        }
      }
    }
    dataHandler = (data) => {
      if (specialHandler[url]) {
        specialHandler[url](data)
      }
      success(data)
    }
    return this.axios.post(url, qs.stringify(param))
      .then(data => PPCDataHandler(data, dataHandler))
      .catch((e) => {
        console.error(e)
      })
  }
})
export default Ajax.create()
