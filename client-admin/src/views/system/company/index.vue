<template>
  <div class="app-container">
    <!-- 页面操作按钮 -->
    <el-row class="handle-bar">
      <el-button size="small" @click="handleAddUser">
        <i class="el-icon-plus" /> 新增用户
      </el-button>
    </el-row>

    <!-- 用户列表 -->
    <el-table
      v-loading="loading"
      :data="userList"
      row-key="id"
      border
    >
      <el-table-column label="用户ID" align="center" prop="userId" width="300" />
      <el-table-column label="用户名称" header-align="center" prop="username" />
      <el-table-column label="角色" header-align="center" prop="roleName" />
      <el-table-column label="手机号" align="center" prop="telephone" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEditUser(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDisable(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        style="float:right;margin:20px 0"
        :current-page="currentPage"
        :page-sizes="[pageSize,20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 用户弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'修改用户':'新增用户'"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="userInfo" label-width="80px">
        <el-form-item v-if="dialogType==='edit'" label="用户ID">
          <el-input v-model="userInfo.userId" disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfo.telephone" placeholder="手机号码" />
        </el-form-item>
        <el-form-item label="公司部门">
          <el-cascader
            v-model="userInfo.deptId"
            :options="companyList"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-cascader
            v-model="userInfo.roleId"
            :show-all-levels="false"
            :options="roleList"
            :props="{expandTrigger: 'hover', checkStrictly: true}"
          />
        </el-form-item>
        <el-form-item v-show="dialogType==='edit'?false:true" label="设置密码">
          <el-input v-model="userInfo.password" placeholder="密码为6-18位字母或数字" />
        </el-form-item>
        <el-form-item v-show="dialogType==='edit'?false:true" label="设置密码">
          <el-input v-model="userInfo.passwordConfirm" placeholder="请重复输入密码" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="userInfo.remark"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="userInfo.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <el-dialog
      v-loading="loading"
      :visible.sync="dialogPasswordVisable"
      :close-on-click-modal="false"
      title="重置密码"
      width="800px"
    >
      <el-form :model="userInfo" label-width="80px">
        <el-form-item label="设置密码" style="width: 80%;">
          <el-input v-model="resetObj.password" placeholder="密码为6-18位字母或数字" />
        </el-form-item>
        <el-form-item label="设置密码" style="width: 80%;">
          <el-input v-model="resetObj.passwordConfirm" placeholder="请重复输入密码" />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button @click="dialogPasswordVisable=false">取消</el-button>
        <el-button type="primary" @click="resetPassword">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getCompany, setCompany, deleteCompany, updateCompany } from '@/api/company'

const defaultRole = {
  id: null,
  name: '',
  remark: '',
  status: 1,
  routes: []
}

@Component({ name: 'systemCompany' })
export default class extends Vue {
  private loading = true
  private currentPage=1
  private pageSize=10
  private total=0
  private userInfo:any = { status: 0 }
  private companyList:any[]=[]
  private dialogVisible = false
  private dialogType = 'new'
  private userList:any[] = []
  created() {
    this.getCompanyList()
  }

  get userRoleId() {
    return UserModule.roles[0]
  }

  get name() {
    return UserModule.name
  }

  private async getCompanyList() {
    const { data } = await getCompany({})
    const company:any[] = []
    const companyIds:any[] = []
    data.map((element:any) => {
      if (companyIds.indexOf(element.id) === -1) {
        companyIds.push(element.id)
        element.value = element.id
        element.label = element.company
        company.push(element)
        const e = JSON.parse(JSON.stringify(element))
        e.label = element.department
        e.value = element.id
        company[company.length - 1].children = [e]
      } else {
        const ele = JSON.parse(JSON.stringify(element))
        ele.label = element.department
        ele.value = element.id
        company[companyIds.indexOf(element.id)].children.push(ele)
      }
    })
    this.companyList = company
  }

  private handleAddUser() {
    this.dialogType = 'new'
    this.dialogVisible = true
  }

  private handleEditUser({ row }: any) {
    this.dialogType = 'edit'
    this.dialogVisible = true
    this.userInfo = Object.assign({}, row)
    this.userInfo.deptId = [this.userInfo.deptId, this.userInfo.deptId]
    this.userInfo.roleId = [this.userInfo.roleId]
  }

  private handleDisable({ row }: any) {
    this.$confirm('确定禁用用户？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async() => {
        const res = await deleteCompany({ userId: row.userId })
        this.getCompanyList()
        this.$message({
          type: 'success',
          message: res.data.msg
        })
      })
      .catch(err => { console.error(err) })
  }

  private async confirmUser() {
    const params = Object.assign({}, this.userInfo, { deptId: this.userInfo.deptId[0], operator: this.name, operateTime: new Date() })
    const res = this.dialogType === 'edit' ? await updateCompany(params) : await setCompany(params)
    this.$message({
      type: 'success',
      message: res.data.msg
    })
    this.dialogVisible = false
    this.userInfo = { status: 0 }
    this.getCompanyList()
  }

  private async handleChange(val: any) {
    console.log('change', val)
  }

  private handleSizeChange(val:any) {
    console.log(`每页 ${val} 条`)
    this.pageSize = val
    this.getCompanyList()
  }

  private handleCurrentChange(val:any) {
    console.log(`当前页: ${val}`)
    this.currentPage = val
    this.getCompanyList()
  }
}
</script>
