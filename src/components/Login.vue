<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img
          src="../assets/logo.png"
          alt=""
        >
      </div>
      <!-- 登录表单区域 -->
      <el-form
        class="login-form"
        :rules="rules"
        :model="loginform"
        ref="loginRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginform.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item
          label=""
          prop="password"
        >
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginform.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单的登录数据绑定对象
      loginform: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 ~ 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginRef.resetFields()
    },
    login() {
      this.$refs.loginRef.validate(async (valid) => {
        if (!valid) { return false }
        this.$axios({
          method: 'post',
          url: 'login',
          data: this.loginform
        }).then((response) => {
          const res = response.data
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码错误')
          }
          this.$message.success('登录成功')
          // 1 登录成功后的token，保存到sessionStorage中
          //    1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
          //    1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          // 2 通过编程式导航跳转到后台主页,路由地址是 /home
          this.$router.push('/home')
          this.$router.beforeEach()
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login-container {
  background: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background: #ffffff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar-box {
    width: 130px;
    height: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    background-color: #ffffff;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
