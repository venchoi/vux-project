<template>
  <div class="news-list-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">新手指引</x-header>
    <div class="scroll-container">
      <img src=" http://m.duoyingle.com/res/assets/img/img_guide.4241493.png" alt="新手指引">
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
.scroll-container img {
  width: 100%;
}
</style>

