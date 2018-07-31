<template>
  <div class="trade-search">
    <tab :line-width=2 active-color='#eb3939' :scroll-threshold=5>
      <tab-item :selected="tabIndex === index" @click.native="changeIndex(index);" v-for="(item, index) in data" :key="item.name">{{item.name}}</tab-item>
    </tab>
    <div class="tab-container">
      <div class="no-data" v-if="data[tabIndex].dataList.length <= 0">
        <img src="../../../assets/img/no-data.png" alt="">
      </div>
      <scroller v-else :lock-x="true" @on-scroll-bottom="reachBottom" class="scroll-container">
        <div>
          <div class="tab-content" v-if="tabIndex === 'drwt'|| tabIndex === 'drcj'">
            <x-table :cell-bordered="false" style="background-color:#fff;">
              <thead>
                <tr>
                  <th>合约</th>
                  <th>价格</th>
                  <th>数量</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in data[tabIndex].dataList" :key="index">
                  <td>
                    <div class="order-name">
                      <div class="name-item">{{item.code}}
                        <span class="name-type" :class="item.order_type === '0' ? 'buy-type': 'sell-type'">{{item.order_type === '0' ? '买入': '卖出'}}</span>
                      </div>
                      <div class="name-item">{{item.name}}</div>
                      <div class="name-item">{{item.date}} {{item.time}}</div>
                    </div>
                  </td>
                  <td>{{item.price}}</td>
                  <td>{{item.volume}}</td>
                  <td>{{item.status}}</td>
                </tr>
              </tbody>
            </x-table>
          </div>
          <div class="tab-content" v-if="tabIndex === 'lswt' || tabIndex === 'lscj'">
            <x-table :cell-bordered="false" style="background-color:#fff;">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>合约</th>
                  <th>价格</th>
                  <th>数量</th>
                  <th v-if="tabIndex === 'lswt'">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in data[tabIndex].dataList" :key="index">
                  <td>
                    <div class="order-time">
                      <div class="time time-date">{{item.date}}</div>
                      <div class="time time-time">{{item.time}}</div>
                    </div>
                  </td>
                  <td>
                    <div class="order-name">
                      <div class="name-item">{{item.code}}
                        <span class="name-type" :class="item.order_type === '0' ? 'buy-type': 'sell-type'">{{item.order_type === '0' ? '买入': '卖出'}}</span>
                      </div>
                      <div class="name-item">{{item.name}}</div>
                    </div>
                  </td>
                  <td>{{item.price}}</td>
                  <td>{{item.volume}}</td>
                  <td v-if="tabIndex === 'lswt'" class="status">{{item.status}}</td>
                </tr>
              </tbody>
            </x-table>
          </div>
        </div>
        <load-more tip="加载更多" :show-loading="loading" background-color="#fbf9fe"></load-more>
      </scroller>
    </div>
  </div>
</template>

<script>
const tab = ["drwt", "lswt", "drcj", "lscj"];
const tabMap = {
  drwt: 0,
  lswt: 1,
  drcj: 2,
  lscj: 3
};
import {
  Tab,
  TabItem,
  XTable,
  Flexbox,
  FlexboxItem,
  LoadMore,
  Scroller
} from "vux";
import ajax from "../../../plugins/ajax";
import { baseUtil } from "../../../util";
export default {
  name: "Search",
  data() {
    return {
      tabIndex: this.$route.params.type,
      data: {
        drwt: {
          name: "当日委托",
          minId: "",
          dataList: [],
          hasData: true
        },
        lswt: {
          name: "历史委托",
          minId: "",
          dataList: [],
          hasData: true
        },
        drcj: {
          name: "当日成交",
          minId: "",
          dataList: [],
          hasData: true
        },
        lscj: {
          name: "历史成交",
          minId: "",
          dataList: [],
          hasData: true
        }
      },
      loading: false,
      laodingTxt: "加载更多",
      limit: false
    };
  },
  props: {
    type: ""
  },
  watch: {},
  mounted() {
    const vm = this;
    vm.requestData(vm.tabIndex, true)
  },
  methods: {
    changeIndex(index) {
      this.tabIndex = index;
      this.requestData(index, false)
    },
    requestData(type, isInit, cb) {
      const vm = this;
      if (!this.limit) {
        this.limit = true;
        const param = {
          min_id: this.data[type].minId,
          type: type
        };
        ajax.USER_CODE_SEARCH({
          param,
          success: res => {
            this.limit = false;
            if (res.error_code === "0") {
              if (res.data.length <= 0) {
                this.data[type].hasData = false;
              } else {
                const data = res.data;
                this.data[type].minId = data.minId;
                if (isInit) {
                  this.data[type].dataList = data.dataList;
                } else {
                  this.data[type].dataList.push(...data.dataList);
                }
              }
              if (typeof cb === "function") {
                cb();
              }
            }
          }
        });
      }
    },
    reachBottom() {
      const type = this.tabIndex;
      if (this.data[type].hasData) {
        this.requestData(type);
      }
    }
  },
  components: {
    Tab,
    TabItem,
    XTable,
    Flexbox,
    FlexboxItem,
    LoadMore,
    Scroller
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
.order-name {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .name-item {
    padding-left: 16px;
    font-size: 12px;
    line-height: 18px;
    word-break: keep-all;
    .name-type {
      display: inline-block;
      width: 30px;
      color: #fff;
      border-radius: 3px;
    }
    .buy-type {
      background: #ea3939;
    }
    .sell-type {
      background: #1eaf31;
    }
  }
}
.order-time {
  .time {
    padding-left: 16px;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
  }
  .time-date {
  }
  .time-time {
    color: #999;
  }
}
.status {
  font-size: 12px;
}
</style>

