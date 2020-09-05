<template>
  <div>
    <!-- 面包蟹导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">订单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 设置卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="ordersdata.query" clearable @clear="getorderlist" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="getorderlist"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 设置表格 -->
      <el-table :data="orderslist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | conversion}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" class="el-icon-edit" @click="showbox" size="small"></el-button>
            <el-button type="success" class="el-icon-location" size="small" @click="showLinfobox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 设置分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.ordersdata.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="this.ordersdata.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog title="修改地址" :visible.sync="dialogVisible" width="50%">
      <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="name">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="name">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="showLinfo" width="30%">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in kuaid"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLinfo = false">取 消</el-button>
        <el-button type="primary" @click="showLinfo = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'orders',
  created() {
    this.getorderlist()
  },
  data() {
    return {
      //商品数据导航
      ordersdata: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //订单数据
      orderslist: [],
      //一共有多少条数据
      total: null,
      //控制对话框的展示
      dialogVisible: false,
      //控制物流信息展示
      showLinfo: false,
      //保存物流信息
      kuaid: [],
    }
  },
  methods: {
    // 发送点单数据的axios请求
    async getorderlist() {
      const { data: res } = await this.$http.get('orders', {
        params: this.ordersdata,
      })
      if (res.meta.status != 200) {
        this.$message.error('请求失败')
        console.log(res.data)
      } else {
        this.orderslist = res.data.goods
        this.total = res.data.total
      }
    },
    handleSizeChange(newSize) {
      this.ordersdata.pagesize = newSize
      this.getorderlist()
    },
    handleCurrentChange(newPage) {
      this.ordersdata.pagenum = newPage
      this.getorderlist()
    },
    //展示修改对话框
    showbox() {
      this.dialogVisible = true
    },
    //展示物流信息对话框
    async showLinfobox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status != 200) {
        this.$message.error('获取数据失败')
        console.log(res.data)
      } else {
        this.kuaid = res.data
      }
      this.showLinfo = true
    },
  },
}
</script>
<style scoped>
</style>