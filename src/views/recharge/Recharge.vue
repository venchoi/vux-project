<template>
  <div class="recharge-page">
    <view-box class="news-list-page">
      <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">充值</x-header>
      <div class="application">
        <group>
          <x-input title="充值金额" v-model="amount">
            <div slot="right-full-height" class="service">
              <span class="service-title">手续费:</span>  
              <span class="service-charge">{{charge}}</span>  
            </div>  
          </x-input>  
        </group>  
        <group>
          <checklist :max=1 label-position="left" :options="typeList" v-model="payWay"></checklist>  
        </group>  
        <div class="bottom-tips">  
          <div>您的帐户资金将通过第三方平台充值，监管。如遇充值额度问题请联系客服。</div>  
          <div>通过支付宝充值单笔额度在10到20000（含2万），总额充不限。</div>  
        </div>  
        <div class="btn-container">  
          <x-button type="primary" @click.native="pay" style="width:80%;background: #EA3939;color:#fff">充值</x-button>  
        </div>  
        <popup v-model="infoShow" height="70%">  
          <div class="pay-info">  
            <popup-header :left-text="$t('取消')" :title="$t('确认付款')" :show-bottom-border="false" @on-click-left="infoShow = false" />  
            <div class="pay-amount">{{amount}}</div>  
            <cell title="订单信息" value="充值" @click.native="onClick"></cell>  
            <cell title="付款方式" @click.native="rechargeWay('bind')" value="绑定银行卡" is-link></cell>  
            <cell title="已绑定充值卡" @click.native="rechargeWay('choose')" :value="bankTips" is-link></cell>  
            <div class="pay-btn-container" v-if="!needBind">  
              <x-button type="primary" @click.native="send">确认支付</x-button>  
            </div>  
          </div>  
        </popup>  
        <popup v-model="bindCardShow" height="70%">  
          <div class="pay-info">  
            <popup-header :left-text="$t('关闭')" :title="$t('绑定银行卡')" :show-bottom-border="false" @on-click-left="bindCardShow = false" />
            <x-input title="开户名" placeholder="请输入开户名" placeholder-align="right" v-model="bindCardformData.name"></x-input>  
            <x-input title="身份证" placeholder="请输入身份证" placeholder-align="right" v-model="bindCardformData.idCardNo"></x-input>  
            <x-input title="银行名称" v-model="bankName">  
              <x-icon slot="right" type="ios-arrow-right" class="right-icon" @click="selectCode"></x-icon>  
            </x-input>  
            <!-- <popup-picker @on-change="bankChange()" popup-title="选择银行卡" title="银行名称" :data="bankList" :columns="1" ref="bankPicker" v-model="bindCardformData.bank" :value="bankItem"></popup-picker> -->  
            <x-input title="银行卡号" placeholder="请输入银行卡号" placeholder-align="right" v-model="bindCardformData.cardNo"></x-input>  
            <x-address title="开户行所在地区" v-model="bindCardformData.address" :list="addressData" placeholder="请选择地址" :popup-style="{zIndex: 502}"></x-address>  
            <x-input title="手机号" placeholder="请输入手机号" placeholder-align="right" v-model="bindCardformData.phoneNo"></x-input>  
            <x-input title="验证码" class="weui-vcode" v-model="bindCardformData.vericode">  
              <x-button slot="right" type="primary" mini @click.native="sendSms">发送验证码</x-button>  
            </x-input>  
            <div class="pay-btn-container" v-if="needBind || isBind">  
              <x-button type="primary" @click.native="check">确认并付款</x-button>  
            </div>  
          </div>  
        </popup>  
        <div v-transfer-dom>  
          <popup v-model="showBankList" position="bottom" max-height="70%">  
            <popup-header right-text="确定" :show-bottom-border="false" @on-click-right="showBankList = false"></popup-header>  
            <group gutter="0">  
              <radio :options="bankList" v-model="bankName" @click="radioSelect"></radio>  
            </group>  
          </popup>  
        </div>
        <popup class="iframe" v-model="showIframe" height="85%">
          <iframe :src="src" frameborder="0" style="width:100%;height:100%;"></iframe>
        </popup>
      </div>
    </view-box>  
  </div>
</template>
<script>
const typMap = {
  '银生宝支付': 1,
  'CSZ支付': 2,
  '易宝支付': 3
}

import {
  Group,
  ViewBox,
  XHeader,
  XInput,
  Checklist,
  XButton,
  Popup,
  PopupHeader,
  Cell,
  PopupPicker,
  XAddress,
  ChinaAddressData,
  TransferDomDirective as TransferDom,
  Radio,
  Value2nameFilter as value2name,
  Name2valueFilter as name2value
} from 'vux'

import ajax from '../../plugins/ajax'
import {
  baseUtil
} from '../../util'

import {
  user,
  rate
} from '../../model/storage'

export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      amount: '',
      typeList: [],
      bankItem: {},
      addressData: ChinaAddressData,
      bankList: [], // 银行卡列表
      orderInfo: {},
      value: '',
      payWay: [],
      type: 1,
      needBind: true,
      payToken: '',
      resultCode: '',
      resultMsg: '',
      showSmsCode: true,
      address: [],
      name: '',
      bankAccount: '',
      reBankAccount: '',
      subbranchName: '',
      reBankAccount: '',
      bankName: '',
      bank: [],
      isBind: false,
      bindCardformData: {},
      showBankList: false,
      bankCode: '',
      copyOfBankList: [],
      infoShow: false,
      bindCardShow: false,
      src: '',
      showIframe: false
    }
  },
  mounted() {
    const vm = this
    ajax.SUPPORT_BANK_LIST({
      success: (res) => {
        if (res.error_code === '0') {
          baseUtil.each(res.data, (bank) => {
            const copyOfBank = bank;
            // copyOfBank.value = bank.bank_code;
            copyOfBank.value = bank.name;
            copyOfBank.key = bank.name;
            copyOfBank.name = bank.name;
            vm.bankList.push(copyOfBank);
            const copyBankItem = baseUtil.copy(copyOfBank);
            copyBankItem.name = copyBankItem.key;
            copyBankItem.value = bank.bank_code;
            vm.copyOfBankList.push(copyBankItem);
          })
        }
      }
    })
    this.getPayWay()
  },
  watch: {
    bankName() {
      const vm = this;
      this.bankCode = name2value([vm.bankName], vm.copyOfBankList);
    }
  },
  computed: {
    charge() {
      if (this.payWay[0] !== 3) {
        const poundage = rate.read().charge_poundage
        return (this.amount * poundage).toFixed(2)
      }
    },
    bankTips() {
      return this.needBind ? '请绑定银行卡' : this.orderInfo.bank_name
    },
  },
  methods: {
    selectCode() {
      this.showBankList = true
    },
    radioSelect() {
      this.showBankList = false
    },
    pay() {
      if (this.amount <= 0) {
        this.$vux.toast.show({
          text: '请输入充值金额',
          type: 'text'
        })
        return
      }
      let payType = 1
      const param = {
        amount: Number.parseFloat(this.amount),
        pay_type: payType,
        pay_way: this.payWay[0],
        type: this.type
      }
      if (this.payWay[0] === 2) {
        const userInfo = user.read()
        param.pay_type = 'ylpay'
        // let url = ajax.apiList['GET_PAY_ORDER']
        let url = 'http://m.duoyingle.com/pay/get_pay_order/api/ajax.html'
        url = `${url}?user_access_token=${userInfo.token}&amount=${param.amount}&pay_type=${param.pay_type}&pay_way=${param.pay_way}&type=${param.type}`
        this.src = url
        this.showIframe = true
        // window.location.href = url
        return
      }
      if (this.payWay[0] === 3) {
        this.$router.push(`/recharge/bankTransform?amount=${this.amount}`)
        return
      }
      ajax.GET_PAY_ORDER({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            const {
              isNeedBind,
              bank_name,
              amount
            } = res.data
            this.needBind = isNeedBind
            this.infoShow = true
            this.orderInfo = res.data
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: 'cancel'
            })
          }
        },
        fail(res) {
          this.$vux.toast.text(res.msg, 'middle')
        }
      })
    },
    bankChange() { },
    send() {
      const vm = this
      const param = {
        amount: this.orderInfo.amount,
        bankCode: this.bankCode,
        cardNo: this.orderInfo.cardNo,
        customerId: this.orderInfo.customerId,
        idCardNo: this.orderInfo.idCardNo,
        name: this.orderInfo.name,
        orderId: this.orderInfo.orderId,
        pay_token: this.payToken,
        phoneNo: this.orderInfo.phoneNo,
        sign: this.orderInfo.sign
      }
      ajax.SEND_VERCODE({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            const data = res.data
            this.resultCode = data.result_code
            this.resultMsg = data.result_msg
            if (data.pay_token !== '') {
              this.payToken = data.pay_token
            }
            this.$vux.toast.show({
              text: res.msg,
              type: 'text'
            })
            const vm = this
            setTimeout(() => {
              vm.$vux.confirm.prompt(vm.smsCode, {
                title: '短信验证码',
                onCancel() { },
                onConfirm(value) {
                  const param = {
                    amount: vm.orderInfo.amount,
                    customerId: vm.orderInfo.customerId,
                    orderId: vm.orderInfo.orderId,
                    pay_token: vm.payToken,
                    sign: vm.orderInfo.sign,
                    vericode: value
                  }
                  ajax.PAY_CONFIRM({
                    param,
                    success: (res) => {
                      // todo 不论成功不成功都得再跑一遍完整的流程
                      if (res.error_code === '0') {
                        vm.$vux.toast.show({
                          text: res.msg,
                          type: 'text'
                        })
                        setTimeout(() => {
                          vm.$router.go(-1)
                        }, 2000)
                      } else {
                        vm.$vux.toast.show({
                          text: res.msg,
                          type: 'cancel'
                        })
                      }
                    }
                  })
                }
              })
            }, 2000)
          } else if (res.error_code === '500') {
            vm.pay()
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: 'cancel'
            })
          }
        }
      })
    },
    check() {
      const vm = this
      const param = {
        amount: vm.orderInfo.amount,
        customerId: vm.orderInfo.customerId,
        orderId: vm.orderInfo.orderId,
        pay_token: vm.payToken,
        sign: vm.orderInfo.sign,
        vericode: this.bindCardformData.vericode
      }
      ajax.PAY_CONFIRM({
        param,
        success: (res) => {
          // todo 不论成功不成功都得再跑一遍完整的流程
          if (res.error_code === '0') {
            vm.$vux.toast.show({
              text: res.msg,
              type: 'text'
            })
            setTimeout(() => {
              vm.$router.go(-1)
            }, 2000)
          } else {
            vm.$vux.toast.show({
              text: res.msg,
              type: 'cancel'
            })
          }
        }
      })
    },
    rechargeWay(type) {
      if (this.needBind || type === 'bind') {
        this.bindCardShow = true
        this.infoShow = false
        this.isBind = true
      }
    },
    sendSms() {
      const param = {
        amount: this.orderInfo.amount, // 充值金额
        bankCode: this.bankCode, // 银行类别代码
        cardNo: this.bindCardformData.cardNo, // 银行卡号
        customerId: this.orderInfo.customerId, // 客户id
        idCardNo: this.bindCardformData.idCardNo, // 身份证号
        name: this.bindCardformData.name, // 姓名
        orderId: this.orderInfo.orderId, // 订单id
        pay_token: this.payToken, // 
        phoneNo: this.bindCardformData.phoneNo, // 电话号码
        sign: this.orderInfo.sign // 	加密串
      }
      ajax.SEND_VERCODE({
        param,
        success: (res) => {
          if (res.error_code === '0') {
            const data = res.data
            this.resultCode = data.result_code
            this.resultMsg = data.result_msg
            if (data.pay_token !== '') {
              this.payToken = data.pay_token
            }
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
    getPayWay() {
      ajax.PAY_WAY({
        success: (res) => {
          baseUtil.each(res.data, (item, index) => {
            const way = {
              key: item.way,
              value: item.name
            }
            this.typeList.push(way)
          })
          // console.log(res)
        }
      })
    }
  },
  components: {
    ViewBox,
    XHeader,
    XInput,
    Group,
    Checklist,
    XButton,
    Popup,
    PopupHeader,
    Cell,
    PopupPicker,
    XAddress,
    Radio
  }
}
</script>
<style lang="less">
.recharge-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .service {
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 10px;
    font-size: 12px;
  }
  .service-title {
    margin-right: 5px;
    color: #999;
  }
  .service-charge {
    color: #ea6f48;
  }
  .btn-container {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 0 10px;
  }
  .btn-container .charge-btn {
    width: 90%;
  }
  .bottom-tips {
    // position: absolute;
    // bottom: 60px;
    margin: 10px;
    color: #999;
    font-size: 13px;
    line-height: 25px;
  }
  .pay-info {
    background: #fff;
  }
  .pay-amount {
    text-align: center;
    font-size: 26px;
    line-height: 80px;
  }
  .pay-btn-container {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
  }
}
</style>


