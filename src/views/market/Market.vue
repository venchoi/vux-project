<template>
  <div class="market-container">
    <view-box>
      <div class="market-header">
        <div class="title">50ETF</div>
        <div class="close" @click="navigateTo('/mainMarket')">
          {{mainTick.close}}
          <img src="../../assets/img/arrow-right.png" alt="">
        </div>
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/2">
            <div class="flex-item">
              跌涨：
              <stock-details :value="mainTick.change" modal="normal" />
            </div>
          </flexbox-item>
          <flexbox-item :span="1/2">
            <div class="flex-item">
              幅度：
              <stock-details :value="mainTick.ratio" boundary="0" unit="%" :prefix="true" modal="normal"/>
            </div>
          </flexbox-item>
          <flexbox-item :span="1/2">
            <div class="flex-item">
              交易量：{{mainTick.vol}}
            </div>
          </flexbox-item>
          <flexbox-item :span="1/2">
            <div class="flex-item">
              金额：
              <stock-details :value="mainTick.amount" :format="true" />
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <tab :line-width="3" custom-bar-width="60px" bar-active-color="#EA3939" v-model="tabIndex">
        <tab-item v-for="(item, key) in months" :selected="tabIndex === key" @click="tabIndex = key" :key="key">{{item}}</tab-item>
      </tab>
      <div class="details">
        <div class="header">
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/5">
              <div class="header-item red">
                涨跌幅
              </div>
            </flexbox-item>
            <flexbox-item :span="1/5">
              <div class="header-item red">
                现价
              </div>
            </flexbox-item>
            <flexbox-item :span="1/5">
              <div class="header-item split">
                <div>购</div>
                <div>沽</div>
              </div>
            </flexbox-item>
            <flexbox-item :span="1/5">
              <div class="header-item green">
                现价
              </div>
            </flexbox-item>
            <flexbox-item :span="1/5">
              <div class="header-item green">
                涨跌幅
              </div>
            </flexbox-item>
          </flexbox>

        </div>
        <div class="data" v-if="monthData[tabIndex].dataList">
          <div class="row" v-if="monthData[tabIndex].dataList.length > 0" v-for="(item , key) in monthData[tabIndex].dataList" :key="key">
            <flexbox :gutter="0" wrap="wrap" v-if="codesData[item.buy_code]">
              <flexbox-item :span="1/5"  @click.native="navigateTo(`/marketDetails/${item.buy_code}`)">
                <div class="data-item">
                  <stock-details :value="codesData[item.buy_code].ratio" boundary="0" unit="%" :prefix="true" modal="normal"/>
                </div>
              </flexbox-item>
              <flexbox-item :span="1/5" @click.native="navigateTo(`/marketDetails/${item.buy_code}`)">
                <div class="data-item">
                  <stock-details :value="1" modal="normal" :showValue="codesData[item.buy_code].price" />
                </div>
              </flexbox-item>
              <flexbox-item :span="1/5">
                <div class="data-item split">
                  {{item.exepx}}
                </div>
              </flexbox-item>
              <flexbox-item :span="1/5" @click.native="navigateTo(`/marketDetails/${item.sell_code}`)">
                <div class="data-item">
                  <stock-details :value="-1" modal="normal" :showValue="codesData[item.sell_code].price" />
                </div>
              </flexbox-item>
              <flexbox-item :span="1/5" @click.native="navigateTo(`/marketDetails/${item.sell_code}`)">
                <div class="data-item">
                  <stock-details :value="codesData[item.sell_code].ratio" boundary="0" unit="%" :prefix="true" modal="normal"/>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
import { ViewBox, Flexbox, FlexboxItem, Tab, TabItem } from 'vux'

import StockDetails from '../../components/StockDetails'
import ajax from '../../plugins/ajax'
import { baseUtil } from '../../util'
export default {
  data () {
    return {
      tabIndex: 0,
      months: ['7月', '8月', '9月', '10月'],
      monthData: [{
        codes: [],
        dataList: [{
          buy_code: '',
          exepx: '',
          sell_code: ''
        }],
        month: ''
      }],
      codesData: {},
      codes: [],
      mainTick: {},
      timer: 0,
    }
  },
  components: {
    ViewBox,
    Flexbox,
    FlexboxItem,
    StockDetails,
    Tab,
    TabItem
  },
  mounted () {
    const vm = this
    vm.requestMonthData()
    vm.requestMainTick()
    if (vm.timer !== 0) {
      clearInterval(vm.timer)
    }
    this.timer = setInterval(() => {
      vm.requestMonthData()
      vm.requestMainTick()
    }, 10000)
  },
  methods: {
    requestMainTick () {
      ajax.M_MAIN_TICK({
        success: (res) => {
          if (res.error_code === '0') {
            this.mainTick = res.data
          }
        }
      })
    },
    requestMonthData (cb) {
      ajax.GET_EXEPX_INFO({
        success: (res) => {
          if (res.error_code === '0' && res.data.length) {
            const data = res.data
            const months = []
            const codes = new Set()
            baseUtil.each(data, (monthData) => {
              months.push(monthData.month)
              baseUtil.each(monthData.codes, (code) => {
                codes.add(code)
              })
            })
            this.monthData = data
            this.months = months
            this.codes = Array.from(codes)
            this.requestMarket()
            if (typeof cb === 'function') {
              cb()
            }
          }
        }
      })
    },
    requestMarket () {
      const param = {
        codes: this.codes
      }
      ajax.GET_CODE_QUOTATION({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            const data = res.data
            const codesData = {}
            baseUtil.each(data, (codeItem) => {
              const code = codeItem.code
              codesData[code] = codeItem
            })
            this.codesData = codesData
          }
        }
      })
    },
    navigateTo (url) {
      this.$router.push(url)
    }
  },
  beforeDestroy(){
    const timer = this.timer
    clearInterval(timer)
  }
}
</script>
<style lang="less">
.market-container {
  .market-header {
    background: #fff;
    margin-bottom: 3px;
    padding-bottom: 10px;
    .close {
      display: flex;
      font-size: 39px;
      text-align: center;
      color: #ea3939;
      align-items: center;
      justify-content: center;
      img {
        margin-left: 10px;
        width: 10px;
      }
    }
    .flex-item {
      font-size: 14px;
      padding: 3px 0 3px 30px;
    }
    .title {
      text-align: center;
      padding: 10px 0;
    }
  }
  .active {
    color: #ea3939 !important;
  }
  .red {
    background: #ea3939;
  }
  .green {
    background: #1faf31;
  }
  .header {
    .header-item {
      padding: 10px 0;
      text-align: center;
      color: #fff;
    }
    .split {
      display: flex;
      padding: 0;
      > div {
        width: 50%;
        padding: 10px 0;
        &:nth-of-type(1) {
          background: #ea3939;
        }
        &:nth-of-type(2) {
          background: #1faf31;
        }
      }
    }
  }
  .data {
    .data-item {
      padding: 10px 0;
      text-align: center;
      &.split {
        background: #f4f8ff;
        color: #397eea;
      }
    }
  }
}
</style>

