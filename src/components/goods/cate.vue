<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类对话框按钮 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showCateDialog"
          >添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        show-row-hover
        class="treetable"
      >
        <template
          slot="isok"
          slot-scope="scope"
        >
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
            style="color:lightgreen"
          ></i>
          <i
            class="el-icon-error"
            v-else
          ></i>
        </template>
        <template
          slot="order"
          slot-scope="scope"
        >
          <el-tag
            v-if="scope.row.cat_level===0"
            size="mini"
            type="primary"
          >一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level===1"
            type="warning"
          >二级</el-tag>
          <el-tag
            size="mini"
            v-else
            type="danger"
          >三级</el-tag>
        </template>
        <template
          slot="opt"
          slot-scope="scope"
        >
          <el-button
            class="el-icon-edit"
            type="primary"
            size="mini"
            @click="showPutDialog(scope.row)"
          >编辑</el-button>
          <el-button
            class="el-icon-delete"
            type="danger"
            size="mini"
            @click="removeById(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addcateVisible"
      width="30%"
      @click="addcateDialogClosed"
    >
      <!-- 添加分类对话框的项 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCatFormRel"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item
          label="父级分类"
          prop="cat_name"
        >
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addcateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="putVisible"
      width="50%"
      @click="putcateDialogClosed"
    >
      <!-- 添加分类对话框的项 -->
      <el-form
        :model="putCateForm"
        :rules="putCateRules"
        ref="putCatFormRel"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="putCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="putVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putCate"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          prop: 'cat_name',
          label: '分类名称'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框显示与隐藏
      addcateVisible: false,
      // 父级分类的列表
      parentCateList: [],
      // 指定级联配置选择器对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 编辑提交分类对话框显示
      putVisible: false,
      putCateForm: {
        cat_name: '',
        cat_id: '',
        cat_deleted: '',
        cat_level: ''
      },
      id: '',
      putCateRules: {
        cat_level: [
          { required: true, message: '请输入排序序', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('请求商品分类失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 分页器页面
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 点击按钮展示添加对话框
    showCateDialog() {
      this.getParentCateList()
      this.addcateVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('请求父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果select中的lenhth>0证明选中父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      this.$refs.addCatFormRel.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addcateVisible = false
      })
    },
    // 监听对话框的关闭事件 重置表单数据
    addcateDialogClosed() {
      this.$refs.addCatFormRel.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 是否删除当前角色对话框
    async removeById(role) {
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
      this.$axios.delete('categories/' + role.cat_id).then((response) => {
        const res = response.data
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getCateList()
      })
    },
    // 提交分类对话框显示
    showPutDialog(role) {
      this.putCateForm = role
      this.id = role.cat_id
      this.putVisible = true
    },
    // 提交分类对话框关闭
    putcateDialogClosed() {
      this.$refs.putCatFormRel.resetFields()
    },
    // 确定提交修改分类角色对话框
    putCate() {
      this.$axios({
        method: 'put',
        url: 'categories/' + this.id,
        data: this.putCateForm
      }).then((response) => {
        this.getCateList()
        this.putVisible = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.treetable {
  margin-top: 15px;
}
</style>
