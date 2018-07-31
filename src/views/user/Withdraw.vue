<template>
  <div>
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">提现</x-header>
    <group>
      <x-input title="提现金额" v-model="amount" text-align="right"></x-input>
    </group>
    <group :title="`当前账户余额${balance}元`">
      <popup-picker @on-change="bankChange(bank)" popup-title="选择银行卡" title="银行名称" :data="bankList" :columns="1" ref="bankPicker" v-model="bank" :value="bankItem"></popup-picker>
    </group>
    <group :title="withdrawDes">
      <x-input title="提现密码" v-model="password" text-align="right"></x-input>
    </group>
    <div class="pay-btn-container">
      <x-button @click.native="withDraw" style="width:80%;background: #EA3939;color:#fff">提现</x-button>
    </div>
    <div class="bottom-tips">
      <div class="time-tips">提现请在工作日9：00-15：30内申请，T+2个工作日内到账</div>
      <div class="warm-tips">温馨提示：<br>禁止洗钱、信用卡套现、虚假交易等行为，一经发现并确认，将终止该账户的使用</div>
    </div>
  </div>
</template>
<script>
import { Group, PopupPicker, XButton, XInput, XHeader, Popup, Radio } from 'vux'
import { baseUtil } from '../../util'
import ajax from '../../plugins/ajax'
import { rate } from '../../model/storage'
export default {
  data () {
    return {
      amount: 0,
      bankList: [],
      bankList2: [],
      bankCode: '',
      bank: [],
      bankMap: {},
      balance: 0,
      password: '',
      bankId: '',
      bankItem: {},
      withdrawDes: rate.read().withdraw_fee_desc,
      showBankList: false,
    }
  },
  mounted () {
    ajax.GET_BANK_LIST({
      param: {
        type: 2
      },
      success: (res) => {
        if (res.error_code === '0') {
          baseUtil.each(res.data, (bank) => {
            const copyOfBank = bank
            copyOfBank.value = bank.bank_name
            // copyOfBank.value = `${bank.bank_name}  ${bank.remark}`
            copyOfBank.key = bank.user_bank_id
            // copyOfBank.key = bank.bank_name
            copyOfBank.name = `${bank.bank_name}  ${bank.remark}`
            this.bankList2.push(copyOfBank.name)
            this.bankList.push(copyOfBank)
            this.bankMap[copyOfBank.value] = copyOfBank
          })
        }
      }
    })
    ajax.BALANCE_FUNDS({
      success: (res) => {
        if (res.error_code === '0') {
          this.balance = res.data.balance_funds
        }
      }
    })
  },
  methods: {
    selectBank () {
      // todo
      this.showBankList = true
    },
    bankChange (item) {
      this.bankId = this.bankMap[item].user_bank_id
    },
    withDraw () {
      const param = {
        amount: this.amount,
        password: this.password,
        user_bank_id: this.bankId
      }
      ajax.WITHDRAW({
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
    }
  },
  components: {
    Group,
    PopupPicker,
    XButton,
    XInput,
    XHeader,
    Popup,
    Radio
  }
}
</script>
<style lang="less">
.bottom-tips {
  margin: 10px;
  color: #999;
  font-size: 13px;
  line-height: 25px;
  .warm-tips {
    margin-top: 80px;
  }
}
.pay-btn-container {
  margin-top: 30px;
}
</style>
