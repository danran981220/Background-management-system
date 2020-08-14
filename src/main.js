import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import treetable from 'vue-table-with-tree-grid'
//导入axios,挂在axios
import axios from 'axios'
//设置根路径
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
//设置请求拦截器               请求对象
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios


Vue.config.productionTip = false


Vue.component('tree-table', treetable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')