<template>
    <div class="contract-container">
      <x-header 
        :left-options="{backText: ''}" 
        style="background-color:#EA3939;">
        <div class="header-content">
          <div class="name">50ETF购7月2250</div>
          <div class="code">10001379</div>
        </div>
      </x-header>
      <view-box>
        <div class="contract-details">
          <div class="price-details">
            <div class="close">2.582</div>
            <div class="details">0.0012(0.45%)</div>
          </div>
          <div>
            <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/2">
              <div class="flex-item">
                最高：1234
              </div>          
            </flexbox-item>
            <flexbox-item :span="1/2">
              <div class="flex-item">
                昨收：1234
              </div>          
            </flexbox-item>
            <flexbox-item :span="1/2">
              <div class="flex-item">
                最低：123
              </div>          
            </flexbox-item>
            <flexbox-item :span="1/2">
              <div class="flex-item">
                总量：123123
              </div>          
            </flexbox-item>
          </flexbox>
          </div>
          
        </div>
        
        
         <tab :line-width="3" custom-bar-width="60px" bar-active-color="#EA3939">
          <tab-item active-class="active" selected>分时</tab-item>
          <tab-item active-class="active">日K</tab-item>
          <tab-item active-class="active">周K</tab-item>
          <tab-item active-class="active">月K</tab-item>
        </tab>

      </view-box>
    </div>
</template>
<script>
import { ViewBox, Flexbox, FlexboxItem, Tab, TabItem, XHeader } from 'vux'

import StockDetails from '../../components/StockDetails'

export default {
  components: {
    ViewBox,
    Flexbox,
    FlexboxItem,
    StockDetails,
    Tab,
    TabItem,
    XHeader
  },
}
</script>
<style lang="less" scoped>
  .contract-container {
    .header-content {
      line-height: 1.4;
      .name {
        font-size: 18px;
      }
      .code {
        font-size: 12px;
      }
    }
    .contract-details {
      padding: 15px;
      display: flex;
      background: #fff;
      align-items: center;
      justify-content: center;
      margin-bottom: 3px;
      padding-bottom: 10px;
      .price-details {
        text-align: center;
        line-height: 1;
        .close {
          font-size: 39px;
          text-align: center;
          color: #EA3939;
        }
        .details {
          font-size: 12px;
          color: #EA3939;
        }
        
      }
    .flex-item {
      font-size: 14px;
      padding: 3px 0 3px 30px;
    }
    .title {
      text-align: center;
      padding: 10px 0;
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
    .header {
      .header-item {
        padding: 10px 0;
        text-align: center;
        color: #fff;
      }
      .split {
        display: flex;
        padding: 0;
        > div {
          width: 50%;
          padding: 10px 0;
          &:nth-of-type(1) {
            background: #EA3939;
          }
          &:nth-of-type(2) {
            background: #1faf31;
          }
        }
      }
    }
    .data {
      .data-item {
        padding: 10px 0;
        text-align: center;
        &.split {
          background: #f4f8ff;
          color: #397eea;
        }
      }
    }
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

