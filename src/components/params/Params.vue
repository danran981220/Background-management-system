<template>
  <div>
    <!-- 面包蟹导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-alert title="注意：只允许为三级分类设置参数" type="warning" show-icon></el-alert>
      </el-row>
      <el-row>
        选择商品分类：
        <!-- 级联选择器 -->
        <el-cascader
          v-model="selectkey"
          :options="catelist"
          :props="cateprop"
          clearable
          @change="handleChange"
        ></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isdisabled"
            @click="dialogVisible=true"
          >添加参数</el-button>
          <el-table :data="up">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini">
                <i class="el-icon-edit"></i>修改
              </el-button>
              <el-button type="danger" size="mini">
                <i class="el-icon-delete"></i>删除
              </el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isdisabled"
            @click="dialogVisible=true"
          >添加属性</el-button>
          <el-table :data="cm" stripe border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini">
                <i class="el-icon-edit"></i>修改
              </el-button>
              <el-button type="danger" size="mini">
                <i class="el-icon-delete"></i>删除
              </el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加按钮对话框 -->
    <el-dialog :title="'添加'+titletext" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" label-width="80px" :model="addform">
        <el-form-item :label="titletext">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Addparameters">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'params',
  data() {
    return {
      activeName: 'many',
      catelist: [],
      cateprop: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectkey: [],
      up: [],
      cm: [],
      dialogVisible: false,
      addform: {
        attr_name: '',
      },
    }
  },
  created() {
    this.getcatelist()
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        this.$message.console.error('获取失败')
      } else {
        this.catelist = res.data
      }
    },
    handleChange() {
      this.qingqiu()
    },
    handleClick() {
      this.qingqiu()
    },
    async qingqiu() {
      if (this.selectkey.length >= 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.selectkey[this.selectkey.length - 1]}/attributes`,
          { params: { sel: this.activeName } }
        )
        if (res.meta.status != 200) {
          this.$message.error('获取失败')
        } else {
          if (this.activeName == 'many') {
            this.up = res.data
          } else {
            this.cm = res.data
          }
        }
      } else {
        return
      }
    },
    async Addparameters() {
      const { data: res } = await this.$http.post(
        `categories/${this.selectkey[this.selectkey.length - 1]}/attributes`,
        { attr_name: this.addform.attr_name, attr_sel: this.activeName }
      )
      if (res.meta.status != 201) {
        this.dialogVisible = false
        this.$message.error('请求失败')
        console.log(res.data)
      } else {
        console.log(res.data)
        this.qingqiu()
        this.dialogVisible = false
      }
    },
  },
  computed: {
    // 设置计算属性，判断添加参数和添加属性是否禁用
    isdisabled() {
      if (this.selectkey.length >= 2) {
        return false
      } else {
        return true
      }
    },
    titletext() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>
<style scoped>
.el-cascader {
  margin-top: 20px;
}
</style>