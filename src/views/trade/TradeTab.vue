<template>
  <view-box>
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">交易</x-header>
    <tab :line-width=2 active-color='#eb3939' :scroll-threshold=5>
      <tab-item :selected="tab === 'buy'" @click.native="changeRoute('buy')">买入</tab-item>
      <tab-item :selected="tab === 'sell'" @click.native="changeRoute('sell')">卖出</tab-item>
      <tab-item :selected="tab === 'holding'" @click.native="changeRoute('holding')">持仓</tab-item>
      <tab-item :selected="tab === 'cancel'" @click.native="changeRoute('cancel')">撤单</tab-item>
      <tab-item :selected="tab === 'queryCenter'" @click.native="changeRoute('queryCenter', 'drwt')">查询</tab-item>
    </tab>
    <div>
      <div class="buy-container" v-show="tab === 'buy'">
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
              <span>
                <stock-details :value="ratio" boundary="0" unit="%" :prefix="true" modal="normal"/>
              </span>
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
                    <div class="input" :class="{active: priceType === 1}" @click="priceType = 1;buyPrice = 0">市价</div>
                    <div class="market-price" :class="{active: priceType === 0}" @click="priceType = 0;buyPrice = Number(sellStage[4].price)">限价</div>
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
                      <x-number v-model="buyPrice" :step="step" style="padding:0;font-size:13px;width:100%" width="calc(100% - 80px)" number-button-font-color="#999" :fillable="fillable"></x-number>
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
                    <x-number v-model="volume" style="padding:0;font-size:13px;width:100%" width="calc(100% - 80px)" fillable></x-number>
                  </group>
                </flexbox-item>
              </flexbox>
              <flexbox justify="space-between">
                <flexbox-item>
                  <div style="text-align:left;color:#999;font-size:14px;margin-top:8px;margin-left:10px">委托费用: {{totalAmount}}</div>
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
          <x-button style="background:#eb3939;color:#fff" @click.native="buy">买入</x-button>
        </group>
      </div>
      <div class="sell-container" v-show="tab === 'sell'">
        <sell :intrestList="intrestList" :copyOfIntrestList="copyOfIntrestList" :code="code"></sell>
      </div>
      <div class="holding-container" v-show="tab === 'holding'">
        <intrest></intrest>
      </div>
      <div class="cancel-container" v-show="tab === 'cancel'">
        <cancel></cancel>
      </div>
      <div class="queryCenter-container" v-show="tab === 'queryCenter'">
        <search :type="type" v-if="tab === 'queryCenter'"></search>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showCodeList" position="bottom" max-height="50%">
        <!-- <popup-header left-text="取消" right-text="确定" title="请选择产品" :show-bottom-border="false" @on-click-left="showCodeList = false" @on-click-right="showCodeList = false"></popup-header> -->
        <group gutter="0">
          <radio :options="codeList" v-model="code"></radio>
        </group>
      </popup>
    </div>
  </view-box>
</template>
<script>
import {
  ViewBox,
  TransferDom,
  Group,
  XHeader,
  Tab,
  TabItem,
  Selector,
  XInput,
  XNumber,
  Icon,
  Popup,
  PopupHeader,
  Radio,
  Grid,
  GridItem,
  XButton,
  Flexbox,
  FlexboxItem,
  XTable
} from "vux";
import ajax from "../../plugins/ajax";
import { baseUtil } from "../../util";
import Sell from "./tabs/Sell";
import Search from "./tabs/Search";
import Intrest from "./tabs/Intrest";
import Cancel from "./tabs/Cancel";
import StockDetails from "../../components/StockDetails";
import { rate } from "../../model/storage";

const tabIndexMap = {
  buy: 0,
  sell: 1,
  holding: 2,
  cancel: 3,
  queryCenter: 4
};
const typeIndexMap = {
  dailyEntrust: 0,
  historyEntrust: 1,
  dailyDealing: 2,
  historyDealing: 3
};
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      tab: this.$route.params.tab,
      type: this.$route.params.type,
      tabIndex: 0,
      typeIndex: this.$route.params.type,
      showCodeList: false,
      keyword: "",
      codeList: [],
      allCodeList: {},
      searchList: {},
      code: this.$route.query.code,
      inputCode: "",
      close: 0,
      preClose: 0,
      ratio: 0.0,
      exepx: 0,
      endDate: "",
      remainDay: "",
      hasThisCode: false,
      list2: ["分时线", "日K", "周K", "月K"],
      index1: 0,
      lines: [],
      sellStage: [],
      buyStage: [],
      tickData: {},
      price: 0,
      volume: 1,
      intrestList: [],
      copyOfIntrestList: {},
      buyPrice: 0,
      step: 0,
      fillable: false,
      totalAmount: 0,
      limit: false,

      priceType: 1
      // sell
      // sellInputCode: '',
      // sellKeyword: ''
    };
  },
  watch: {
    "$route": "routeChange",
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
      this.inputCode = this.code;
      if (this.allCodeList[this.code]) {
        this.keyword = this.allCodeList[this.code].name;
      }
    },
    inputCode() {
      this.code = this.inputCode;
      this.requestCode(false);
    },
    buyPrice() {
      if (this.priceType === 0) {
        const price = this.buyPrice
        const volume = this.volume
        this.totalAmount = this.accMul(this.accMul(price, volume), 10000)
      } else {
        this.totalAmount = ''
      }
    },
  },
  mounted() {
    this.tabIndex = tabIndexMap[this.$route.params.tab];
    // this.typeIndex = typeIndexMap[this.$route.params.type]
    this.requestCodeList(true);
    this.requestIntrestList();
    for (let i = 1; i < 6; i++) {
      const buy = {
        name: `buy${i}`,
        index: i,
        count: 0,
        price: 0
      };
      const sell = {
        name: `sell${i}`,
        index: i,
        count: 0,
        price: 0
      };
      this.buyStage.push(buy);
      this.sellStage.unshift(sell);
    }
    if (this.code) {
      this.inputCode = this.code
      this.requestCode()
    }
  },
  methods: {
    changePrice(price) {
      this.priceType = 0
      this.buyPrice = Number(price)
    },
    accMul(arg1, arg2) {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length
      } catch (e) {
      }
      try {
        m += s2.split(".")[1].length
      } catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    routeChange() {
      this.tab = this.$route.params.tab
      this.tabIndex = tabIndexMap[this.$route.params.tab]
    },
    priceChange() {
      return false;
    },
    requestIntrestList(isInit) {
      ajax.OPEN_INTREST({
        success: res => {
          if (res.error_code === "0") {
            if (res.data.length > 0) {
              const data = res.data;
              const tmp = {};
              baseUtil.each(data, (code, index) => {
                code.value = `${code.code} ${code.name}`;
                code.key = code.code;
                const key = code.key;
                tmp[key] = code;
              });
              this.intrestList = res.data;
              this.copyOfIntrestList = tmp
            }
          }
        }
      });
    },
    requestCode() {
      const param = {
        code: this.inputCode
      };
      ajax.M_LAST_TICK({
        param,
        success: res => {
          if (res.error_code === "0" && res.data) {
            const data = res.data;
            this.hasThisCode = false;
            this.lines = [];
            if (data.code) {
              this.hasThisCode = true;
              this.close = data.close;
              this.preClose = data.pre_close;
              this.price = Number(data.close);
              this.ratio = data.ratio;
              this.exepx = data.exepx;
              this.endDate = data.expiredate;
              this.remainDay = data.surplus_days;
              this.keyword = data.name;
              baseUtil.each(data.lines, line => {
                this.lines.push(line);
              });
              const tickData = res.data;
              this.tickData = tickData;
              const buyStage = [];
              const sellStage = [];
              for (let i = 1; i < 6; i++) {
                const buyCount = `buy${i}_count`;
                const buyPrice = `buy${i}_price`;
                const sellCount = `sell${i}_count`;
                const sellPrice = `sell${i}_price`;
                const buy = {
                  name: `buy${i}`,
                  index: i,
                  count: tickData[buyCount],
                  price: tickData[buyPrice]
                };
                const sell = {
                  name: `sell${i}`,
                  index: i,
                  count: tickData[sellCount],
                  price: tickData[sellPrice]
                };
                buyStage.push(buy);
                sellStage.unshift(sell);
              }
              this.buyStage = buyStage;
              this.sellStage = sellStage;
              if (this.priceType === 0) {
                this.buyPrice = Number(sellStage[4].price)
              }
            }
          }
        }
      });
    },
    requestCodeList(isIndex) {
      const param = {
        is_has_collect: 1,
        keyword: this.keyword
      };
      ajax.CODE_INFO_ALL({
        param,
        success: res => {
          if (res.error_code === "0") {
            const data = res.data;
            const tmp = {};
            baseUtil.each(data, (code, index) => {
              code.value = `${code.code} ${code.name}`;
              code.key = code.code;
              const key = code.key;
              tmp[key] = code;
            });
            if (isIndex) {
              this.codeList = res.data;
              this.allCodeList = tmp;
            } else {
              this.searchList = tmp;
            }
          }
        }
      });
    },
    changeRoute(tab, type) {
      this.tab = tab;
      if (tab === "queryCenter") {
        this.type = type;
        // this.typeIndex = typeIndexMap[type]
        this.typeIndex = tab;
        this.$router.replace(`/trade/${tab}/${type}`);
      } else {
        this.$router.replace(`/trade/${tab}`);
      }
    },
    navigateTo(url) {
      this.$router.push(url);
    },
    selectCode() {
      this.showCodeList = true;
    },
    openOrder() {
      const param = {
        price_type: this.priceType,
        code: this.code,
        price: this.buyPrice,
        volume: this.volume
      };
      ajax.OPEN_ORDER({
        param,
        success: res => {
          this.$vux.toast.show({
            text: res.msg,
            type: "text"
          });
          this.limit = false
        },
        fail: () => {
          this.limit = false
        }
      });
    },
    buy() {
      if (this.code && this.code.length > 0 && ! this.limit) {
        this.limit = true
        const vm = this;
        const poundage = rate.read().trade_buy_open_rate;
        const servicePrice = Number(vm.volume) * poundage;
        const price = vm.priceType === 1 ? '市价' : vm.price
        const totalAmount = vm.priceType === 1 ? '' : vm.totalAmount
        const content = `<div class="confirm-item" style="text-align:left">交易方向：买入开仓</div>
        <div class="confirm-item" style="text-align:left">合约代码：${vm.code}</div>
        <div class="confirm-item" style="text-align:left">合约名称：${vm.keyword}</div>
        <div class="confirm-item" style="text-align:left">剩余天数：${vm.remainDay}</div>
        <div class="confirm-item" style="text-align:left">委托价格：${price}</div>
        <div class="confirm-item" style="text-align:left">委托数量：${vm.volume}</div>
        <div class="confirm-item" style="text-align:left">委托费用：${totalAmount}</div>
        <div class="confirm-item" style="text-align:left">总手续费：${servicePrice}</div>
        <div class="confirm-item" style="text-align:left">注：持仓递延费休市后按实际持仓张数收取，${poundage}元/张，仅交易日收取</div>`;
        this.$vux.confirm.show({
          title: "交易确认",
          content,
          onConfirm: () => {
            vm.openOrder();
          },
          onCancel: () => {
            this.limit = false
          }
        });
      } else {
        this.$vux.toast.show({
          text: "请输入正确的期权代码",
          type: "text"
        });
        this.limit = false
      }
    },
    codeChange() { },
    sell() { }
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
    Sell,
    Search,
    Intrest,
    Cancel,
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
.confirm-item {
  text-align: left;
}
</style>
