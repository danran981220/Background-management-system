<template>
  <div>
    <!-- 设置面包蟹 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- active	设置当前激活步骤,space	每个 step 的间距，不填写将自适应间距。支持百分比。
      finish-status	设置结束步骤的状态
      -->
      <!--:active="activeindex - 0"   ---!记得把字符串转化为数组  -->
      <el-steps :active="activeindex - 0" :space="200" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--:tab-position="tabPosition"设置位置
      -->
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          style="height: 200px;"
          v-model="activeindex"
          :before-leave="beforeleave"
          @tab-click="tabclick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateprops"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manycate" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="itemm in item.attr_vals" :label="itemm" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlycate" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action----上传图片请求的后台接口
            :on-preview-----点击上传上去的图片后触发的预览效果
            :on-remove------点击×号后立刻调用
            list-type------设置预览组件的呈现方式
            :header ------手动设置请求头，不然会报无效token
            -->

            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="handlesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 设置点击预览效果时的弹出框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
        <img :src="preview" alt="预览图片" class="previewimg">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Addshop',
  data() {
    return {
      activeindex: '0',
      tabPosition: 'left',
      // 设置添加表单的数据保存
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        pics: [],
      },
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
      },
      catelist: [],
      cateprops: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //保存动态参数
      manycate: [],
      //保存静态参数
      onlycate: [],
      //设置请求头
      headerobj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      dialogVisible:false,
      preview:''
    }
  },
  created() {
    this.getcategories()
  },
  methods: {
    async getcategories() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        this.$message.error('获取失败')
      } else {
        this.catelist = res.data
      }
    },
    handleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = []
        this.activeindex = 0
      }
    },
    beforeleave(newname, oldname) {
      if (oldname == 0) {
        if (this.addForm.goods_cat.length < 3) {
          this.$message.error('请选择商品分类')
          return false
        }
      }
    },
    async tabclick() {
      if (this.activeindex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.catid}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )
        if (res.meta.status != 200) {
          this.$message.error('获取失败')
        } else {
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manycate = res.data
        }
      } else if (this.activeindex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.catid}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )
        if (res.meta.status != 200) {
          this.$message.error('获取失败')
        } else {
          this.onlycate = res.data
          console.log(this.onlycate)
        }
      }
    },
    //设置预览操作
    handlePreview(file) {
      console.log(file)
      this.preview = file.response.data.url
      this.dialogVisible=true
    },
    //设置请求成功后的回调函数
    handlesuccess(response) {
      this.addForm.pics.push(response.data.tmp_path)
      console.log(this.addForm.pics)
    },
    //设置移除后的回调函数
    handleRemove(file) {
      //获取要删除图片的路径
      const path = file.response.data.tmp_path
      //从pic数组中找到要删除图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => {
        x = path
      })
      this.addForm.pics.splice(i, 1)
    },
  },
  computed: {
    //设置过滤器
    catid() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    },
  },
}
</script>
<style scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-tabs {
  margin-top: 15px;
  height: 900px !important;
}
.previewimg{
  width: 100%;
}
</style>