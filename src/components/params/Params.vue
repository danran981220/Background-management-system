<template>
  <div>
    <!-- 面包蟹 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-col><el-button type="primary">添加分类</el-button></el-col>
      </el-row>
      <!-- 表格区 -->

      <!-- 分页区 -->
    </el-card>
  </div>
</template>
<script>
export default {
  name:'params',
  data(){
    return {
      catelist:[],
      queryinfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      //信息条数，为了实现分页效果
      total:'',
    }
  },
  created(){
    this.getcatelist()
  },
  methods:{
    async getcatelist(){
      const {data:res}=await this.$http.get('/categories',{params:this.queryinfo})
      if(res.meta.status!=200){
        this.$message.error('获取失败')
      }else{
        this.catelist=res.data.result
        this.total=res.data.total
        console.log(this.catelist)
        console.log(this.total)
      }
    }
  }
}
</script>
<style scoped>

</style>