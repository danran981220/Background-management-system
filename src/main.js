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

//注册一个全局的过滤器，转化时间戳
Vue.filter('conversion',function(timestamp){
  const dt=new Date(timestamp)
  const Y=dt.getFullYear()
  // 得到的月份加一，变成真实月份，然后转化成字符串，如果为一位数，则开头加上‘0’
  const M=(dt.getMonth()+1+'').padStart(2,'0')
  const D=(dt.getDay()+1+'').padStart(2,'0')
  const HH=(dt.getHours()+1+'').padStart(2,'0')
  const MM=(dt.getMinutes()+1+'').padStart(2,'0')
  const SS=(dt.getSeconds()+1+'').padStart(2,'0')
  return `${Y}-${M}-${D} ${HH}:${MM}:${SS}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')