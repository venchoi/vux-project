<template>
  <tabbar style="position:fixed" v-show="showTabbar" ref="tabbar">
    <tabbar-item link="/">
      <img slot="icon" src="../assets/img/Main_tab_home@2x.png">
      <img slot="icon-active" src="../assets/img/Main_tab_home_pre@2x.png">
      <span slot="label">首页</span>
    </tabbar-item>
    <tabbar-item link="/market">
      <img slot="icon" src="../assets/img/Main_tab_trend@2x.png">
      <img slot="icon-active" src="../assets/img/Main_tab_trend_pre@2x.png">
      <span slot="label">行情</span>
    </tabbar-item>
    <tabbar-item link="/mystock">
      <img slot="icon" src="../assets/img/Main_tab_add@2x.png">
      <img slot="icon-active" src="../assets/img/Main_tab_add_pre@2x.png">
      <span slot="label">自选</span>
    </tabbar-item>
    <tabbar-item link="/trade">
      <img slot="icon" src="../assets/img/Main_tab_money@2x.png">
      <img slot="icon-active" src="../assets/img/Main_tab_money_pre@2x.png">
      <span slot="label">交易</span>
    </tabbar-item>
    <tabbar-item link="/user">
      <img slot="icon" src="../assets/img/Main_tab_user@2x.png">
      <img slot="icon-active" src="../assets/img/Main_tab_user_pre@2x.png">
      <span slot="label">我的</span>
    </tabbar-item>
  </tabbar>
</template>
<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
  data() {
    return {
      showTabbar: false
    }
  },
  watch: {
    "$route": "routeChange"
  },
  created() {
    this.routeChange()
  },
  methods: {
    routeChange() {
      const route = this.$route
      if (route.meta && !route.meta.showTabbar) {
        this.showTabbar = false
      } else {
        this.showTabbar = true
      }
    }
  },
  components: {
    Tabbar,
    TabbarItem
  }
}
</script>
<style lang="less" scroped>
@tabbar-text-active-color: #ea3939 !important;
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #ea3939 !important;
}
</style>

