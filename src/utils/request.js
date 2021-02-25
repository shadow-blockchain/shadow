import Taro from '@tarojs/taro'
import {
  from
} from 'rxjs'
import config from '../config/index'

const interceptor = function (chain) {
  const requestParams = chain.requestParams
  const {
    method,
    data,
    url
  } = requestParams

  return chain.proceed(requestParams)
    .then(res => {
      if (res.statusCode == 200) {
        if (!res.data.success) {
          Taro.showToast({
              title: res.data.error.message,
              icon: "none",
              duration:2000
          })
        }
        return res.data.data
      }
      return {}
    })
}

Taro.addInterceptor(interceptor)
// Taro.addInterceptor(Taro.interceptors.logInterceptor)
Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)

export function baseReq(url, method, param) {
  var url = config.api + url
  return from(Taro.request({
    url,
    method,
    data: param,
    mode: 'cors'
  }))
}


export function get(url, param = {}) {
  return baseReq(url, "GET", param)
}

export function post(url, param) {
  return baseReq(url, "POST", param)
}

export function put(url, param) {
  return baseReq(url, "PUT", param)
}
