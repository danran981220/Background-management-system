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
            <!-- 这里是展开行 -->
            <el-table-column type="expand">
              <!-- 这里的scoped绑定的是：data里面的数据 -->
              <!-- 点击回车时处理的函数：@keyup.enter.native -->
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(scope.row,index)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.attr_id==baocun.attr_id&&baocun.inputVisible"
                  v-model="ceshi"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button type="primary" size="mini" @click="showmodifydialog(scoped.row)">
                  <i class="el-icon-edit"></i>修改
                </el-button>
                <el-button type="danger" size="mini" @click="open(scoped.row)">
                  <i class="el-icon-delete"></i>删除
                </el-button>
              </template>
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
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(scope.row,index)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.attr_id==baocun.attr_id&&baocun.inputVisible"
                  v-model="ceshi"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button type="primary" size="mini" @click="showmodifydialog(scoped.row)">
                  <i class="el-icon-edit"></i>修改
                </el-button>
                <el-button type="danger" size="mini">
                  <i class="el-icon-delete"></i>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加按钮对话框 -->
    <el-dialog :title="'添加'+titletext" :visible.sync="dialogVisible" width="30%" @close="chongzhi">
      <el-form ref="tianjiaform" label-width="80px" :model="addform">
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Addparameters">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改按钮对话框 -->
    <el-dialog
      :title="'添加'+titletext"
      :visible.sync="dialogmodifyVisible"
      width="30%"
      @close="chongzhii"
    >
      <el-form ref="modifyform" label-width="80px" :model="editform">
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogmodifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="xiugai">确 定</el-button>
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
      dialogmodifyVisible: false,
      editform: {
        attr_name: '',
      },
      baocun:{},
      ceshi:null
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
            this.up.forEach((item) => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              item.inputValue = ''
            })
          } else {
            this.cm = res.data
            this.cm.forEach((item) => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              item.inputValue =null
            })
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
      } else {
        this.qingqiu()
        this.dialogVisible = false
      }
    },
    showmodifydialog(scooprow) {
      console.log(scooprow)
      this.editform = scooprow
      this.dialogmodifyVisible = true
    },
    chongzhi() {
      this.$refs.tianjiaform.resetFields()
    },
    chongzhii() {
      this.$refs.modifyform.resetFields()
      this.editform = {
        attr_name: '',
      }
    },
    async xiugai() {
      const { data: res } = await this.$http.put(
        `categories/${this.editform.cat_id}/attributes/${this.editform.attr_id}`,
        {
          attr_name: this.editform.attr_name,
          attr_sel: this.activeName,
        }
      )
      if (res.meta.status != 200) {
        this.$message.error('请求失败')
        console.log(res)
        console.log(this.activeName)
      } else {
        this.$message.success('更新成功')
        this.qingqiu()
        this.dialogmodifyVisible = false
      }
    },
    open(scooprow) {
      var id = scooprow.attr_id
      var cateid = scooprow.cat_id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${cateid}/attributes/${id}`
          )
          this.qingqiu()
          if (res.meta.status != 200) {
            this.$message.error('删除失败')
            console.log(res)
          } else {
            this.$message.success('删除成功')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //点击按钮展示文本框
    showInput(scoop) {
      scoop.inputVisible = true;
      // 储存着传过来的参数信息
      this.baocun=scoop;
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //文本框失去焦点或者按下enter时候触发
    async handleInputConfirm(row) {
      //判断输入的值去掉空格后是否为空
      let ceshistr=this.ceshi
      if(ceshistr==null){
        return this.$message.error('你输入的值为空')
      }else{
        if(ceshistr.length==0){
        this.baocun={}
        this.ceshi=null
        return this.$message.error('你输入的值为空')
      }
      } 
      row.attr_vals.push(ceshistr)
      //发送axios请求，提交参数
      const {data:res}=await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!=200){
        this.$message.error('请求失败')
        console.log(res)
      }else{
        this.$message.success('更新成功')
      }
      this.baocun={}
      this.ceshi=null
    },
    async handleClose(row,index){
      row.attr_vals.splice(row.attr_vals.indexOf(index), 1);
      const {data:res}=await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!=200){
        this.$message.error('请求失败')
        console.log(res)
      }else{
        this.$message.success('更新成功')
      }
    }
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
.el-tag {
  margin-left: 20px;
}
.input-new-tag {
  width: 90px;
  margin-left: 20px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 20px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>