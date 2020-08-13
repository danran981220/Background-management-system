import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from "../components/Home.vue"
import welcome from '../components/Welcome.vue'
import users from '../components/users/Users.vue'
import power from '../components/power/Power.vue'
import rules from '../components/rules/Rules.vue'
import goods from '../components/goods/Goods.vue'
import categories from '../components/categories/Categories.vue'
import params from '../components/params/Params.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:login
    },
    {
      path:'/home',
      component:home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
          component:welcome,
        },
        {
          path:'/users',
          component:users
        },
        {
          path:'/rights',
          component:power
        },
        {
          path:'/roles',
          component:rules
        },
        {
          path:'/goods',
          component:goods
        },
        {
          path:'/categories',
          component:categories
        },
        {
          path:'/params',
          component:params
        }
      ]
    }
  ]
})
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

//设置导航守卫
router.beforeEach((to,from,next)=>{
  // 保存token值
  const tokenstr=window.sessionStorage.getItem('token')
  if(to.path=="/login"){
    //表示放行
    next()
  }
  if(!tokenstr){
    //表示强行跳转
    next('/login')
  }else{
    next()
  }
})

export default router
