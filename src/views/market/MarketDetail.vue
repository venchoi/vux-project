<template>
  <view-box class="market-detail-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">
      <div class="header-content">
        <div class="name">{{tickData.name}}</div>
        <div class="code">{{code}}</div>
      </div>
    </x-header>
    <div>
      <tab :line-width=2 active-color='#eb3939' v-model="index1">
        <tab-item class="vux-center" :selected="index1 === lineIndex1" v-for="(item, lineIndex1) in list2" @click="index1 = lineIndex1" :key="lineIndex1">{{item}}</tab-item>
      </tab>
      <div v-for="(item, lineIndex2) in lines" :key="lineIndex2">
        <div class="tab-line" v-show="lineIndex2 ===  index1">
          <img :src="item" alt="">
        </div>
      </div>
      <!-- <div class="tips">
        <p>注意: 本页面行情存在延时，交易请以交易所实时价格为准(净值估算平均偏差：0.04%)</p>
      </div> -->
    </div>
    <div>
      <tab :line-width="2" v-model="index2" bar-active-color="transparent" active-color="#4485ec">
        <tab-item :selected="index2 === 0" @click="index2 = 0">五档</tab-item>
        <tab-item :selected="index2 === 1" @click="index2 = 1">详情</tab-item>
      </tab>
      <div>
        <div class="tab-deal" v-show="index2 ===  0">
          <x-table :cell-bordered="false" :content-bordered="false" style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>买卖</th>
                <th>价格</th>
                <th>委托量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in sellStage" :key="item.name">
                <td>卖{{item.index}}</td>
                <td>{{item.price}}</td>
                <td>{{item.count}}</td>
              </tr>
              <tr v-for="(item) in buyStage" :key="item.name">
                <td>买{{item.index}}</td>
                <td>{{item.price}}</td>
                <td>{{item.count}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <div class="tab-deal" v-show="index2 ===  1">
          <x-table :cell-bordered="false" style="background-color:#fff;">
            <tbody>
              <tr>
                <td class="text-left">涨幅</td>
                <td class="text-right">
                  <stock-details :value="tickData.ratio" boundary="0" unit="%" :prefix="true" modal="normal" />
                </td>
                <td class="text-left">金额</td>
                <td class="text-right">{{tickData.amount}}</td>
              </tr>
              <tr>
                <td class="text-left">行权价格</td>
                <td class="text-right">{{tickData.exepx}}</td>
                <td class="text-left">持仓量</td>
                <td class="text-right">{{tickData.open_interest}}</td>
                <tr>
                  <td class="text-left">到期日</td>
                  <td class="text-right">{{tickData.expiredate}}</td>
                  <td class="text-left">剩余天数</td>
                  <td class="text-right">{{tickData.surplus_days}}</td>
                </tr>
            </tbody>
          </x-table>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <div class="add-to-myStock" @click="operate">{{ tickData.is_user_code == 1 ? '删自选' : '加自选' }}</div>
      <div class="trade" @click="navigateTo">交易</div>
    </div>
  </view-box>
</template>
<script>
import ajax from '../../plugins/ajax'
import { ViewBox, XHeader, Tab, TabItem, XTable } from 'vux'
import { baseUtil } from '../../util'
import StockDetails from '../../components/StockDetails'
import { user } from '../../model/storage'
export default {
  data () {
    return {
      code: this.$route.params.code,
      tickData: {},
      index1: 0,
      index2: 0,
      list2: ['分时线', '日K', '周K', '月K'],
      lines: [],
      sellStage: [],
      buyStage: [],
      timer: 0
    }
  },
  mounted () {
    const vm = this
    vm.requestData()
    if (vm.timer !== 0) {
      clearInterval(vm.timer)
    }
    this.timer = setInterval(() => {
      vm.requestData()
    }, 10000)
  },
  destroyed () {
    const vm = this
    clearInterval(vm.timer)
  },
  methods: {
    navigateTo () {
      const url = `/trade/buy?code=${this.code}`
      this.$router.push(url)
    },
    requestData () {
      const param = {
        code: this.code,
        is_has_collect: 1,
      }
      ajax.M_LAST_TICK({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            const tickData = res.data
            this.tickData = tickData
            const lines = tickData.lines
            baseUtil.each(lines, (line) => {
              this.lines.push(line)
            })
            const buyStage = []
            const sellStage = []
            for (let i = 1; i < 6; i++) {
              const buyCount = `buy${i}_count`
              const buyPrice = `buy${i}_price`
              const sellCount = `sell${i}_count`
              const sellPrice = `sell${i}_price`
              const buy = {
                name: `buy${i}`,
                index: i,
                count: tickData[buyCount],
                price: tickData[buyPrice]
              }
              const sell = {
                name: `sell${i}`,
                index: i,
                count: tickData[sellCount],
                price: tickData[sellPrice]
              }
              buyStage.push(buy)
              sellStage.unshift(sell)
            }
            this.buyStage = buyStage
            this.sellStage = sellStage
          }
        }
      })
    },
    operate () {
      const vm =  this
      const userInfo = user.read()
      const type = vm.tickData.is_user_code == 1 ? 0 : 1
      if (!userInfo) {
        this.$router.push(`/login/userLogin`)
      } else {
        const param = {
          code: vm.code,
          is_collect: type
          // user_access_token: userInfo.token
        }
        ajax.DO_USER_CODE({
          param,
          success: (res) => {
            if (vm.tickData.is_user_code == 1) {
              vm.tickData.is_user_code = 0
            } else {
              vm.tickData.is_user_code = 1
            }
            // baseUtil.merge(item, copyOfItem)
            vm.$vux.toast.show({
              text: res.msg,
              type: 'text'
            })
          }
        })
      }
    },
  },
  deactivated () {
    clearInterval(this.timer)
  },
  components: {
    ViewBox,
    XHeader,
    Tab,
    TabItem,
    XTable,
    StockDetails
  }
}
</script>
<style lang="less">
.vux-header-back {
  color: #fff !important;
}
.left-arrow {
  &::before {
    border-color: #fff !important;
  }
}
</style>
<style lang="less" scrop>
.header-content {
  line-height: 1.4;
  .name {
    font-size: 18px;
  }
  .code {
    font-size: 12px;
  }
}
.market-detail-page {
  background-color: #fff;
}
.overwrite-title {
  font-size: 14px;
  line-height: 22px;
  color: #fff;
  text-align: center;
}
img {
  width: 96%;
  height: auto;
}
.tips {
  padding: 15px 46px;
  font-size: 10px;
  color: #999;
}
.tab-line {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}
.tab-deal {
  .text-right {
    padding-right: 15px;
    text-align: right;
  }
  .text-left {
    padding-left: 15px;
    text-align: left;
  }
}
.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 42px;
  display: flex;
  background-color: #fff;
  .add-to-myStock,
  .trade {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 50%;
    text-align: center;
  }
  .add-to-myStock {
    box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .trade {
    background-color: #ea3939;
    color: #fff;
  }
}
</style>
