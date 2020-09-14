<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">角色管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showAddRolesDialog"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table
        :data="roleList"
        border
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbtm',i1===0?'bdtop':'','vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close='removeById(scope.row,item1.id)'
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过循环渲染二级权限 -->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close='removeById(scope.row,item2.id)'
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close='removeById(scope.row,item3.id)'
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300"
        >
          <!-- 操作按钮部分-->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showeditRoles(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showRolesConfirm(scope.row)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showsetDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框-->
    <el-dialog
      title="提示"
      :visible.sync="setDialog"
      width="30%"
      @close="setRightDialogClosed"
    >
      <!-- 分配权限对话框内权限内容 -->
      <span>
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addRolesDialog"
      width="50%"
      @close="addRolesDialogClosed"
    >
      <!-- 分配权限对话框内权限内容 -->
      <span>
        <el-form
          :model="RolesForm"
          :rules="RolesFormRules"
          ref="RolesFormRef"
          label-width="100px"
        >
          <el-form-item
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="RolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="roleDesc"
          >
            <el-input v-model="RolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRoles"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editRolesVisible"
      width="50%"
      @close="editRolesDialogClosed"
    >
      <!-- 分配权限对话框内权限内容 -->
      <span>
        <el-form
          :model="editRolesForm"
          :rules="RolesFormRules"
          ref="editRolesFormRef"
          label-width="100px"
        >
          <el-form-item
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="roleDesc"
          >
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRoles"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // 分配权限对话框的隐藏与显示
      setDialog: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id的值
      defKeys: [],
      // 当前即将分配权限的id
      roleId: '',
      addRolesDialog: false,
      RolesForm: {
        roleName: '',
        roleDesc: ''
      },
      RolesFormRules: {
        roleName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请描述角色', trigger: 'blur' }
        ]
      },
      editRolesVisible: false,
      editRolesForm: {},
      id: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      this.$axios({
        method: 'get',
        url: 'roles'
      }).then((response) => {
        const res = response.data
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.roleList = res.data
      })
    },
    // 根据id删除对应的权限
    async removeById(role, rightId) {
      const confrimResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confrimResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      this.$axios.delete('roles/' + role.id + '/rights/' + rightId).then((response) => {
        const res = response.data
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        }
        role.children = res.data
        console.log(res.data)
      })
    },
    // 展示分配权限的对话框
    showsetDialog(role) {
      this.roleId = role
      // 获取所有的权限数据
      this.$axios.get('rights/tree').then((response) => {
        const res = response.data
        if (res.meta.status !== 200) {
          return this.$message.error('请求权限数据失败')
        }
        this.rightsList = res.data
      })
      // 获取第三节点的id
      this.getleafKeys(role, this.defKeys)
      this.setDialog = true
    },
    // 获取角色下所有三级权限的id，并保存到defkey中
    getleafKeys(node, arr) {
      // 不包含children属性的就是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getleafKeys(item, arr)
      })
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 为角色分配权限
    allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idstr = keys.join(',')
      this.$axios({
        method: 'post',
        url: 'roles/' + this.roleId.id + '/rights',
        data: { rids: idstr }
      }).then((response) => {
        const res = response.data
        if (res.meta.status !== 200) {
          return this.$message.error('请求权限失败')
        }
        this.$message.success('请求权限成功')
        this.getRolesList()
        this.setDialog = false
      })
    },
    // 是否删除当前角色对话框
    async showRolesConfirm(role) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      this.$axios.delete('roles/' + role.id).then((response) => {
        const res = response.data
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getRolesList()
      })
    },
    // 点击展示添加角色对话框
    showAddRolesDialog() {
      this.addRolesDialog = true
    },
    // 点击关闭添加角色对话框
    addRolesDialogClosed() {
      this.$refs.RolesFormRef.resetFields()
    },
    // 点击确定添加角色
    addRoles() {
      this.$refs.RolesFormRef.validate((valid) => {
        console.log(valid)
        if (!valid) {
          return
        }
        this.$axios({
          method: 'post',
          url: 'roles',
          data: this.RolesForm
        }).then((response) => {
          const res = response.data
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
          this.$message.success('添加角色成功')
          this.getRolesList()
          this.addRolesDialog = false
        })
      })
    },
    showeditRoles(role) {
      console.log(role)
      this.editRolesForm = role
      this.id = role.id
      this.editRolesVisible = true
    },
    editRolesDialogClosed() {
      this.$refs.editRolesFormRef.resetFields()
    },
    async editRoles() {
      const { data: res } = await this.$axios({
        method: 'put',
        url: 'roles/' + this.id,
        data: this.editRolesForm
      })
      if (res.meta.status !== 200) {
        return this.$message.error('编辑失败')
      }
      this.$message.success('编辑成功')
      this.getRolesList()
      this.editRolesVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 10px;
}
.bdbtm {
  border-bottom: 1px solid #cccccc;
}
.bdtop {
  border-top: 1px solid #cccccc;
}
</style>
