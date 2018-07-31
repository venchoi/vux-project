<template>
  <div id="app">
    <router-view></router-view>
    <tabbar-menu></tabbar-menu>
  </div>
</template>

<script>
import TabbarMenu from './views/TabbarMenu'
import * as storage from './model/storage'
export default {
  name: 'app',
  components: {
    TabbarMenu
  },
  created () {
    storage.user.init()
    storage.rate.init()
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
// todo
@tabbar-text-active-color: #ea3939 !important;
body {
  background-color: #f5f5f5;
}
</style>
