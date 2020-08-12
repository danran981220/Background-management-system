<template>
  <el-container class="home_container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <div class="dst">
          <img src="../assets/dst.jpg" alt />
        </div>
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="tuichu">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏    通过变量来控制长度-->
      <el-aside :width="this.changdu">
        <!-- 给div添加点击事件，来改变侧边栏的宽度 -->
        <div class="aside_button" @click="dianji()">| | |</div>
        <!--:unique-opened="true" ：只保证一个子菜单展开  
        :collapse-transition="false"  是否开启折叠动画
        :collapse='this.iszhankai'  是否折叠起来菜单
        :default-active='$route.path'  当前激活菜单，绑定路径
        :router='true'    会在激活导航时以 index 作为 path 进行路由跳转
        -->
        <el-menu background-color="#313743" text-color="#fff" active-text-color="#2F99FD" 
         :unique-opened="true" :collapse='this.iszhankai' :collapse-transition="false"
           :router='true' :default-active='$route.path'> 
          <!-- 一级菜单 -->
          <!--:index="index+' '"   -----唯一标识  -->
          <el-submenu :index="index+' '" v-for="(item,index) in menulist" :key="item.id">
            <!-- 模板区 -->
            <template slot="title">
              <!-- 图标     根据id绑定图片-->
              <i :class="menu_icon[item.id]" class="cion_img"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单      设置跳转的地址 -->
            <el-menu-item :index="'/'+erji.path" v-for="(erji,erjiindex) in item.children" :key="erji.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{erji.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  data(){
    return {
      menulist:'',
      menu_icon:{
        '125':'el-icon-user-solid',
        '103':'el-icon-unlock',
        '101':'el-icon-sell',
        '102':'el-icon-notebook-1',
        '145':'el-icon-pie-chart'
      },
      iszhankai:false,
      changdu:'200px'
    }
  },
  created(){
    this.getmenu()
  },
  methods: {
    tuichu() {
      //清空token
      window.sessionStorage.clear()
      //跳转回登录界面
      this.$router.push('/login')
    },
    async getmenu(){
      const{data:res} =await this.$http.get('menus')
      if(res.meta.status!==200){
        this.$message.error('获取数据失败')
      }else{
        this.menulist=res.data
      }
    },
    dianji(){
      this.iszhankai=!this.iszhankai
      if(this.iszhankai==true){this.changdu='64px'}
      else{this.changdu='200px'}
    }
  }
}
</script>
<style scoped lang="less">
.el-header {
  background-color: #363d3f;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  // 在数轴上的对齐方式-----居中
  align-items: center;
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.dst {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
}
.dst > img {
  width: 100%;
  height: 100%;
}
.cion_img{
  margin-right: 10px;
}
.el-menu{
  border: none;
  }
.aside_button{
  background-color: #475164;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  color: white;
  cursor: pointer;
}
</style>