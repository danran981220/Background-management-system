<template>
  <div class="login_contaicer">
    <div class="login_box">
      <!-- 头像 -->
      <div class="login_active">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单 -->
      <el-form
        label-width="0"
        class="login_form"
        :model="loginform"
        :rules="login_rules"
        ref="loginform"
      >
        <!-- 用户名 --> 
         <!--prop绑定表单的验证规则  -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginform.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-unlock" v-model="loginform.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="denglu">登录</el-button>
          <el-button type="info" @click="chongzhi">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      //登录表单数据绑定对象，保存数据
      loginform: {
        username: '',
        password: ''
      },
      //表单验证规则
      login_rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    chongzhi() {
      // 重置表单的方法
      this.$refs.loginform.resetFields()
    },
    // 登录时对表单进行效验
    denglu() {
      // 对表单进行效验的方法
      this.$refs.loginform.validate(async res => {
        if (!res) {
          return
        } else {
          const { data: res } = await this.$http.post('login', this.loginform)
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')
          } else {
            this.$message.success('登录成功')
            //将登录成功后返回的token保存到客户端的session
            window.sessionStorage.setItem('token', res.data.token)
            //跳转界面
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.login_contaicer {
  background-color: #2b4d6d;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login_active {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>