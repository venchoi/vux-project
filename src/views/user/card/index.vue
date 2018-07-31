<template>
    <div class="bindcard-container">
      <x-header 
        :left-options="{backText: ''}" 
        style="background-color:#EA3939;">
        <div class="header-content">
          绑定银行卡
        </div>
      </x-header>
      <view-box>
        <div class="carb-list">
          <div class="item" v-for="(item, index) in bankList" :key="index">
            <div class="img-container">
              <img :src="item.img_url">
              <div class="bank-name">{{item.bank_name}}</div>
            </div>
            <div class="desc">
              {{item.bank_account}}
            </div>
            <!-- <div class="unbind" @click="unbind(item.user_bank_id)">
              解除绑定
            </div> -->
          </div>
        </div>
        <div class="button-container">
          <x-button link="/card/bind" :disabled="bankList.length > 0">＋添加银行卡</x-button>
        </div>
      </view-box>
      
    </div>
</template>
<script>
import { ViewBox, XHeader, XButton } from 'vux'
import api from '../../../plugins/ajax'

export default {
  data() {
    return {
      bankList: [],
      show: true
    }
  },
  components: {
    ViewBox,
    XHeader,
    XButton
  },
  created() {
    api.GET_BANK_LIST({
      param: {
        type: 2
      },
      success:(res) => {
        this.bankList = res.data
      }
    })
  },
  methods: {
    unbind(cardId) {
      this.$vux.confirm.show({
        title: '解除绑定',
        content: '您将无法使用该银行卡进行操作是否确定解除绑定？',
        onConfirm:() => {
          api.UNBIND_BANK_CARD({
            param: {
              user_bank_id: cardId
            },
            success: () => {
              this.$vux.toast.show({
                text: '解除绑定成功'
              })
            }
          })
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
  .bindcard-container {
    * {
      box-sizing: border-box;
    }
    .carb-list {
      .item {
        position: relative;
        width: 100%;
        .img-container {
          position: relative;
          padding: 5px;
          width: 100%;
          img {
            width: 100%;
          }
          .bank-name {
            position: absolute;
            top: 20%;
            left: 27%;
            color: #fff;
          }
        }
        .desc {
          position: absolute;
          top: 48%;
          left: 27%;
          font-size: 18px;
          color: #fff;
          z-index: 1;
        }
        .unbind {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 15px;
          color: #fff;
        }
      }
    }
    .button-container {
      margin-top: 10px;
      padding: 0 10px;
    }
  }
  .active {
    color: #EA3939 !important;
  }
  .red {
    background: #EA3939;
  }
  .green {
    background: #1faf31;
  }

</style>

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

