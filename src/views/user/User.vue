<template>
  <div class="user-page">
    <div class="avatar-container">
      <p class="center"><img src="../../assets/img/contract_avatar.png"></p>
    </div>
    <group>
      <cell is-link :title="$t('我的资产')" link="/userAssets"></cell>
      <!-- <cell is-link :title="$t('实名认证')" link="/user/card"></cell> -->
      <cell is-link :title="$t('银行卡绑定')" link="/card"></cell>
      <!-- <cell is-link :title="$t('我的推荐码')" link=""></cell> -->
      <cell is-link :title="$t('登录密码')" link="/user/setLoginPwd"></cell>
      <cell is-link :title="$t('提现密码')" link="/user/setWithPwd"></cell>
      <!-- <cell is-link :title="$t('关于我们')" link="/aboutUs"></cell> -->
      <cell is-link :title="$t('安全退出')" @click.native="logout()"></cell>
    </group>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" :title="$t('提示')" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ $t('确定要退出吗？') }}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import { Group, Cell, Blur, Confirm, TransferDomDirective as TransferDom } from 'vux'
import { user } from '../../model/storage'
import ajax from '../../plugins/ajax'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      images: [
        'https://o3e85j0cv.qnssl.com/tulips-1083572__340.jpg',
        'https://o3e85j0cv.qnssl.com/waterway-107810__340.jpg',
        'https://o3e85j0cv.qnssl.com/hot-chocolate-1068703__340.jpg'
      ],
      url: '../../assets/img/contract_avatar.png',
      showConfirm: false
    }
  },
  created () {
    const vm = this
    const userInfo = user.read()
    if (!userInfo) {
      this.$router.push('/login/userLogin')
    }
  },
  methods: {
    logout () {
      this.showConfirm = true
    },
    onConfirm () {
      ajax.LOGOUT({
        success: (res) => {
          if (res.error_code === '0') {
            user.clear()
            this.$router.go(-1)
          }
        }
      })
    }
  },
  components: {
    Group,
    Cell,
    Blur,
    Confirm
  }
}
</script>
<style lang="less">
.avatar-container {
  background-color: #ea3939;
  padding-bottom: 30px;
}
.center {
  text-align: center;
  padding-top: 50px;
  color: #fff;
  font-size: 18px;
}
.center img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ececec;
}
</style>


