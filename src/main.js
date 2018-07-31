// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'
import store from './model/vuex'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import { AjaxPlugin, AlertPlugin, ToastPlugin, ConfirmPlugin } from 'vux'
import storage from './plugins/base/storage'

Vue.use(Vuex)
Vue.use(AjaxPlugin)
Vue.use(vuexI18n.plugin, store)
// Vue.prototype.$http.defaults.baseURL = 'http://m.duoyingle.com'
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.prototype.$storage = storage

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
