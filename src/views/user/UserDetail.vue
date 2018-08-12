<template>
  <div>
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">{{title}}</x-header>
    <div class="account-contaienr">
      <span>注册手机号</span>
      <span>{{mobile}}</span>
    </div>
    <group>
      <!-- <x-input title="手机号" mask="999 9999 9999" :max="13" is-type="china-mobile" v-model="mobile"></x-input> -->
      <x-input title="验证码" v-model="check_code">
        <img slot="right-full-height" :src="imgCodeUrl" @click="changeImg">
      </x-input>
      <x-input title="短信验证码" class="weui-vcode" v-model="mobile_check_code">
        <x-button slot="right" type="primary" mini @click.native="sendSms" style="background: #EA3939;color:#fff">发送验证码</x-button>
      </x-input>
      <x-input v-if="type === 'register'" title="推荐码" type="password" v-model="inivte_code"></x-input>
      <x-input :title="pswTitle" type="password" v-model="password"></x-input>
    </group>
    <div v-if="type === 'setWithPwd'" class="tips">为了账户安全，请不要设置与登录密码相同的提现密码</div>
    <div class="button-container">
      <div class="button">
        <x-button type="primary" @click.native="submit" style="background: #EA3939;color:#fff">确定</x-button>
      </div>
    </div>
    <!-- <toast ref="toast" :type="toustType" :time="1500">{{toustTxt}}</toast> -->
  </div>
</template>
<script>
import { Group, XInput, XHeader, XButton, Toast } from 'vux'
import ajax from '../../plugins/ajax'
import { user } from '../../model/storage'
// import { setTimeout } from 'timers'
export default {
  data () {
    return {
      type: this.$route.params.type,
      title: '',
      buttonTxt: '',
      mobile: '',
      mobile_check_code: '',
      password: '',
      inivte_code: '',
      imgCodeUrl: '',
      check_code_id: '',
      check_code: '',
      pswTitle: '',
      toustType: '',
      toustTxt: ''
    }
  },
  mounted () {
    // const vm = this
    const type = this.$route.params.type
    const userInfo = user.read()
    if (type === 'setLoginPwd') {
      this.title = '重置登录密码'
      this.buttonTxt = '注册'
      this.pswTitle = '设置登录密码'
    }
    if (type === 'setWithPwd') {
      this.title = '重置提现密码'
      this.buttonTxt = '确定'
      this.pswTitle = '设置提现密码'
    }
    this.mobile = userInfo.mobile
    this.changeImg()
  },
  methods: {
    submit () {
      const vm = this
      const type = vm.type
      // const mobile = String(this.mobile).replace(/\s/g, '')
      const param = {
        // mobile,
        mobile_check_code: this.mobile_check_code,
        password: this.password
      }
      if (type === 'setLoginPwd') {
        ajax.RESET_PSW({
          param,
          success: (res) => {
            this.toustTxt = res.msg
            if (res.error_code === '0') {
              this.toustType = 'success'
              this.$refs.toast.show = true
              setTimeout(() => {
                vm.$router.go(-1)
              }, 2000)
            } else {
              this.toustType = 'cancel'
              this.$refs.toast.show = true
            }
          }
        })
      }
      if (type === 'setWithPwd') {
        ajax.WITHDRAW_PSW({
          param,
          success: (res) => {
            if (res.error_code === '0') {
              this.$vux.taost.show({
                text: res.msg,
                type: 'text'
              })
            } else {
              this.$vux.taost.show({
                text: res.msg,
                type: 'cancel'
              })
            }
          }
        })
      }
    },
    sendSms () {
      // const mobile = String(this.mobile).replace(/\s/g, '')
      const param = {
        check_code_id: this.check_code_id,
        check_code: this.check_code,
        mobile: ''
      }
      ajax.SEND_SMS({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            this.$vux.toast.show({
              text: res.msg,
              type: 'text'
            })
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: 'cancel'
            })
          }
        }
      })
    },
    changeImg () {
      ajax.GET_IMG_CODE({
        success: (res) => {
          this.imgCodeUrl = `http://${res.data.img_url}`
          this.check_code_id = res.data.user_token
        }
      })
    }
  },
  components: {
    Group,
    XInput,
    XHeader,
    XButton,
    Toast
  }
}
</script>
<style lang="less">
.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button {
  width: 80%;
}
.account-contaienr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  margin: 20px 0;
  margin-bottom: 0;
  background: #fffad9;
  height: 40px;
}
.tips {
  margin-top: 10px;
  font-size: 13px;
  text-align: center;
  color: #999;
}
</style>

