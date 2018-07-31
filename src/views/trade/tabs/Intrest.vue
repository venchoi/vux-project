<template>
  <div class="trade-intrest">
    <div class="no-data" v-if="data.dataList.length <= 0">
      <img src="../../../assets/img/no-data.png" alt="">
    </div>
    <div v-else :lock-x="true" @on-scroll-bottom="reachBottom" class="scroll-container">
      <div>
        <div class="tab-content">
          <x-table :cell-bordered="false" style="background-color:#fff;">
            <thead>
              <tr>
                <th>合约</th>
                <th>数量</th>
                <th>成本/现价</th>
                <th>市值/盈亏</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data.dataList" :key="index" @click="navigateTo(`/trade/sell?code=${item.code}`)">
                <td>
                  <div class="item">
                    <div class="name-item">{{item.code}}</div>
                    <div class="name-item">{{item.name}}</div>
                  </div>
                </td>
                <td>{{item.volume}}</td>
                <td>
                  <div class="item">
                    <div class="name-item">{{item.price_base}}</div>
                    <div class="name-item" :class="number(item.earn_money) > 0 ? 'rise' : 'drop'">{{item.price_now}}</div>
                  </div>
                </td>
                <td>
                  <div class="item">
                    <div class="name-item">{{item.money}}</div>
                    <div class="name-item" :class="number(item.earn_money) > 0 ? 'rise' : 'drop'">{{item.earn_money}}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XTable, Flexbox, FlexboxItem } from "vux";
import ajax from "../../../plugins/ajax";
import { baseUtil } from "../../../util";
export default {
  name: "Intrest",
  data() {
    return {
      data: {
        dataList: [],
        minId: "",
        hasData: true,
        timer: 0
      }
    };
  },
  props: {},
  watch: {},
  mounted() {
    const vm = this;
    vm.requestData();
    vm.timer = setInterval(vm.requestData, 10000);
    // vm.$emit(timer)
  },
  destroyed() {
    const vm = this
    clearInterval(vm.timer)
  },
  methods: {
    navigateTo (url) {
      this.$router.push(url)
    },
    requestData(isInit) {
      this.limit = true;
      ajax.OPEN_INTREST({
        success: res => {
          this.limit = false;
          if (res.error_code === "0") {
            if (res.data.length <= 0) {
              this.data.hasData = false;
            } else {
              // if (isInit) {
              this.data.dataList = res.data;
              // } else {
              // this.data.dataList.push(...res.data)
              // }
            }
          }
        }
      });
    },
    reachBottom() {
      const type = this.tabIndex;
      if (this.data[type].hasData) {
        this.requestData(type);
      }
    },
    number(val) {
      return Number(val);
    }
  },
  components: {
    Tab,
    TabItem,
    XTable,
    Flexbox,
    FlexboxItem
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
  padding: 10px;
  font-size: 13px;
  line-height: 18px;
}
.rise {
  color: #ea3939;
}
.drop {
  color: #1eaf31;
}
</style>

