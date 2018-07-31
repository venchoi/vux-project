<template>
  <div>
    <x-header :left-options="{showBack: false}" style="background-color:#EA3939;">自选
      <a slot="right" @click="navigateTo('/addStock')" style="color: #fff;">
        添加
      </a>
    </x-header>
    <div class="table">
      <!-- <load-more tip="" :show-loading="true" background-color="#fbf9fe"></load-more> -->
      <x-table :cell-bordered="false" style="background-color:#fff;">
        <thead>
          <tr>
            <th>合约</th>
            <th>到期日</th>
            <th>剩余天数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tradeList" :key="index" @click="navigateTo(`/marketDetails/${item.code}`)">
            <td>{{item.name}}</td>
            <td>{{item.end_date}}</td>
            <td>{{item.surplus_days}}</td>
          </tr>
        </tbody>
      </x-table>
    </div>
  </div>
</template>
<script>
import { XHeader, Cell, XTable } from 'vux'
import ajax from '../../plugins/ajax'
import { user } from '../../model/storage'
export default {
  data () {
    return {
      tradeList: []
    }
  },
  methods: {
    navigateTo (url) {
      this.$router.push(url)
    }
  },
  mounted () {
    const vm = this
    const userInfo = user.read()
    if (userInfo) {
      const param = {
        user_access_token: userInfo.token
      }
      ajax.GET_USER_CODE({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            this.tradeList = res.data
          }
        }
      })
    } else {
      vm.$router.push('/login/userLogin')
    }
  },
  components: {
    XHeader,
    XTable,
    Cell
  }
}
</script>
