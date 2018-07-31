<template>
  <div class="service-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">在线客服</x-header>
    <div class="img-container">
      <img src="../../assets/img/service.png" alt="" class="service-back">
      <img src="http://m.duoyingle.com/res/assets/img/kf-qrcode.png" alt="" class="qcode">
    </div>
  </div>
</template>
<script>
import { XHeader } from 'vux'
export default {
  components: {
    XHeader
  }
}
</script>

<style lang="less">
html,body, #app{
  height: 100%;
}
.service-page {
  background-color: #f5f5f5;
  // width: 100%;
  height: 100%;
  .img-container {
    position: relative;
    padding-top: 10px;
    padding-left: 10px;
    width: 100%;
    height: 100%;
    .service-back {
      position: absolute;
      width: 95%;
      height: 70%;
    }
    .qcode {
      position: absolute;
      top: 35%;
      left: 40%;
      width: 40%;
    }
  }
}
</style>
