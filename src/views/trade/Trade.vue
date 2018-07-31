<template>
  <view-box>
    <div class="grid" style="background-color:#fff;">
      <grid :show-vertical-dividers="false" :cols="4">
        <grid-item link="/trade/buy" :label="$t('买入')">
          <img slot="icon" src="../../assets/img/Trade_icon_buy@2x.png">
        </grid-item>
        <grid-item link="/trade/sell" :label="$t('卖出')">
          <img slot="icon" src="../../assets/img/Trade_icon_sall@2x.png">
        </grid-item>
        <grid-item link="/trade/cancel" :label="$t('撤单')">
          <img slot="icon" src="../../assets/img/Trade_icon_cancle@2x.png">
        </grid-item>
        <grid-item link="/trade/holding" :label="$t('持仓')">
          <img slot="icon" src="../../assets/img/Trade_icon_rep@2x.png">
        </grid-item>
        <grid-item link="/trade/queryCenter/drwt" :label="$t('委托查询')">
          <img slot="icon" src="../../assets/img/Trade_icon_delegate@2x.png">
        </grid-item>
        <grid-item link="/trade/queryCenter/drcj" :label="$t('成交查询')">
          <img slot="icon" src="../../assets/img/Trade_icon_search@2x.png">
        </grid-item>
      </grid>
    </div>
    <div class="table">
      <intrest></intrest>
      <!-- <load-more tip="" :show-loading="true" background-color="#fbf9fe"></load-more> -->
      <!-- <x-table :cell-bordered="false" style="background-color:#fff;">
        <thead>
          <tr>
            <th>合约</th>
            <th>数量</th>
            <th>成本/现价</th>
            <th>市值/盈亏</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tradeList" :key="index">
            <td>{{item}}</td>
            <td>{{item}}</td>
            <td>{{item}}</td>
            <td>{{item}}</td>
          </tr>
        </tbody>
      </x-table> -->
    </div>
  </view-box>
</template>
<script>
import { ViewBox, Grid, GridItem, XTable, LoadMore } from 'vux'
import ajax from '../../plugins/ajax'
import Intrest from './tabs/Intrest'
export default {
  data () {
    return {
      tradeList: []
    }
  },
  created () {
    // const param = {
    //   is_has_collect: 0
    // }
    // ajax.CODE_INFO_ALL({
    //   param,
    //   success: (res) => {
    //     console.log(res)
    //   }
    // })
  },
  components: {
    ViewBox,
    Grid,
    GridItem,
    XTable,
    LoadMore,
    Intrest
  }
}
</script>
<style lang="less">
.trade-tips {
  width: 100%;
  background-color: #fbf9fe;
}
</style>
