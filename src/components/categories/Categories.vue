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
          <el-button type="primary" @click="Addcategory">添加分类</el-button>
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
        :border="true"
      >
        <template slot="likes" slot-scope="scoop">
          <i class="el-icon-success" v-if="!scoop.row.cat_deleted" style="color:#1AE642"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scoop">
          <el-tag v-if="scoop.row.cat_level==0" size="mini">一级</el-tag>
          <el-tag type="success" v-if="scoop.row.cat_level==1" size="mini">二级</el-tag>
          <el-tag type="info" v-if="scoop.row.cat_level==2" size="mini">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scoop">
          <el-button type="primary" size="mini">
            <i class="el-icon-edit"></i>添加
          </el-button>
          <el-button type="danger" size="mini" @click="open(scoop.row)">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="this.queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
    <!-- 添加弹出框 -->
    <el-dialog title="提示" :visible.sync="Additem" width="30%" @close="guanbi">
      <el-form :model="addcateform" :rules="addcateformrules" ref="addcateform" label-width="100px">
        <el-form-item label="添加分类" prop="cat_name">
          <el-input v-model="addcateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 :options--绑定的对象,
          v-model="selectkey"---与props中的绑定值相匹配-->
          <el-cascader
            v-model="selectkey"
            :options="parentcatliist"
            :props="cateprop"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Additem = false">取 消</el-button>
        <el-button type="primary" @click="subaddcate">确 定</el-button>
      </span>
    </el-dialog>
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
      total: null,
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
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      Additem: false,
      addcateform: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      addcateformrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      parentcatliist: [],
      selectkey: [],
      cateprop: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
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
      }
    },
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getcatelist()
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getcatelist()
    },
    async getparentcatliist() {
      const { data: res } = await this.$http.get('/categories', {
        params: { type: 2 },
      })
      if (res.meta.status != 200) {
        this.$message.error('获取失败')
      } else {
        this.parentcatliist = res.data
      }
    },
    Addcategory() {
      this.Additem = true
      this.getparentcatliist()
    },
    handleChange() {
      if(this.selectkey.length>0){
        this.addcateform.cat_pid=this.selectkey[this.selectkey.length-1]
        this.addcateform.cat_level=this.selectkey.length
      }
      console.log(this.addcateform)
    },
    async subaddcate(){
      const {data:res}=await this.$http.post('/categories',this.addcateform)
      if(res.meta.status!=201){
        this.$message.error('数据获取失败')
        console.log(res)
      }else{
        this.getcatelist()
        this.guanbi()
      }
    },
    guanbi(){
      this.$refs.addcateform.resetFields()
      this.selectkey=[]
      this.addcateform={
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      this.Additem=false
    },
    open(scoop) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res}=await this.$http.delete(`categories/${scoop.cat_id}`)
          if(res.meta.status != 200){
            this.$message.error('删除失败')
          }else{
            this.$message.success('删除成功')
            this.getcatelist()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
  },
}
</script>
<style scoped>
</style>