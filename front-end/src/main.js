// =========================================================
// * Vuetify Material Dashboard PRO - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'vue-search-select/dist/VueSearchSelect.css'

import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-world-map'
import vuetify from './plugins/vuetify'
import i18n from './i18n'

// import moment from 'moment'
import moment from 'moment-timezone'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
moment.tz.setDefault('Asia/Shanghai')
// moment.tz.setDefault('UTC')
// 将 $moment 挂载到 prototype 上，在组件中可以直接使用 this.$moment 访问
Vue.prototype.$moment = moment

import './permission' // permission control
Vue.config.productionTip = false

import VuetifyConfirm from 'vuetify-confirm'
Vue.use(VuetifyConfirm, {vuetify,
  buttonTrueText: '确认',
  buttonFalseText: '取消',
  color: 'warning',
  icon: 'mdi-alert-circle-outline',
  title: '警告',
  width: 350,
  property: '$confirm'})

import Print from 'vue-print-nb'
Vue.use(Print)

var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

import excel from 'vue-excel-export' 
Vue.use(excel)

import Navigation from 'vue-navigation'
Vue.use(Navigation, {router})

import { vueBaberrage } from 'vue-baberrage'
Vue.use(vueBaberrage)

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')

