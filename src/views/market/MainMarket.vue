<template>
  <view-box class="market-container">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">
      <div class="header-content">50ETF行情</div>
    </x-header>
    <flexbox class="market-header">
      <flexbox-item :span="1/3">
        <!-- <div class="title">50ETF</div> -->
        <div class="close" @click="navigateTo('/mainMarket')">
          {{mainTick.close}}
          <!-- <img src="../../assets/img/arrow-right.png" alt=""> -->
        </div>
      </flexbox-item>
      <flexbox :gutter="0" wrap="wrap" class="maket-detail">
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
    </flexbox>
    <div class="line">
      <div class="tab-line">
        <img :src="mainTick.time_line" alt="">
      </div>
      <!-- <div class="tips">
        <p>注意: 本页面行情存在延时，交易请以交易所实时价格为准</p>
      </div> -->
    </div>
    <!-- <flexbox>
      <flexbox-item :span="1/2">
        <div>最低</div>
        <stock-details :value="mainTick.change" modal="normal" />
      </flexbox-item>
      <flexbox-item :span="1/2">
        <div>最高</div>
        <stock-details :value="mainTick.change" modal="normal" />
      </flexbox-item>
    </flexbox> -->
  </view-box>
</template>
<script>
import { ViewBox, XHeader, Flexbox, FlexboxItem } from 'vux'
import StockDetails from '../../components/StockDetails'
import ajax from '../../plugins/ajax'
export default {
  data () {
    return {
      mainTick: {},
      timer: 0
    }
  },
  mounted () {
    const vm = this
    vm.requestData()
    if (vm.timer !== 0) {
      clearInterval(vm.timer)
    }
    vm.timer = setInterval(vm.requestData, 10000)
  },
  destroyed() {
    const vm = this
    clearInterval(vm.timer)
  },
  methods: {
    requestData () {
      ajax.M_MAIN_TICK({
        success: (res) => {
          if (res.error_code === '0') {
            this.mainTick = res.data
          }
        }
      })
    }
  },
  deactivated () {
    const vm = this
    clearInterval(vm.timer)
  },
  components: {
    ViewBox,
    XHeader,
    Flexbox,
    FlexboxItem,
    StockDetails
  }
}
</script>
<style lang="less">
.market-container {
  .market-header {
    background: #fff;
    padding-bottom: 10px;
    padding-top: 10px;
    .close {
      display: flex;
      font-size: 36px;
      text-align: center;
      color: #ea3939;
      align-items: center;
      justify-content: center;
    }
    .flex-item {
      font-size: 13px;
      line-height: 26px;
      // padding: 3px 0 3px 30px;
    }
    .title {
      text-align: center;
      padding: 10px 0;
    }
    .maket-detail {
      font-size: 12px;
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
.line {
  background-color: #fff;
}
.tab-line {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  img {
    width: 100%;
  }
}
.tips {
  padding: 15px 46px;
  font-size: 10px;
  color: #999;
}
</style>
