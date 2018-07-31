<template>
  <div>
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">添加自选</x-header>
    <search placeholder="请输入合约代码或简称" :auto-fixed="false" ref="search" @on-change="getResult" v-model="keyword"></search>
    <div class="table">
      <x-table :cell-bordered="false" style="background-color:#fff;">
        <tbody>
          <tr v-for="(item, index) in tradeList" :key="index" @click="navigateTo(`/marketDetails/${item.code}`)">
            <td v-if="item.is_user_code == 1" @click.stop="operate(item, 0)" class="icon-container">
              <x-icon type="ios-checkmark" class="icon checkmark-icon"></x-icon>
            </td>
            <td v-else @click.stop="operate(item, 1)" class="icon-container">
              <x-icon type="ios-plus" class="icon cell-x-icon"></x-icon>
              <!-- <span class="icon-container"><img class="icon-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACN0lEQVR4Ac2ZBZJUMRCGg7tLKXqYdHdere+WYmVbhrtDcRHcjoAdAbcDYGW4pB8W+JF1yUxm5qWr/t3Rzhf/kzH1RnBujbLb7onPKclNtfLkt94qyXslfqpWbnnrziu73VoU600rIrS1LS9JjquVu95yqEVq5YEnORW6ulY2A2xuSXIYrTMJSAQof0Qlw8aN8xoCp1y0e8svkLyhInlVctGdBPen1Sz/RMJmCLnRmrV36ZYtsz3xJSRpiYivhr6+OdGASXAJkNHd2lq4QZUkxyaBcx2JYy59TFrpHHcp8cQvUwrAGhf6+2ckdvVLsIxuPXZHU1sgiKxIBYTAMgwOiZXkQy6A2BCwaw3OWnYn8UYugFBp+cTgbkFyPzdA7PcG4dva1uGF3AAhOCa03s5cAWHnDDxbroCe5KyBscy2BYlvGLjfjAEfmRgTGvr65kcphCn/19UYTVa2krwxavldBOCiILJwUg0CLowRyo4AlCe5d/HNfAHlet7LjJUzRsntyLYFrWwznjvX5goY2tpWG4QS38sNUEnumP8Ba5MZ4PDzCcwhFs1cALE+hq6uZcMtv5Uj2Vh+ywfHPjRZflE9oDzHIX7ce5iUY6eSlFDC938oFcXEZ2N2hyo8uB+IvPqQi60HdOdNbASRWa2EBBzKNLUGuhvjollgyP2nW1NCRdqacYGJ2To4IRID076BV8DvsM4hZ16X6CR3sH0N7hCRkf4zhJyFsYT7hUWH8Bivwc/BMv1xJXXGLyz0XDHp/MB2AAAAAElFTkSuQmCC" alt="添加"></span> -->
            </td>
            <td>{{item.code}}</td>
            <td>{{item.name}}</td>
          </tr>
        </tbody>
      </x-table>
    </div>
  </div>
</template>
<script>
import { XHeader, Cell, XTable, Search, Icon } from 'vux'
import ajax from '../../plugins/ajax'
import { user } from '../../model/storage'
import { baseUtil } from '../../util'
export default {
  data () {
    return {
      tradeList: [],
      keyword: ''
    }
  },
  mounted () {
    this.requestData()
  },
  methods: {
    requestData () {
      const param = {
        is_has_collect: 1,
        keyword: this.keyword
      }
      ajax.CODE_INFO_ALL({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            this.tradeList = res.data
          }
        }
      })
    },
    navigateTo (url) {
      this.$router.push(url)
    },
    operate (item, type) {
      const vm =  this
      const copyOfItem = item
      const userInfo = user.read()
      if (!userInfo) {
        this.$router.push(`/login/userLogin`)
      } else {
        const param = {
          code: item.code,
          is_collect: type
          // user_access_token: userInfo.token
        }
        ajax.DO_USER_CODE({
          param,
          success: (res) => {
            if (copyOfItem.is_user_code) {
              copyOfItem.is_user_code = 0
            } else {
              copyOfItem.is_user_code = 1
            }
            baseUtil.merge(item, copyOfItem)
            vm.$vux.toast.show({
              text: res.msg,
              type: 'text'
            })
          }
        })
      }
    },
    getResult () {
      this.requestData()
    }
  },
  components: {
    XHeader,
    XTable,
    Cell,
    Search,
    Icon
  }
}
</script>
<style lang="less" scoped>
// .icon-container {
  // display: flex;
  // padding-top: 3.5px;
// }
.icon-img {
  height: 20px;
  width: auto;
}
.icon {
  transform: translate(0, 5px);
}
.checkmark-icon {
  fill: #09bb07;
}
.cell-x-icon {
  fill: #eb3939;
}
</style>

