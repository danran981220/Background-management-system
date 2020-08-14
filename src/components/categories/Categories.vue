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
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border='true'
      >
        <template slot="likes" slot-scope="scoop">
          <i class="el-icon-success" v-if="!scoop.row.cat_deleted" style="color:#1AE642"></i>
          <i class="el-icon-error" v-else></i>
        </template>
      </tree-table>
      <!-- 分页区 -->
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'categories',
  data() {
    return {
      catelist: [],
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //信息条数，为了实现分页效果
      total: '',
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'likes',
        },
      ],
    }
  },
  created() {
    this.getcatelist()
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryinfo,
      })
      if (res.meta.status != 200) {
        this.$message.error('获取失败')
      } else {
        this.catelist = res.data.result
        this.total = res.data.total
        console.log(this.catelist)
        console.log(this.total)
      }
    },
  },
}
</script>
<style scoped>
</style>