<template>
  <div>
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">添加银行卡</x-header>
    <div>
      <group>
        <div>
          <!-- <popup v-model="showBankList">
            <popup-header left-text="取消" right-text="确定" title="选择银行卡" :show-bottom-border="false" @on-click-left="showBankList = false" @on-click-right="showBankList = false"></popup-header>
          </popup> -->
          <x-input title="姓名" placeholder-align="right" v-model="name"></x-input>
          <x-input title="银行名称" v-model="bankName">
            <x-icon slot="right" type="ios-arrow-right" class="right-icon" @click="selectCode"></x-icon>
          </x-input>
          <!-- <popup-picker @on-change="bankChange()" popup-title="选择银行卡" title="银行名称" :data="bankList" :columns="1" ref="bankPicker" v-model="bank" :value="bankItem"></popup-picker> -->
          <x-address title="开户行所在地区" v-model="address" :list="addressData" placeholder="请选择地址" :popup-style="{zIndex: 502}"></x-address>
          <x-input title="银行支行名称" placeholder="请输入支行名称" placeholder-align="right" v-model="bankSubName"></x-input>
          <x-input title="银行卡号" placeholder="请输入银行卡号" placeholder-align="right" v-model="bankAccount"></x-input>
          <x-input title="重复卡号" placeholder="请再次输入银行卡号" placeholder-align="right" v-model="reBankAccount"></x-input>
        </div>
        <div v-transfer-dom>
          <popup v-model="showBankList" position="bottom" max-height="50%">
            <popup-header right-text="确定" :show-bottom-border="false" @on-click-right="showBankList = false"></popup-header>
            <group gutter="0">
              <radio :options="bankList" v-model="bankName" @on-change="changeBank"></radio>
            </group>
          </popup>
        </div>
      </group>
      <div class="btn-container">
        <x-button type="primary" @click.native="saveCard" class="save-btn">保存</x-button>
      </div>
    </div>
    <toast ref="toast" :type="toustType" :time="1500">{{toustTxt}}</toast>
  </div>
</template>
<script>
import {
  XButton,
  XInput,
  XHeader,
  Group,
  Toast,
  PopupPicker,
  Cell,
  PopupRadio,
  Popup,
  Radio,
  PopupHeader,
  XAddress,
  ChinaAddressData,
  TransferDomDirective as TransferDom,
  Value2nameFilter as value2name,
  Name2valueFilter as name2value
  // ChinaAddressV4Data
} from "vux";
import { baseUtil } from "../../../util";
import ajax from "../../../plugins/ajax";
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      toustType: "",
      toustTxt: "",
      bankList: [],
      bank: [],
      bankName: "",
      showBankList: false,
      bankItem: {},
      addressData: ChinaAddressData,
      address: [],
      name: "",
      bankAccount: "",
      reBankAccount: "",
      bankSubName: "",
      reBankAccount: "",
      copyOfBankList: []
    };
  },
  mounted() {
    const vm = this;
    ajax.GET_BANK_WHITE_LIST({
      success: res => {
        if (res.error_code === "0") {
          baseUtil.each(res.data, bank => {
            const copyOfBank = bank;
            // copyOfBank.value = bank.bank_code;
            copyOfBank.value = `${bank.name}  ${bank.remark}`;
            copyOfBank.key = bank.name;
            copyOfBank.name = `${bank.name}  ${bank.remark}`;
            vm.bankList.push(copyOfBank);
            const copyBankItem = baseUtil.copy(copyOfBank);
            copyBankItem.name = copyBankItem.key;
            copyBankItem.value = bank.bank_code;
            vm.copyOfBankList.push(copyBankItem);
          });
          // this.bankList = res.data
        }
      }
    });
  },
  watch: {
    bankName() {
      const vm = this;
      this.bankCode = name2value([vm.bankName], vm.copyOfBankList);
    }
  },
  methods: {
    changeBank(value) {
    },
    getName(value) {
      return value2name(value, ChinaAddressData);
    },
    selectCode() {
      this.showBankList = true;
    },
    bankChange(e) {
      const bank = this.bankItem;
    },
    saveCard() {
      const vm = this;
      // todo name 这里的name 是指开户名，不是支行名称？
      const address = this.getName(vm.address);
      const bankCode = name2value(vm.bankName, vm.bankList);
      const param = {
        name: this.name, // 开户名
        // todo
        bank_code: this.bankCode, // 银行类型码
        bank_name: this.bankName,
        bank_area: address, // 银行开户地区
        bank_subbranch_name: this.bankSubName, // 银行支行名称
        bank_account: this.bankAccount, // 银行卡号
        re_bank_account: this.reBankAccount // 重复银行卡号
      };
      ajax.BIND_BANDCARD({
        param,
        success: res => {
          this.toustTxt = res.msg;
          if (res.error_code === "0") {
            this.toustType = "success";
            this.$refs.toast.show = true;
            this.$vux.toast.text("绑卡成功", "middle");
            vm.$router.go(-1);
          } else {
            this.toustType = "cancel";
            this.$refs.toast.show = true;
          }
        }
      });
    }
  },
  components: {
    XHeader,
    Group,
    Toast,
    Cell,
    PopupPicker,
    PopupRadio,
    Popup,
    Radio,
    PopupHeader,
    XAddress,
    XInput,
    XButton
  }
};
</script>
<style lang="less">
.btn-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.btn-container .save-btn {
  width: 90%;
}
</style>

