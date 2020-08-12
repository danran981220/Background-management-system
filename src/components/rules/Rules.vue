<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="ruleslist" stripe border>
        <el-table-column type="expand">
          <template v-slot="scoop">
            <el-row
              v-for="(item,index) in scoop.row.children"
              :key="item.id"
              :class="{'active':(index==0)}"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  effect="plain"
                  closable
                  @close="closeroles(scoop.row.id,item.id)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item.children" :key="item2.id">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeroles(scoop.row.id,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,index3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="closeroles(scoop.row.id,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getrightlist(scoped.row)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="isshowdialog" width="50%" @close="clearcheckkey">
      <!-- 树形图 -->
      <el-tree :data="rightlist" :props="defaultProps" show-checkbox node-key="id" default-expand-all 
      :default-checked-keys='checkkey' ref='eltree'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isshowdialog = false">取 消</el-button>
        <el-button type="primary" @click="change">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'rules',
  data() {
    return {
      ruleslist: [],
      isshowdialog: false,
      rightlist: [],
      defaultProps:{
        children: 'children',
          label: 'authName'
      },
      checkkey:[],
      roleid:''
    }
  },
  created() {
    this.getruleslist()
  },
  methods: {
    async getruleslist() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        this.$message.error('数据请求失败')
      } else {
        this.ruleslist = res.data
      }
    },
    closeroles(roleId, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${roleId}/rights/${rightId}`
          )
          if (res.meta.status != 200) {
            this.$message.error('删除失败')
          } else {
            this.ruleslist = res.data
            this.getruleslist()
            this.$message.success('删除成功')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async getrightlist(role) {
      this.roleid=role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) {
        this.$message.error('请求数据失败')
      } else {
        this.rightlist = res.data
        //递归调用
        this.getcheckkey(role,this.checkkey)
        this.isshowdialog = true
      }
    },
    // 设置递归函数，保存三级节点的id
    getcheckkey(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.getcheckkey(item,arr)
      })
    },
    clearcheckkey(){
      this.checkkey=[]
    },
    async change(){
      const reschange=[
        ...this.$refs.eltree.getCheckedKeys(),
        ...this.$refs.eltree.getHalfCheckedKeys()
      ]
      const reschangestr=reschange.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleid}/rights`,{rids:reschangestr})
      if(res.meta.status!=200){
        console.log(res)
        this.$message.error('请求失败')
      }else{
        this.getruleslist()
        this.isshowdialog=false
      }
    }
  }
}
</script>
<style scoped lang="less">
.el-tag {
  margin: 7px;
}
.el-row {
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}
.active {
  border-top: 1px solid #eee;
}
</style>