<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="quertyInfo.query"
              clearable
              @clear="getUselist"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUselist"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              @click="adddialogVisible=true"
            >添加用户</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 用户列表区域 -->
    <el-table
      :data="userlist"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
      ></el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
      ></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userstateChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180px"
      >
        <template slot-scope="scope">
          <!-- 添加按钮 -->
          <el-tooltip
            effect="dark"
            content="添加"
            placement="top-start"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip
            effect="dark"
            content="删除"
            placement="top-start"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <!-- 分配角色 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top-start"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRolesDialog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="quertyInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="quertyInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="adddialogVisible"
      width="30%"
      @close="adddialogClosed"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-form
          ref="addFormRef"
          :model="addForm"
          label-width="70px"
          :rules="addFormrules"
        >
          <el-form-item
            label="用户名"
            prop="username"
          >
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
          >
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="mobile"
          >
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogClosed"
      width="30%"
      @close="editDialogClear"
    >
      <span>
        <!-- 内容主体区域 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input
              v-model="editForm.username"
              disabled=""
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
          >
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="mobile"
          >
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogClosed = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUserInfo"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="showsetDialog"
      width="50%"
      @close="setRolesDialogClosed"
    >
      <div>
        <p>当前的用户:{{userinfo.username}}</p>
        <p>当前的角色:{{userinfo.role_name}}</p>
        <p>分配新角色:
          <el-select
            v-model="selectRoleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="showsetDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveRoleInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[345789]\d{9}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      quertyInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 控制添加用户框的显示与隐藏
      adddialogVisible: false,
      // 控制修改用户框的显示与隐藏
      editDialogClosed: false,
      // 查询到的用户信息对象
      editForm: {},
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 规则
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 ~ 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在 6 ~ 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色对话框显示与隐藏
      showsetDialog: false,
      // 需要被分配角色的用户信息
      userinfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色ID值
      selectRoleId: []
    }
  },
  created() {
    this.getUselist()
  },
  methods: {
    // 请求用户数据函数
    getUselist() {
      this.$axios({
        method: 'get',
        url: 'users',
        params: this.quertyInfo
      }).then((res) => {
        var result = res.data
        if (result.meta.status !== 200) {
          return this.message.error('获取用户列表失败！')
        }
        this.userlist = result.data.users
        this.total = result.data.total
      })
    },
    // 监听pagesize改变事件
    handleSizeChange(val) {
      this.quertyInfo.pagesize = val
      this.getUselist()
    },
    // 监听页码值改变事件
    handleCurrentChange(val) {
      this.quertyInfo.pagenum = val
      this.getUselist()
    },
    // 监听 swicth 开关状态的改变事件
    userstateChange(val) {
      console.log(val)
      this.$axios({
        method: 'put',
        url: 'users/' + val.id + '/state/' + val.msg_state
      }).then((res) => {
        const result = res.data
        if (!result) {
          val.msg_state = !val.msg_state
          return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
      })
    },
    // 添加框关闭事件
    adddialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(vaild => {
        console.log(vaild)
        if (!vaild) {
          return
        }
        // 发起添加用户网络请求
        this.$axios({
          method: 'post',
          url: 'users',
          data: {
            username: this.addForm.username,
            password: this.addForm.password,
            email: this.addForm.email,
            mobile: this.addForm.mobile
          }
        }).then((response) => {
          const res = response.data
          console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          // 隐藏添加用户框
          this.adddialogVisible = false
          // 重新获取用户列表数据
          this.getUselist()
        })
      })
      /* this.$refs.addFormRef.validate(async vaild => {
        console.log(vaild)
        if (!vaild) {
          return
        }
        // 发起添加用户网络请求
        const { data: res } = await this.$axios.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户框
        this.adddialogVisible = false
        // 重新获取用户列表数据
        this.getUselist()
      }) */
    },
    // 展示编辑用户对话框
    showEditDialog(id) {
      this.$axios({
        method: 'get',
        url: 'users/' + id
      }).then((response) => {
        const res = response.data
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('查询用户信息失败')
        }
        this.editForm = res.data
      })
      this.editDialogClosed = true
    },
    // 监听修改用户对话框
    editDialogClear() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(vaild => {
        if (!vaild) {
          return
        }
        // 发送修改用户信息数据的请求
        this.$axios({
          method: 'put',
          url: 'users/' + this.editForm.id,
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        }).then((response) => {
          const res = response.data
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户失败')
          }
          // 关闭对话框
          this.editDialogClosed = false
          // 刷新数据列表
          this.getUselist()
          // 提示修改成功
          this.$message.success('更新用户成功')
        })
      })
    },
    // 根据id删除用户信息确认和取消
    async removeUserById(id) {
      // 询问用户是否删除数据
      const confrimResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confrimResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$axios.delete('users/' + id).then((response) => {
        const res = response.data
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUselist()
      })
    },
    // 分配角色对话框
    setRolesDialog(userinfo) {
      this.userinfo = userinfo
      // 展开对话框之前获取所有的用户列表
      this.$axios.get('roles').then((response) => {
        const res = response.data
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.rolesList = res.data
      })
      this.showsetDialog = true
    },
    // 点击按钮 分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择需要分配的角色')
      }
      const { data: res } = await this.$axios.put('users/' + this.userinfo.id + '/role', {
        rid: this.selectRoleId
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUselist()
      this.showsetDialog = false
    },
    // 监听分配角色对话框的关闭重置
    setRolesDialogClosed() {
      this.selectRoleId = ''
      this.userinfo = ''
    }
  }
}
</script>

<style lang='less' scoped>
</style>
