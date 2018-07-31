<template>
  <div>
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">
      {{title}}
    </x-header>
    <group>
      <x-input title="手机号" mask="999 9999 9999" :max="13" is-type="china-mobile" v-model="mobile"></x-input>
      <x-input title="验证码" v-model="check_code">
        <img slot="right-full-height" :src="imgCodeUrl" @click="changeImg">
      </x-input>
      <x-input title="发送验证码" class="weui-vcode" v-model="mobile_check_code">
        <x-button slot="right" type="primary" mini @click.native="sendSms">发送验证码</x-button>
      </x-input>
      <!-- <x-input v-if="type === 'register'" title="推荐码" type="password" v-model="inivte_code"></x-input> -->
      <x-input title="登录密码" type="password" v-model="password"></x-input>
    </group>
    <div class="button-container">
      <div class="button">
        <x-button @click.native="submit">{{ buttonTxt }}</x-button>
      </div>
    </div>
    <toast ref="toast" :type="toustType" :time="1500">{{toustTxt}}</toast>
  </div>
</template>
<script>
import { Group, XInput, XHeader, XButton, Toast } from 'vux'
import { user } from '../../model/storage'
import ajax from '../../plugins/ajax'
import { setTimeout } from 'timers';
export default {
  data() {
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
      toustTxt: '',
      toustType: ''
    }
  },
  mounted() {
    // const vm = this
    const type = this.$route.params.type
    if (type === 'register') {
      this.title = '注册'
      this.buttonTxt = '注册'
    }
    if (type === 'forget') {
      this.title = '忘记密码'
      this.buttonTxt = '确定'
    }
    this.changeImg()
  },
  methods: {
    submit() {
      const vm = this
      const type = vm.type
      const mobile = String(this.mobile).replace(/\s/g, '')
      const param = {
        mobile,
        mobile_check_code: this.mobile_check_code,
        password: this.password
      }
      if (type === 'register') {
        param.inivte_code = this.inivte_code
        ajax.REGISTER({
          param,
          success: (res) => {
            this.toustTxt = res.msg
            if (res.error_code === '0') {
              const token = res.data.token
              const uuid = res.data.uuid
              const mobile = res.data.mobile
              user.write({
                token,
                uuid,
                mobile
              })
              vm.$vux.toast.show({
                text: res.msg,
                type: 'text'
              })
              setTimeout(() => {
                vm.$router.push('/')
              }, 2000)
            } else {
              vm.$vux.toast.show({
                text: res.msg,
                type: 'cancel'
              })
              this.toustType = 'cancel'
            }
            // this.$refs.toast.show = true
          },
          fail(res) {
            this.$vux.toast.text(res.msg, 'middle')
          }
        })
      }
      if (type === 'forget') {
      }
    },
    sendSms() {
      const vm = this
      const mobile = String(this.mobile).replace(/\s/g, '')
      const param = {
        check_code_id: this.check_code_id,
        check_code: this.check_code,
        mobile
      }
      ajax.SEND_SMS({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            vm.$vux.toast.show({
              text: res.msg,
              type: 'text'
            })
          } else {
            vm.$vux.toast.show({
              text: res.msg,
              type: 'cancel'
            })
          }
        }
      })
    },
    changeImg() {
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
.vux-header-back {
  color: #fff !important;
}
.left-arrow {
  &::before {
    border-color: #fff !important;
  }
}
</style>

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
</style>

