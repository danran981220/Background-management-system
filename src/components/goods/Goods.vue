<template>
  <div>
    <!-- 设置面包蟹 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row :gutter="20">
        <!-- span-----每行竖着分成24份，span:7--占7份 -->
        <el-col :span="7">
          <!-- 输入框   clearable：是否可清空的  @ckear：点击清空按钮时触发-->
          <!--v-model="querinfo.query"  ：绑定查询参数，默认值为空，表示查询所有数据  -->

          <!--v-model="querinfo.query"  @clear="getuserlist"-->
          <el-input placeholder="请输入内容" class="input-with-select" clearable
          v-model="getshoplistcanshu.query" @clear="getshoplist">
            <!-- 点击搜索 -->
            <!--@click="getuserlist"  -->
            <el-button slot="append" icon="el-icon-search" @click="getshoplist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <!-- 点击添加用户，触发dialog的显示条件 -->
          <!-- @click="isdialog=true" -->
          <el-button type="primary" @click="addshop">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 设置表格 -->
      <el-table :data="shoplist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="600px"></el-table-column>
        <el-table-column label="商品价格(单元)" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time | conversion}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <!-- @click="showdialog(scope.row.id)" -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="open(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 设置分页区 -->
      <!-- @size-change="handleSizeChange" --------每页显示条目改变时候触发
        @current-change="handleCurrentChange"------当前页码改变时候触发
        :current-page-------当前页数
        :total------当前条目总数
         -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.getshoplistcanshu.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="this.getshoplistcanshu.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.otto"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Goods',
  data() {
    return {
      //获取商品列表数据,并设置默认参数
      getshoplistcanshu: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //保存商品列表数据
      shoplist: [],
      //保存当前条目总数
      otto:null
    }
  },
  methods: {
    //获取商品列表数据
    async getshoplist() {
      //发送获取商品列表的请求
      const { data: res } = await this.$http.get(`goods`, {
        params: this.getshoplistcanshu,
      })
      if (res.meta.status != 200) {
        this.$message.error('获取失败')
      } else {
        this.shoplist = res.data.goods
        this.otto=res.data.total
      }
    },
    handleSizeChange(newSize){
      this.getshoplistcanshu.pagesize=newSize
      this.getshoplist()
    },
    handleCurrentChange(newPage){
      this.getshoplistcanshu.pagenum=newPage
      this.getshoplist()
    },
    open(id){
      const shopid = id
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          const { data: res } = await this.$http.delete('goods/' + shopid)
          if (res.meta.status != 200) {
            console.log(res)
          } else {
            //刷新商品列表
            this.getshoplist()
          }
        })
        .catch((result) => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    addshop(){
      this.$router.push('/goods/add')
    }
  },
  //生命周期钩子函数
  created() {
    this.getshoplist()
  },
}
</script>
<style scoped>
</style>