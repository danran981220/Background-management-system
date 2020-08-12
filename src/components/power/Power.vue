<template>
  <div>
    <!-- 面包蟹 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table :data="powerlist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scoop">
            <el-tag type="success" v-if="scoop.row.level=='0'">等级一</el-tag>
            <el-tag type="info" v-if="scoop.row.level=='1'">等级二</el-tag>
            <el-tag type="warning" v-if="scoop.row.level=='2'">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'power',
  data() {
    return {
      powerlist: []
    }
  },
  created() {
    this.getpowerlist()
  },
  methods: {
    async getpowerlist() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status != 200) {
        console.log(res)
      } else {
        this.powerlist = res.data
      }
    }
  }
}
</script>
<style scoped lang="less">
</style>