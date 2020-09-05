<template>
  <div>
    <!-- 面包蟹导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">数据统计</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 设置卡片区 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 950px;height:500px;"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'reports',
  data() {
    return {}
  },
  created() {},
  methods: {},
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    res.data.title = {
      text: '用户来源',
    }
    res.data.tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3',
        },
      },
    }
    res.data.grid = {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(res.data)
  },
}
</script>
<style scoped>
</style>