<template>
  <div class="app-container">
    <!-- 页面操作按钮 -->
    <!-- <el-row class="handle-bar">
      <el-button size="small" @click="handleAddRole">
        <i class="el-icon-plus" /> 新增角色
      </el-button>
    </el-row> -->

    <!-- 角色列表 -->
    <el-table
      :data="roleList"
      row-key="id"
      default-expand-all
      border
    >
      <el-table-column label="角色名称" header-align="center" prop="name" min-width="200" />
      <el-table-column label="ID" align="center" prop="id" width="60" />
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" min-width="100" />
      <el-table-column label="操作" align="center" width="360">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEditRole(scope)">编辑角色</el-button>
          <el-button type="success" size="mini" @click="handleAddRole(scope)">添加子角色</el-button>
          <el-button type="primary" size="mini" @click="handlePermission(scope)">分配权限</el-button>
          <el-button v-if="power.del" type="danger" size="mini" @click="handleDeleteRole(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'修改角色':'新增角色'"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="role" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="role.remark"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="role.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

    <!-- 角色权限弹窗 -->
    <el-dialog
      :visible.sync="dialogPermissionVisable"
      :close-on-click-modal="false"
      title="权限分配"
      width="800px"
    >
      <el-form>
        <el-form-item>
          <div class="tree-head">
            <span class="col-1">菜单名称</span>
            <span class="col-2">操作权限</span>
          </div>

          <!-- 权限操作树 -->
          <el-tree
            ref="tree"
            element-loading-background="#fff"
            node-key="id"
            show-checkbox
            default-expand-all
            class="permission-tree"
            :data="permsData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :check-strictly="checkStrictly"
            @check="handleCheck"
          >
            <div slot-scope="{node, data}" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <el-checkbox-group v-model="data.operableList" @change="handleCheckedOperations(node, data)">
                <el-checkbox v-for="item in data.operationList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tree>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button @click="dialogPermissionVisable=false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { throttle } from '@/decorator'
import { cloneDeep } from 'lodash'
import { Tree } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { generateArrByTree, generateAllRoutesTree, generateRoleRoutesTree, getPower } from '@/utils'
import { getRoles, addRole, updateRole, deleteRole } from '@/api/roles'
import { getRoleMenus, setRoleMenus } from '@/api/permission'

interface IRole {
  id: number | null
  name: string
  remark: string
  status: number
  routes: any[]
}

const defaultRole:IRole = {
  id: null,
  name: '',
  remark: '',
  status: 1,
  routes: []
}

@Component({ name: 'systemRole' })
export default class extends Vue {
  private loading = false
  private role = Object.assign({}, defaultRole)
  private roleList:any[] = []
  private permsData:object[] = []
  private dialogVisible = false
  private dialogType = 'new'
  private dialogPermissionVisable = false
  private checkStrictly = false
  private defaultProps = {
    children: 'children',
    label: 'name'
  }

  created() {
    this.getRoleList()
    this.getPermission()
  }

  get userRoleId() {
    return UserModule.roles[0]
  }

  get power() {
    return getPower(this.$route.meta.operableList)
  }

  private async getRoleList() {
    const { data } = await getRoles({ roleId: this.userRoleId })
    this.roleList = data[0].children
    console.log(this.roleList)
  }

  private async getPermission() {
    const { data: { records } } = await getRoleMenus({ roleId: this.userRoleId })
    this.permsData = generateAllRoutesTree(records)
    console.log(this.permsData)
  }

  private async handlePermission(scope:any) {
    this.loading = true
    this.dialogPermissionVisable = true
    this.checkStrictly = true
    this.role = Object.assign({}, scope.row)
    const { data: { records } } = await getRoleMenus({ roleId: this.role.id })
    this.role.routes = generateArrByTree(generateRoleRoutesTree(records))
    // console.log(this.role.routes)
    this.$nextTick(() => {
      // 填充路由权限
      (this.$refs.tree as Tree).setCheckedNodes(this.role.routes)
      this.setHalfParents(this.role.routes)
      // 填充页内权限
      this.fillOperableList(generateArrByTree(this.permsData), this.role.routes)
      this.checkStrictly = false
      this.loading = false
    })
  }

  private fillOperableList(routes: any, roleRoutes: any) {
    for (const route of routes) {
      route.operableList = []
      for (const rr of roleRoutes) {
        if (route.id === rr.id && rr.operableList.length > 0) {
          route.operableList = []
          rr.operableList.map((item: any) => route.operableList.push(item.id))
        }
      }
    }
  }

  private setHalfParents(routes:any) {
    routes.forEach((route:any) => {
      if (route.parentId === 0) {
        const root = (this.$refs.tree as Tree).getNode({ id: route.id })
        const arr:boolean[] = []
        root.childNodes.forEach((item:any) => { arr.push(item.checked) })
        if (arr.indexOf(!arr[0]) > 0) {
          root.checked = false
          root.indeterminate = true
        }
      }
    })
  }

  private handleCheckedOperations(node:any) {
    (this.$refs.tree as Tree).setChecked(node, true, false)
  }

  private handleCheck(node:any) {
    if (node.parentId !== 0) {
      const parent = (this.$refs.tree as Tree).getNode({ id: node.parentId })
      parent.level > 1 && (this.$refs.tree as Tree).setChecked(parent, true, false)
    }
  }

  private generateCheckedKeys(routes:any, checkedKeys:number[]) {
    let res = []
    for (const route of routes) {
      // recursive child routes
      if (route.children) {
        route.children = this.generateCheckedKeys(route.children, checkedKeys)
      }
      if (checkedKeys.includes(route.id) || (route.children && route.children.length >= 1)) {
        res.push(route.id)
        if (route.children.length > 0) {
          res = res.concat(route.children)
        }
        if (route.operableList.length > 0) {
          res = res.concat(route.operableList)
        }
      }
    }
    return res
  }

  @throttle
  private async confirmPermission() {
    const checkedKeys = (this.$refs.tree as Tree).getCheckedKeys()
    const ids = this.generateCheckedKeys(cloneDeep(this.permsData), checkedKeys)
    const params = { roleId: this.role.id, roleName: this.role.name, rolePermissions: ids }
    await setRoleMenus(params)

    this.dialogPermissionVisable = false
    const { remark, id, name } = this.role
    this.$notify({
      title: '操作成功',
      dangerouslyUseHTMLString: true,
      message: `
          <div>角色ID: ${id}</div>
          <div>角色名: ${name}</div>
          <div>备注: ${remark}</div>
        `,
      type: 'success'
    })
  }

  private handleAddRole({ row }: any) {
    this.dialogType = 'new'
    this.dialogVisible = true
    this.role = Object.assign({ parentId: row.id }, defaultRole)
    console.log(this.role)
  }

  private handleEditRole({ row }: any) {
    this.dialogType = 'edit'
    this.dialogVisible = true
    this.role = Object.assign({}, row)
  }

  private handleDeleteRole({ row }: any) {
    console.log(row)
    this.$confirm('确定删除角色？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async() => {
        await deleteRole({ roleId: row.id })
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
      .catch(err => { console.error(err) })
  }

  @throttle
  private async confirmRole() {
    const isEdit = this.dialogType === 'edit'

    isEdit ? await updateRole(this.role) : await addRole(this.role)
    this.getRoleList()

    const { remark, id, name } = this.role
    this.dialogVisible = false
    this.$notify({
      title: '操作成功',
      dangerouslyUseHTMLString: true,
      message: `
            <div>角色ID: ${id}</div>
            <div>角色名: ${name}</div>
            <div>备注: ${remark}</div>
          `,
      type: 'success'
    })
  }
}
</script>

<style lang="scss">
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .tree-head {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    border-bottom: 1px solid rgb(223, 230, 236);
    .col-2 {
      flex: 0 0 450px;
    }
  }
  .permission-tree {
    margin-bottom: 30px;
    .el-tree-node__content {
      align-items: flex-start;
      height: auto !important;
      border-bottom: 1px solid rgb(223, 230, 236);
      cursor: default;
    }
    .el-checkbox__input {
      vertical-align: -2px;
    }
    .el-tree-node__expand-icon {
      padding: 12px 6px;
    }
    .custom-tree-node {
      display: flex;
      justify-content: space-between;
      flex: 1;
    }
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      flex: 0 0 450px;
      .el-checkbox {
        margin-right: 30px;
      }
    }
  }
}
</style>
