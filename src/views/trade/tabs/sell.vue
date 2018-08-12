<template>
  <div class="trade-sell">
    <group>
      <x-input title="合约代码" v-model="inputCode">
        <x-icon slot="right" type="ios-arrow-right" class="right-icon" @click="selectCode"></x-icon>
      </x-input>
      <x-input title="合约名称" v-model="keyword"></x-input>
      <grid :show-lr-borders="false" :show-vertical-dividers="false" :cols="3" class="deal-grid">
        <grid-item class="grid-item">
          <span>现价</span>
          <span>{{close}}</span>
        </grid-item>
        <grid-item class="grid-item">
          <span>昨收价</span>
          <span>{{preClose}}</span>
        </grid-item>
        <grid-item class="grid-item">
          <span>涨跌幅</span>
          <span><stock-details :value="ratio" boundary="0" unit="%" :prefix="true" modal="normal"/></span>
        </grid-item>
      </grid>
      <grid :show-lr-borders="false" :show-vertical-dividers="false" :cols="3" class="deal-grid">
        <grid-item class="grid-item">
          <span>行权价格</span>
          <span>{{exepx}}</span>
        </grid-item>
        <grid-item class="grid-item">
          <span>到期日</span>
          <span>{{endDate}}</span>
        </grid-item>
        <grid-item class="grid-item">
          <span>剩余天数</span>
          <span>{{remainDay}}</span>
        </grid-item>
      </grid>
    </group>
    <group>
      <div class="hasThisCode" v-show="hasThisCode">
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
    </group>
    <group>
      <flexbox class="price-block">
        <flexbox-item :span="3/5">
          <flexbox justify="center">
            <flexbox-item :span="2/5">
              <div style="text-align:center">委托方式</div>
            </flexbox-item>
            <flexbox-item :span="3/5">
              <div class="selector">
                <div class="input" :class="{active: priceType === 1}" @click="priceType = 1;sellPrice = 0">市价</div>
                <div class="market-price" :class="{active: priceType === 0}" @click="priceType = 0;sellPrice = Number(buyStage[0].price)">限价</div>
              </div>
            </flexbox-item>
          </flexbox>
          <div style="padding:10px 0">
            <flexbox justify="center">
              <flexbox-item :span="2/5">
                <div style="text-align:center">委托价格</div>
              </flexbox-item>
              <flexbox-item :span="3/5">
                <group>
                  <x-number v-model="sellPrice" :step="step" style="padding:0;font-size:13px;width:100%" width="calc(100% - 80px)" number-button-font-color="#999" :fillable="fillable"></x-number>
                </group>
              </flexbox-item>
            </flexbox>
          </div>
          <flexbox justify="center">
            <flexbox-item :span="2/5">
              <div style="text-align:center">委托数量</div>
            </flexbox-item>
            <flexbox-item :span="3/5">
              <group>
                <x-number v-model="volume" style="padding:0;width:100%" width="calc(100% - 80px)" fillable></x-number>
              </group>
            </flexbox-item>
          </flexbox>
          <flexbox justify="space-between">
            <flexbox-item>
              <div style="text-align:left;color:#999;font-size:14px;margin-top:8px;margin-left:10px">最大可卖: {{maxSellCount}}</div>
            </flexbox-item>
            <flexbox-item>
              <div style="text-align:right;color:#387eea;font-size:14px;margin-top:8px" @click="navigateTo('/tradeRule')">交易规则</div>
            </flexbox-item>
          </flexbox>
        </flexbox-item>
        <flexbox-item style="margin: 5px">
          <div class="flex-demo">
            <div class="tab-deal" v-if="sellStage.length">
              <x-table :cell-bordered="false" :content-bordered="false">
                <tbody style="line-height: 22px">
                  <tr v-for="(item) in sellStage" :key="item.name" @click="changePrice(item.price)">
                    <td>卖{{item.index}}</td>
                    <td class="sell-price">{{item.price}}</td>
                    <td>{{item.count}}</td>
                  </tr>
                  <tr v-for="(item) in buyStage" :key="item.name" @click="changePrice(item.price)">
                    <td>买{{item.index}}</td>
                    <td class="buy-price">{{item.price}}</td>
                    <td>{{item.count}}</td>
                  </tr>
                </tbody>
              </x-table>
            </div>
          </div>
        </flexbox-item>
      </flexbox>
    </group>
    <group>
      <x-button style="background:#4484EC;color:#fff" @click.native="sell">卖出</x-button>
    </group>
    <div v-transfer-dom>
      <popup v-model="showCodeList" position="bottom" max-height="50%">
        <!-- <popup-header left-text="取消" right-text="确定" title="请选择产品" :show-bottom-border="false" @on-click-left="showCodeList = false" @on-click-right="showCodeList = false"></popup-header> -->
        <group gutter="0">
          <div class="no-data" v-if="intrestList.length <= 0">
            <img src="../../../assets/img/no-data.png" alt="">
          </div>
          <radio v-else :options="intrestList" v-model="code"></radio>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import { ViewBox, TransferDom, Group, XHeader, Tab, TabItem, Selector, XInput, XNumber, Icon, Popup, PopupHeader, Radio, Grid, GridItem, XButton, Flexbox, FlexboxItem, XTable } from 'vux'
import ajax from '../../../plugins/ajax'
import { baseUtil } from '../../../util'
import StockDetails from '../../../components/StockDetails'
export default {
  name: 'Sell',
  directives: {
    TransferDom
  },
  data() {
    return {
      inputCode: '',
      keyword: '',
      close: 0,
      preClose: 0,
      ratio: 0.00,
      exepx: 0,
      endDate: '',
      remainDay: '',
      hasThisCode: false,
      index1: 0,
      priceType: 1,
      price: 0,
      volume: 1,
      sellStage: [],
      buyStage: [],
      lines: [],
      list2: ['分时线', '日K', '周K', '月K'],
      code: this.$route.query.code,
      showCodeList: false,
      allCodeList: {},
      sellPrice: 0,
      step: 0,
      fillable: false,
      openInterest: 0,
      tickData: {},
      maxSellCount: 0
    }
  },
  watch: {
    priceType() {
      if (this.priceType === 1) {
        this.step = 0
        this.fillable = false
      } else {
        this.step = 0.0001
        this.fillable = true
      }
    },
    code() {
      this.inputCode = this.code
      this.maxSellCount = this.copyOfIntrestList[this.code].volume
      if (this.allCodeList[this.code]) {
        this.keyword = this.allCodeList[this.code].name
      }
    },
    inputCode() {
      this.code = this.inputCode
      this.requestCode(false)
    }
  },
  mounted() {
    for (let i = 1; i < 6; i++) {
      const buy = {
        name: `buy${i}`,
        index: i,
        count: 0,
        price: 0
      }
      const sell = {
        name: `sell${i}`,
        index: i,
        count: 0,
        price: 0
      }
      this.buyStage.push(buy)
      this.sellStage.unshift(sell)
    }
    if (this.code) {
      this.inputCode = this.code
      this.requestCode()
    }
  },
  props: {
    intrestList: {
      type: Array,
      default: [],
    },
    copyOfIntrestList: {
      type: Object,
      default: {},
    }
  },
  methods: {
    changePrice(price) {
      this.priceType = 0
      this.sellPrice = Number(price)
    },
    changeCode(item) {
      console.log(item)
    },
    priceChange() {
      console.log('change')
    },
    requestCode() {
      const param = {
        code: this.inputCode
      }
      ajax.M_LAST_TICK({
        param,
        success: (res) => {
          if (res.error_code === '0' && res.data) {
            const data = res.data
            this.hasThisCode = false
            this.lines = []
            if (data.code) {
              this.hasThisCode = true
              this.close = data.close
              this.preClose = data.pre_close
              this.price = Number(data.close)
              this.ratio = data.ratio
              this.exepx = data.exepx
              this.endDate = data.expiredate
              this.remainDay = data.surplus_days
              this.keyword = data.name
              this.openInterest = data.open_interest
              baseUtil.each(data.lines, (line) => {
                this.lines.push(line)
              })
              const tickData = res.data
              this.tickData = tickData
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
              if (this.priceType === 0) {
                this.sellPrice = Number(buyStage[0].price)
              }
            }
          }
        }
      })
    },
    selectCode() {
      // todo
      this.showCodeList = true
    },
    closeOrder() {
      const param = {
        price_type: this.priceType,
        code: this.code,
        price: this.sellPrice,
        volume: this.volume
      }
      ajax.CLOSE_ORDER({
        param,
        success: (res) => {
          this.$vux.toast.show({
            text: res.msg,
            type: 'text'
          })
        }
      })
    },
    sell() {
      if (this.code.length > 0) {
        const vm = this
        const servicePrice = Number(vm.volume) * 10
        const price = vm.priceType === 1 ? '市价' : vm.price
        const content = `<div class="confirm-item" style="text-align:left">交易方向：卖出</div>
        <div class="confirm-item" style="text-align:left">合约代码：${vm.code}</div>
        <div class="confirm-item" style="text-align:left">合约名称：${vm.keyword}</div>
        <div class="confirm-item" style="text-align:left">剩余天数：${vm.remainDay}</div>
        <div class="confirm-item" style="text-align:left">委托价格：${price}</div>
        <div class="confirm-item" style="text-align:left">委托数量：${vm.volume}</div>
        <div class="confirm-item" style="text-align:left">总手续费：${servicePrice}</div>
        <div class="confirm-item" style="text-align:left">注：持仓递延费休市后按实际持仓张数收取，5元/张，仅交易日收取</div>`
        this.$vux.confirm.show({
          title: '交易确认',
          content,
          onConfirm: () => {
            vm.closeOrder()
          }
        })
      } else {
        this.$vux.toast.show({
          text: '请输入正确的期权代码',
          type: 'text'
        })
      }
    },
  },
  components: {
    ViewBox,
    Group,
    XHeader,
    Tab,
    TabItem,
    Selector,
    XInput,
    Icon,
    Popup,
    PopupHeader,
    Radio,
    Grid,
    GridItem,
    XButton,
    Flexbox,
    FlexboxItem,
    XNumber,
    XTable,
    StockDetails
  }
};
</script>
<style lang="less" scoped>
.right-icon {
  transform: translate(0, 5px);
  fill: grey;
}
.deal-grid {
  color: #fff;
  font-size: 12px;
}
.grid-item {
  color: #000;
  height: 25px;
}
.tab-line {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
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
.price-block {
  padding: 10px 0;
  font-size: 15px;
}
.selector {
  display: flex;
  border: 1px solid #ff3d3d;
  border-radius: 5px;
  .active {
    background: #ff3d3d;
    color: #fff;
  }
  > div {
    padding: 10px 0;
    flex: 1;
    text-align: center;
  }
}
.disabled {
  color: #999;
}
.tab-deal {
  padding: 5px;
  font-size: 12px;
  color: #999;
  line-height: 16px;
}
.sell-price {
  color: #ea3939;
}
.buy-price {
  color: #1eaf31;
}
.price-block {
  .vux-number-input {
    font-size: 13px;
  }
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  img {
    width: 50%;
    height: auto;
  }
}
</style>

