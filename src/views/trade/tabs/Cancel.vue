<template>
  <div class="trade-intrest">
    <div class="no-data" v-if="dataList.length <= 0">
      <img src="../../../assets/img/no-data.png" alt="">
    </div>
    <scroller v-else :lock-x="true" @on-scroll-bottom="reachBottom" class="scroll-container">
      <div>
        <div class="tab-content">
          <x-table :cell-bordered="false" style="background-color:#fff">
            <thead>
              <tr>
                <th>合约</th>
                <th>价格</th>
                <th>委托数量</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataList" :key="index" style="font-size: 13px">
                <td>
                  <div class="item">
                    <div class="name-item">{{item.code}}</div>
                    <div class="name-item">{{item.name}}</div>
                  </div>
                </td>
                <td>{{item.price}}</td>
                <td>{{item.volume}}</td>
                <td>{{item.status}}</td>
                <td @click="clickCode(item, index)" class="oprate">
                  <img v-if="item.cancel_flag == 1 || item.cancel_flag == '1'" src="../../../assets/img/chedan_2.png" alt="">
                  <img v-else src="../../../assets/img/chedan_1.png" alt="">
                  <!-- <img :src="item.cancel_flag === 1 ? '../../../assets/img/chedan_1.png' : '../../../assets/img/chedan_2.png'" alt=""> -->
                </td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <load-more tip="加载更多" :show-loading="loading" background-color="#fbf9fe"></load-more>
      </div>
    </scroller>
  </div>
</template>

<script>
import { ViewBox, Tab, TabItem, XTable, Flexbox, FlexboxItem, Scroller, LoadMore } from 'vux'
import ajax from '../../../plugins/ajax'
import { baseUtil } from '../../../util'
export default {
  name: 'Cancel',
  data () {
    return {
      minId: '',
      hasData: true,
      dataList: [],
      loading: false
    }
  },
  props: {

  },
  watch: {
  },
  mounted () {
    this.requestData(true)
  },
  methods: {
    requestData (isInit) {
      this.limit = true
      const param = {
        min_id: this.minId
      }
      ajax.CANCEL_CODE({
        param,
        success: (res) => {
          this.limit = false
          if (res.error_code === '0') {
            if (!res.data.dataList) {
              this.hasData = false
            } else {
              this.minId = res.data.minId
              if (isInit) {
                this.dataList = res.data.dataList
              } else {
                this.dataList.push(...res.data.dataList)
              }
            }
          }
        }
      })
    },
    reachBottom () {
      const type = this.tabIndex
      if (this.hasData) {
        this.requestData(type)
      }
    },
    number (val) {
      return Number(val)
    },
    clickCode (item, index) {
      const param = {
        order_id: item.order_id
      }
      ajax.CANCEL_ORDER({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            this.dataList.splice(index, 1)
          }
          this.$vux.toast.show({
            type: 'text',
            text: res.msg
          })
        }
      })
    }
  },
  components: {
    Tab,
    TabItem,
    XTable,
    Flexbox,
    FlexboxItem,
    Scroller,
    LoadMore,
    ViewBox
  }
};
</script>
<style lang="less" scoped>
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  img {
    width: 60%;
  }
}
.item {
  font-size: 13px;
  line-height: 18px;
}
.oprate {
  img {
    width: 20px;
  }
}
</style>

