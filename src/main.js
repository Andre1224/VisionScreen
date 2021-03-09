import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/font/iconfont.css'
// import SocketService from '../public/static/lib/socket_service'
//  引入全局CSS样式
import './assets/css/global.less'

//  在服务端进行websocket链接
// SocketService.Instance.connect()
// Vue.prototype.$socket = SocketService.Instance
//  请求基准路径位置
// axios.defaults.baseURL = 'http://localhost:3000/api/'
//  将axios挂载至Vue原型对象上
//  其他组件中通过 this.$http 调用
Vue.prototype.$http = axios

//  将全局echarts对象挂载到Vue原型对象上
//  在其他组件中通过 this.$echarts 调用
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
