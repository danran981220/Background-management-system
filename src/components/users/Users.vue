<template>
  <div>
    <!-- 面包蟹导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 搜索区 -->
      <!-- :gutter给每个col添加间距 -->
      <el-row :gutter="20">
        <!-- span-----每行竖着分成24份，span:7--占7份 -->
        <el-col :span="7">
          <!-- 输入框   clearable：是否可清空的  @ckear：点击清空按钮时触发-->
          <!--v-model="querinfo.query"  ：绑定查询参数，默认值为空，表示查询所有数据  -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="querinfo.query"
            clearable
            @clear="getuserlist"
          >
            <!-- 点击搜索 -->
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <!-- 点击添加用户，触发dialog的显示条件 -->
          <el-button type="primary" @click="isdialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区   绑定数据userlist-->
      <el-table :data="userlist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 添加一个状态转换按钮 -->
          <template v-slot="slotProps">
            <!--v-model="slotProps.row.mg_state"-根据初始状态显示  @change="changeuser(slotProps.row)"-----发生改变是调用该函数 -->
            <el-switch v-model="slotProps.row.mg_state" @change="changeuser(slotProps.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <!-- 修改按钮，点击触发 showdialog(scoped.row.id)-->
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showdialog(scoped.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="open(scoped.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="Showassignments(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <!--@size-change="handleSizeChange" --------每页显示条目改变时候触发
        @current-change="handleCurrentChange"------当前页码改变时候触发
        
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.querinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="this.querinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.otto"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框    @close="guanbi"----关闭时触发函数-------------------------------------------------------->
    <el-dialog title="添加用户" :visible.sync="isdialog" width="30%" @close="guanbi">
      <el-form
        :model="usermessage"
        :rules="useraddrules"
        label-width="100px"
        class="demo-ruleForm"
        ref="adduser"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="usermessage.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="usermessage.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="usermessage.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="usermessage.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdialog = false">取 消</el-button>
        <el-button type="primary" @click="tijiao">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <!-- :visible.sync="dialogVisible"    ---是否显示该对话框 -->
    <el-dialog title="修改用户" :visible.sync="isxiugaidialog" width="50%">
      <!-- 双向绑定数据 -->
      <el-form
        :model="queryusermessage"
        :rules="queryusermessagerules"
        ref="queryusermessageref"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="queryusermessage.username" disabled></el-input>
        </el-form-item>
        <!-- prop：设置校验规则 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="queryusermessage.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="queryusermessage.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isxiugaidialog = false">取 消</el-button>
        <el-button type="primary" @click="prevalidation">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="Assignroles" width="30%" @close="cp">
      <div>
        <p>当前用户名字：{{userpi.username}}</p>
      </div>
      <div>
        <p>当前用户权限：{{userpi.role_name}}</p>
      </div>
      <div>权限选择：
        <el-select v-model="promiseid" placeholder="请选择" size="small">
          <el-option
            v-for="item in Permissionlist"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Assignroles = false">取 消</el-button>
        <el-button type="primary" @click="Roleauthorization">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'users',
  data() {
    var checkemail = (rule, value, cb) => {
      var regemail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regemail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    var checkphone = (rule, value, cb) => {
      const regphone = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regphone.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      querinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      otto: null,
      isdialog: false,
      usermessage: {
        username: '',
        password: '',
        email: '',
        phone: '',
      },
      useraddrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkphone, trigger: 'blur' },
        ],
      },
      isxiugaidialog: false,
      queryusermessage: {},
      queryusermessagerules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkphone, trigger: 'blur' },
        ],
      },
      Assignroles: false,
      userpi: {},
      Permissionlist: [],
      //选择的角色id
      promiseid:''
    }
  },
  // 在编译模板之前触发钩子函数
  created() {
    this.getuserlist()
  },
  methods: {
    // 发送axios请求，查询用户列表数据
    async getuserlist() {
      const { data: res } = await this.$http.get('users', {
        params: this.querinfo,
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
      } else {
        // 保存用户数据，，-------------------并保存当前用户的数目
        ;(this.userlist = res.data.users), (this.otto = res.data.total)
      }
    },
    //发送状态改变的请求
    async changeuserstate(uid, type) {
      const { data: res } = await this.$http.put(`users/${uid}/state/${type}`)
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
      } else {
        this.$message.success('更新成功')
      }
    },
    handleSizeChange(newSize) {
      this.querinfo.pagesize = newSize
      this.getuserlist()
    },
    handleCurrentChange(newPage) {
      this.querinfo.pagenum = newPage
      this.getuserlist()
    },
    //接受状态按钮调用来的参数，并且加工后交给changeuserstate处理
    changeuser(a) {
      this.changeuserstate(a.id, a.mg_state)
    },
    //用户添加表单重置功能
    guanbi() {
      this.$refs.adduser.resetFields()
    },
    // 用户添加提交
    tijiao() {
      // 如果表单验证全部通过
      this.$refs.adduser.validate(async (res) => {
        if (!res) return
        else {
          const { data: res } = await this.$http.post('users', this.usermessage)
          if (res.meta.status !== 201) {
            this.$message.error('添加失败')
            console.log(res)
          } else {
            this.$message.success('添加成功')
            // 成功后关闭弹出框
            this.isdialog = false
            //重新调用userlist函数
            this.getuserlist()
          }
        }
      })
    },
    // 展示用户修改框，并发送请求
    async showdialog(id) {
      this.isxiugaidialog = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询失败')
      } else {
        // 用this.queryusermessage来保存数据
        this.queryusermessage = res.data
        this.$message.success('查询成功')
      }
    },
    // 修改用户的提交调用的函数，表单的与验证和提交
    prevalidation() {
      // 如果表单验证全部通过
      this.$refs.queryusermessageref.validate(async (value) => {
        if (!value) return
        //验证通过，发起请求信息
        const { data: res } = await this.$http.put(
          'users/' + this.queryusermessage.id,
          {
            email: this.queryusermessage.email,
            mobile: this.queryusermessage.mobile,
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新失败')
          console.log(res)
        } else {
          //关闭弹框
          this.isxiugaidialog = false
          //提示修改成功
          this.$message.success('修改成功')
          //刷新列表
          this.getuserlist()
        }
      })
    },
    open(id) {
      const userid = id
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
          const { data: res } = await this.$http.delete('users/' + userid)
          if (res.meta.status != 200) {
            console.log(res)
          } else {
            //刷新用户列表
            this.getuserlist()
          }
        })
        .catch((result) => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 点击分配权限按钮时显示
    async Showassignments(pi) {
      this.userpi = pi
      //在展示对话框之前获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取失败')
      } else {
        this.Permissionlist = res.data
        console.log(this.Permissionlist)
      }
      this.Assignroles = true
    },
    //提交角色分配结果
    async Roleauthorization(){
      this.Assignroles = false
      const {data:res}=await this.$http.put(`users/${this.userpi.id}/role`,{rid:this.promiseid})
      if(res.meta.status !== 200){
        this.$message.error('获取数据失败')
        console.log(res)
      }else{
        this.$message.success('更新成功')
        this.getuserlist()
      }
    },
    cp(){
      this.promiseid=''
      this.userpi={}
    }
  },
}
</script>
<style scoped lang="less">
.el-pagination {
  margin-top: 20px;
}
</style>