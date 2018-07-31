import {
  ADD_MY_STOCK,
  REMOVE_MY_STOCK,
  UPDATE_MY_STOCK,
  GET_MY_STOCK,
  GET_STOCK_NEWS
} from './actionType'

import {
  MY_STOCK_UPDATE,
  MY_STOCK_INIT,
  STOCK_NEWS_UPDATE
} from '../mutations/mutationType'
import http from '../../../../../plugins/ajax'
import {
  baseUtil
} from '../../../../../util'

const apiList = http.apiList

/**
 * 创建MyStock元素格式
 * @param name
 * @param info
 * @param code
 * @param stockIndex
 * @param isDel
 * @returns {{info: string, foxxcode: *, stock_index: string, stock_name: string, is_del: string}}
 */
const createMyStockItem = ({ name = '----', info = '', code, stockIndex = '0', isDel = '0' }) => {
  const item = {
    info,
    foxxcode: code,
    stock_index: stockIndex,
    stock_name: name,
    is_del: isDel
  }
  return item
}
/**
 * 发送添加或者删除请求
 * @param state
 * @param item
 * @param success - 成功后的回调函数
 */
const synRequest = (state, item, success) => {
  const token = state.token
  const uid = state.uid

  http.api[apiList.EDIT_MY_STOCK]({
    param: {
      token,
      uid,
      group_id: 0,
      data_list: [item]
    },
    success
  })
}
/**
 * 判断股票是否在自选列表中
 * @param  {[type]} stockList - 自选股票列表
 * @param  {[type]} foxxcode  - 股票代码
 * @return {[type]} - 如不在则返回false，如存在则返回列表中对应项。
 */
const isInMyStock = (stockList, foxxcode) => {
  let isExist = false
  baseUtil.each(stockList, (item) => {
    if (foxxcode === item.foxxcode) {
      isExist = baseUtil.copy(item)
    }
  })
  return isExist
}

export default {
  /**
   * 获取股票列表
   * @param state
   * @param dispatch
   * @param commit
   */
  [GET_MY_STOCK] ({ state, dispatch, commit }) {
    const token = state.token
    const uid = state.uid
    http.api[apiList.GET_MY_STOCK]({
      param: {
        token,
        uid
      },
      success (data) {
        commit(MY_STOCK_INIT, data.data_list)
        dispatch(GET_STOCK_NEWS)
        baseUtil.each(data.data_list, (item) => {
          const listItem = item
          listItem.is_del = '0'
        })
      }
    })
  },
  /**
   * 添加自选股
   * @param state
   * @param commit
   * @param payload - 股票信息
   */
  [ADD_MY_STOCK] ({ state, commit }, payload) {
    let startIndex
    const code = payload.code
    const isExist = isInMyStock(state.myStock, code)
    if (state.myStock.length > 0) {
      startIndex = parseInt(state.myStock[0].stock_index, 10) + 1
    } else {
      startIndex = 100
    }
    const item = createMyStockItem({
      ...payload,
      stockIndex: startIndex
    })
    if (isExist) {
      return
    }
    const param = {
      type: 'add',
      item
    }
    synRequest(state, item, () => commit(MY_STOCK_UPDATE, param))
  },
  /**
   * 删除自选股
   * @param state
   * @param commit
   * @param code - 股票代码
   */
  [REMOVE_MY_STOCK] ({ state, commit }, code) {
    // if (!ycjUtil.checkCode(code)) {
    //   logger.error('code need corrected,in action - myStock')
    //   return
    // }
    const myStockList = state.myStock
    const item = isInMyStock(myStockList, code)
    item.is_del = '1'
    if (item) {
      synRequest(state, item, () => commit(MY_STOCK_UPDATE, {
        type: 'remove',
        item
      }))
    }
  },

  /**
   * 更新股票列表
   * @param state
   * @param commit
   * @param payload
   */
  [UPDATE_MY_STOCK] ({ state, commit }, payload) {
    const code = payload.code
    const param = baseUtil.copy(payload)
    delete param.code
    // if (!ycjUtil.checkCode(code)) {
    //   logger.error('code need corrected,in action - myStock')
    //   return
    // }
    const myStockList = state.myStock
    const item = isInMyStock(myStockList, code)
    baseUtil.merge(item, param, true)

    if (item) {
      synRequest(state, item, () => commit(MY_STOCK_UPDATE, {
        type: 'update',
        item
      }))
    }
  },
  /**
   * 获取股票新闻
   * @param state
   * @param commit
   */
  [GET_STOCK_NEWS] ({ state, commit }) {
    const stockList = []
    baseUtil.each(state.myStock, (stock) => {
      stockList.push(stock.foxxcode)
    })
    http.api[apiList.GET_MY_STOCK_NEWS]({
      param: {
        foxxcode_list: stockList
      },
      success (data) {
        let payload
        baseUtil.each(data, (news, code) => {
          payload = {
            code,
            news
          }
          commit(STOCK_NEWS_UPDATE, payload)
        })
      }
    })
  }
}
