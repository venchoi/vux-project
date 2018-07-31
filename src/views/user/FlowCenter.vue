<template>
  <view-box>
    <scroller class="flow-center-page" @on-scroll-bottom="reachBottom">
      <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">资金流水</x-header>
      <tab :line-width=2 active-color='#eb3939' v-model="tabIndex" :scroll-threshold=5>
        <tab-item :selected="tabIndex === 0" @click.native="changeRoute('charge', 0)">充值</tab-item>
        <tab-item :selected="tabIndex === 1" @click.native="changeRoute('withdraw', 1)">提现</tab-item>
        <tab-item :selected="tabIndex === 2" @click.native="changeRoute('trade', 1)">交易</tab-item>
        <!-- <tab-item :selected="tabIndex === 3" @click.native="changeRoute('defer')">递延费</tab-item> -->
        <!-- <tab-item :selected="tabIndex === 4" @click.native="changeRoute('spread')">推广收益</tab-item> -->
      </tab>
      <div class="no-data" v-if="renderList.length <= 0">
        <img src="../../assets/img/no-data.png" alt="">
      </div>
      <group v-else>
        <flexbox class="renderItem" justify="space-between" v-for="(item, index) in renderList" :key="index">
          <flexbox-item class="flex-item">
            <flexbox orient="vertical" class="item-title">
              <flexbox-item class="name">{{item.name}}</flexbox-item>
              <flexbox-item class="date-time">{{item.time}}</flexbox-item>
            </flexbox>
          </flexbox-item>
          <flexbox-item class="flex-item">
            <flexbox orient="vertical" class="item-value">
              <flexbox-item class="action-cash">
                <stock-details :format="false" :value="item.action_cash" modal="normal" />
              </flexbox-item>
              <flexbox-item class="balance-cash">余额： {{item.balance_cash}}</flexbox-item>
            </flexbox>
          </flexbox-item>
        </flexbox>
      </group>
    </scroller>
  </view-box>
</template>
<script>
const tabsMap = {
  charge: 0,
  withdraw: 1,
  trade: 2,
  defer: 3,
  spread: 4
}
import { ViewBox, Scroller, Group, Tab, TabItem, XHeader, Flexbox, FlexboxItem } from 'vux'
import StockDetails from '../../components/StockDetails'
import ajax from '../../plugins/ajax'
import { baseUtil } from '../../util';
export default {
  data() {
    return {
      tabIndex: 0,
      tab: this.$route.params.tab,
      allList: {
        0: {
          tab: 'charge',
          data: [],
          minId: '',
          hasData: true,
          isInit: true,
        },
        1: {
          tab: 'withdraw',
          data: [],
          minId: '',
          hasData: true,
          isInit: true,
        },
        2: {
          tab: 'trade',
          data: [],
          minId: '',
          hasData: true,
          isInit: true,
        },
        3: {
          tab: 'defer',
          data: [],
          minId: '',
          hasData: true,
          isInit: true,
        },
        4: {
          tab: 'spread',
          data: [],
          minId: '',
          hasData: true,
          isInit: true,
        }
      },
      renderList: [],
      limit: false
    }
  },
  watch: {
    tabIndex() {
      this.renderList = this.allList[this.tabIndex].data
    }
  },
  mounted() {
    this.renderList = this.allList[0].data
    this.tabIndex = tabsMap[this.$route.params.tab]
    baseUtil.each(tabsMap, (item, index) => {
      const minId = this.allList[item].minId
      this.requestData(minId, index, item, true)
    })
  },
  methods: {
    changeRoute(tab, tabIndex) {
      const vm = this
      vm.tab = tab
      vm.$router.replace(`/flowCenter/${tab}`)
      const activeItem = vm.allList[tabIndex]
      const isInit = activeItem.isInit
      if (isInit) {
        const minId = activeItem.minId
        const index = activeItem.name
        vm.requestData(minId, vm.tab, tabIndex, true)
      }
    },
    reachBottom() {
      const tab = this.tabIndex
      const activeItem = this.allList[tab]
      const hasData = activeItem.hasData
      if (hasData) {
        const minId = activeItem.minId
        const index = activeItem.name
        this.requestData(minId, this.tab, tab, false)
      }
    },
    requestData(minId, index, item, isInit) {
      if (!this.limit) {
        this.limit = true
        const param = {
          min_id: minId,
          type: index
        }
        ajax.USER_FUNDS_FLOW({
          param,
          success: (res) => {
            this.limit = false
            this.allList[item].isInit = false
            if (res.error_code === '0' && res.data) {
              if (res.data.dataList) {
                if (isInit) {
                  this.allList[item].data = res.data.dataList
                  this.renderList = this.allList[item].data
                } else {
                  this.allList[item].data.push(res.data.dataList)
                }
                this.allList[item].minId = res.data.minId
              } else {
                this.allList[item].hasData = false
              }
            }
          }
        })
      }
    }
  },
  components: {
    ViewBox,
    StockDetails,
    Group,
    Tab,
    TabItem,
    XHeader,
    Flexbox,
    FlexboxItem,
    Scroller
  }
}
</script>
<style lang="less">
.flow-center-page {
  .renderItem {
    border-bottom: 1px solid #f8f8f8;
    .flex-item {
      padding: 10px;
    }
    .name {
      color: #333;
      font-size: 16px;
    }
    .date-time,
    .balance-cash {
      color: #999;
      font-size: 13px;
    }
    .action-cash {
    }
  }
  .item-value {
    text-align: right;
  }
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  img {
    width: 60%;
  }
}
</style>
