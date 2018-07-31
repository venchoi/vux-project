// import {
//   userActions
// } from '../vuex/actionsType'
import method from './method'
// import apiList from '../../plugins/ajax/apiList'
// import store from '../vuex'
// import {
//   format
// } from '../../util'

// function limit () {
//   const updateDate = this.storageApi.read(`${this.name}_updateDate`)
//   const today = format.date(new Date(), 'yyyy-MM-dd')
//   if (updateDate === today) {
//     return 0
//   }
//   this.storageApi.application.save(`${this.name}_updateDate`, today)
//   return 1
// }
/**
 * 用户信息存储结构
 */
class User extends method {
  constructor () {
    super()
    this.name = 'user'
    // this.written = (data) => {
    //   store.dispatch(userActions.SET_BASE_USER_INDEX, data)
    // }
  }
  _init (cb) {
    // const user = this.read()
    // if (user) {
    //   store.dispatch(userActions.SET_BASE_USER_INDEX, user)
    // }
    if (typeof cb === 'function') {
      cb()
    }
  }
}
class Rate extends method {
  constructor () {
    super()
    this.name = 'rate'
    this.api = 'POUNDAGE_RATE'
    // this.limit = limit
    // this.written = (data) => {
    //   store.dispatch(userActions.SET_BASE_USER_INDEX, data)
    // }
  }
  _init (cb) {
    // const rate = this.read()
    this.request()
    if (typeof cb === 'function') {
      cb()
    }
  }
}
export const user = new User()
export const rate = new Rate()
