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
          <el-button type="primary" size="mini" @click="handleReset(scope)">重置密码</el-button>
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
            :options="roleList"
            :show-all-levels="false"
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
import { throttle } from '@/decorator'
import { UserModule } from '@/store/modules/user'
import { getRoles } from '@/api/roles'
import { getCompany } from '@/api/company'
import { getUsers, deleteUser, setUser, updateUser, resetPassword } from '@/api/users'

const defaultRole = {
  id: null,
  name: '',
  remark: '',
  status: 1,
  routes: []
}

@Component({ name: 'systemUser' })
export default class extends Vue {
  private loading = true
  private currentPage=1
  private pageSize=10
  private total=0
  private userInfo:any = { status: 0 }
  private companyList:any[]=[]
  private roleArr:any[]=[]
  private role = Object.assign({}, defaultRole)
  private userList:any[] = []
  private roleList:any[] = []
  private currentUser={ userId: '' }
  private dialogVisible = false
  private dialogType = 'new'
  private dialogPasswordVisable = false
  private resetObj = {
    passwordConfirm: '',
    password: ''
  }

  private defaultProps = {
    children: 'children',
    label: 'name'
  }

  created() {
    this.getUsersList()
    this.getRoleList()
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

  private async getRoleList() {
    const { data } = await getRoles({ roleId: this.userRoleId })
    this.roleList = data
    this.getTree(this.roleList)
    this.roleList.length && this.filterRole(this.roleList) // 铺平所有角色
  }

  private getTree(arr:any) {
    arr.map((e:any) => {
      e.label = e.name
      e.value = e.id
      if (e.children && e.children.length) {
        this.getTree(e.children)
      } else {
        delete e.children
      }
    })
  }

  private async getUsersList() {
    const { data: { records, count } } = await getUsers({ roleId: this.userRoleId, currentPage: this.currentPage, pageSize: this.pageSize })
    this.userList = records
    this.total = count
    this.loading = false
  }

  private handleAddUser() {
    this.role = Object.assign({}, defaultRole)
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
        const res = await deleteUser({ userId: row.userId })
        this.getUsersList()
        this.$message({
          type: 'success',
          message: res.data.msg
        })
      })
      .catch(err => { console.error(err) })
  }

  private filterRole(arr:any[]) {
    arr.forEach((element:any) => {
      this.roleArr.push({ id: element.id, name: element.name })
      if (element.children && element.children.length) {
        this.filterRole(element.children)
      }
    })
  }

  @throttle
  private async confirmUser() {
    const role:any = this.roleArr.filter((e: any) => e.id === this.userInfo.roleId[this.userInfo.roleId.length - 1])
    const params = Object.assign({}, this.userInfo, { roleId: role[0].id, roleName: role[0].name, deptId: this.userInfo.deptId[0], operator: this.name, operateTime: new Date() })
    const res = this.dialogType === 'edit' ? await updateUser(params) : await setUser(params)
    this.$message({
      type: 'success',
      message: res.data.msg
    })
    this.dialogVisible = false
    this.userInfo = { status: 0 }
    this.getUsersList()
  }

  private async handleChange(val: any) {
    console.log('change', val)
  }

  private async handleReset({ row }: any) {
    this.dialogPasswordVisable = true
    this.currentUser = row
  }

  private async resetPassword() {
    if (!this.resetObj.password || !this.resetObj.passwordConfirm) {
      this.$message({
        type: 'warning',
        message: '密码不能为空'
      })
    } else if (this.resetObj.password !== this.resetObj.passwordConfirm) {
      this.$message({
        type: 'warning',
        message: '密码不一致'
      })
    } else {
      const res = await resetPassword({ userId: this.currentUser.userId, password: this.resetObj.password })
      this.$message({
        type: 'success',
        message: res.data.msg
      })
      this.resetObj.password = this.resetObj.passwordConfirm = ''
      this.loading = false
      this.dialogPasswordVisable = false
    }
  }

  private handleSizeChange(val:any) {
    console.log(`每页 ${val} 条`)
    this.pageSize = val
    this.getUsersList()
  }

  private handleCurrentChange(val:any) {
    console.log(`当前页: ${val}`)
    this.currentPage = val
    this.getUsersList()
  }
}
</script>
