<template>
  <div class="login-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">
      登录
    </x-header>
    <group>
      <x-input title="手机号" mask="999 9999 9999" :max="13" is-type="china-mobile" v-model="account"></x-input>
      <x-input title="密码" type="password" v-model="password"></x-input>
    </group>
    <div class="actions-container">
      <div class="actions">
        <x-button type="primary" @click.native="login">登录</x-button>
        <div class="other-ways">
          <div class="forget" @click="navigaTo('/form/forget')">忘记密码</div>
          <div class="register" @click="navigaTo('/form/register')">立即注册</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XHeader, Group, XInput, XButton, Toast } from 'vux'
import ajax from '../../plugins/ajax'
import { user, rate } from '../../model/storage'
// import baseUtil from '../../util/baseUtil'
export default {
  data () {
    return {
      account: '',
      password: '',
      toustType: '',
      toustTxt: ''
    }
  },
  mounted () {
    const userInfo = user.read()
  },
  methods: {
    navigaTo (url) {
      this.$router.push(url)
    },
    login () {
      const vm = this
      const account = String(this.account).replace(/\s/g, '')
      const param = {
        account,
        password: this.password
      }
      ajax.LOGIN({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            const token = res.data.token
            const uuid = res.data.uuid
            const mobile = res.data.mobile
            user.write({
              token,
              uuid,
              mobile
            })
            this.$vux.toast.text('登录成功', 'middle')
            vm.$router.go(-1)
          } else {
            // this.toustTxt = res.msg
            // this.toustType = 'cancel'
            // this.$refs.toast.show = true
            this.$vux.toast.show({
              text: res.msg,
              type: 'cancel'
            })
          }
        }
      })
    }
  },
  components: {
    XHeader,
    Group,
    XInput,
    XButton,
    Toast
  }
}
</script>
<style lang="less">
.vux-header-back {
  color: #fff !important;
}
.left-arrow {
  &::before {
    border-color: #fff !important;
  }
}
</style>
<style lang="less" scope>
.actions-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.actions {
  width: 90%;
}
.other-ways {
  display: flex;
  justify-content: space-between;
}
</style>

