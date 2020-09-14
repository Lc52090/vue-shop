<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡牌视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </el-card>

    <!-- 订单列表数据 -->
    <el-table
      :data="orderList"
      border
      striper
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="订单编号"
        prop="order_number"
      ></el-table-column>
      <el-table-column
        label="订单价格"
        prop="order_price"
      ></el-table-column>
      <el-table-column
        label="是否付款"
        prop="pay_status"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            v-if="scope.row.pay_status==='1'"
          >已付款</el-tag>
          <el-tag
            type="danger"
            v-else
          >未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否发货"
        prop="is_send"
      ></el-table-column>
      <el-table-column
        label="下单时间"
        prop="create_time"
      >
        <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showBox"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            @click="showProgressBox"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <span>
        <!--  表单验证 -->
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item
            label="省市区/县"
            prop="address1"
          >
            <!-- 级联选择器 -->
            <el-cascader
              :options="cityData"
              v-model="addressForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="address2"
          >
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addressVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <span>
         <!--  时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 1,
      orderList: [],
      addressVisible: false,
      // 表单验证
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrderlist()
  },
  methods: {
    async getOrderlist() {
      const { data: res } = await this.$axios.get('orders', { params: this.queryinfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
      console.log(this.orderList)
    },
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getOrderlist()
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getOrderlist()
    },
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$axios.get('kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.progressInfo = res.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>
