<template>
  <div class="assets-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">我的资产
      <a slot="right" @click="navigateTo('/flowCenter/charge')" style="color:#fff;">
        资金流水
      </a>
    </x-header>
    <x-table class="asseets-table">
      <tbody>
        <tr>
          <td class="assets-td" colspan="2">
            <div class="th-title">总资产（元）</div>
            <div class="th-value">{{funds.total_funds}}</div>
          </td>
        </tr>
        <tr>
          <!-- <td class="assets-td">
            <div class="td-title">可用资金</div>
            <div class="td-value">{{funds.available_funds}}</div>
          </td>
          <td class="assets-td">
            <div class="td-title">冻结资金</div>
            <div class="td-value">{{funds.freeze_funds}}</div>
          </td> -->
        </tr>
        <tr>
          <td class="assets-td">
            <div class="td-title">持仓市值</div>
            <div class="td-value">{{funds.open_intrest_funds}}</div>
          </td>
          <td class="assets-td">
            <div class="td-title">浮动盈亏</div>
            <div class="td-value">{{funds.float_profit_loss}}</div>
          </td>
        </tr>
        <tr>
          <td class="assets-td">
            <div class="td-title">剩余资金</div>
            <div class="td-value">{{funds.balance_funds}}</div>
          </td>
          <td class="border-none" style="border-bottom: 0"></td>
          <!-- <td class="assets-td">
            <div class="td-title">累计推广收益</div>
            <div class="td-value">{{funds.spread_funds}}</div>
          </td> -->
        </tr>
      </tbody>
    </x-table>
    <flexbox class="btn-container" :gutter="20" justify="center" align="center">
      <flexbox-item>
        <x-button class="btn withdraw-btn" @click.native="navigateTo('/withdraw')">提现</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button class="btn recharge-btn" @click.native="navigateTo('/recharge')">充值</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { XHeader, XTable, XButton, Flexbox, FlexboxItem } from 'vux'
import ajax from '../../plugins/ajax'
export default {
  data () {
    return {
      funds: {}
    }
  },
  mounted () {
    ajax.USER_FUNDS({
      success: (res) => {
        if (res.error_code === '0') {
          this.funds = res.data
        }
      }
    })
  },
  methods: {
    navigateTo (url) {
      this.$router.push(url)
    }
  },
  components: {
    XHeader,
    XTable,
    XButton,
    Flexbox,
    FlexboxItem
  }
}
</script>
<style lang="less" scoped>
.assets-page {
  background-color: #fff;
  padding-bottom: 10px;
}
.asseets-table {
  .assets-td {
    padding: 10px;
    width: 50%;
    text-align: left;
  }
  .th-title,
  .td-title {
    height: 30px;
    font-size: 14px;
    color: #999;
  }
  .th-value {
    margin-bottom: 8px;
    font-size: 30px;
    text-align: center;
  }
  .td-value {
    font-size: 18px;
    color: #333;
  }
}
.btn-container {
  margin: 20px auto;
  width: 70%;
}
.btn {
  color: #fff;
}
.withdraw-btn {
  background-color: #ffbc24;
}
.recharge-btn {
  background-color: #ea3939;
}
.border-none::before {
  border-bottom: none;
}
</style>
