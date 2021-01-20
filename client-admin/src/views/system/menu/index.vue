<template>
  <div class="app-container system-menu">
    <el-row class="handle-bar">
      <el-button size="small" @click="handleAddRoot">
        <i class="el-icon-plus" /> 新增根目录
      </el-button>
    </el-row>

    <el-table
      :data="list"
      row-key="id"
      default-expand-all
      border
    >
      <el-table-column prop="name" label="菜单名称" header-align="center" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="权限类型" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 2" type="warning">页内</el-tag>
          <el-tag v-else>路由</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" header-align="center" width="245">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
          <el-button v-if="scope.row.type === 1" type="success" size="mini" @click="handleAddChildren(scope)">添加子目录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="isRoot?'新增根目录':isEdit?'编辑目录':'添加子目录'"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="600px"
      @open="clearValidate('menuForm')"
    >
      <el-form
        ref="menuForm"
        :model="menu"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="资源类型" prop="type">
          <el-radio-group v-model="menu.type" :disabled="isRoot || Boolean(menu.children)" @change="clearValidate('menuForm')">
            <el-radio :label="1">路由权限</el-radio>
            <el-radio :label="2">页内权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" placeholder="菜单名称" />
        </el-form-item>
        <template v-if="menu.type === 1">
          <el-form-item label="菜单路径" prop="path">
            <el-input v-model="menu.path" placeholder="菜单路径" />
          </el-form-item>
          <el-form-item label="外链地址" prop="url">
            <el-input v-model="menu.url" placeholder="外链地址" />
          </el-form-item>
        </template>
        <el-form-item v-if="menu.type === 2" label="权限码" prop="auth">
          <el-input v-model="menu.auth" placeholder="权限码" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="menu.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="图标">
          <span v-if="menu.icon" style="margin-right: 10px;">
            <svg-icon :name="menu.icon" class="icon" />
            <el-button type="text" @click="menu.icon = ''">删除</el-button>
          </span>
          <el-popover
            v-model="popoverVisible"
            placement="right"
            width="376"
            trigger="click"
          >
            <div class="icons-bar">
              <div v-for="item of svgIcons" :key="item" class="icon-item" @click="handleIconAdd(item)">
                <svg-icon :name="item" class="disabled" />
              </div>
            </div>
            <el-button slot="reference" size="mini">选择图标</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="menu.seq" placeholder="排序" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="menu.remark"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmMenu">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { cloneDeep } from 'lodash'
import { generateArrByTree } from '@/utils'
import { throttle } from '@/decorator'
import { getMenus, addMenu, editMenu, deleteMenu, setRoleMenus } from '@/api/permission'
import svgIcons from '@/views/icons/svg-icons'

const defaultMenu = {
  id: null,
  parentId: 0,
  name: '',
  path: '',
  url: '',
  auth: '',
  type: 1,
  status: 1,
  seq: 100,
  icon: '',
  remark: ''
}

@Component({ name: 'systemMenu' })
export default class extends Vue {
  private list = []
  private menu = Object.assign({}, defaultMenu)
  private svgIcons = svgIcons
  private dialogVisible = false
  private dialogType = 'root'
  private popoverVisible= false

  private formRules = {
    name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
    path: [{ required: true, validator: this.validatePath, trigger: 'blur' }],
    auth: [{ required: true, message: '请输入资源编码', trigger: 'blur' }]
  }

  private validatePath(rule: any, value: string, callback: Function) {
    let isRepeat = false
    generateArrByTree(this.list).map((item: any) => {
      if (item.parentId === 0 && this.menu.parentId === 0 && item.id !== this.menu.id) {
        item.path === value && (isRepeat = true)
      } else if (item.id === this.menu.parentId) {
        item.children.map((it: any) => it.id !== this.menu.id && it.path === value && (isRepeat = true))
      }
    })

    if (value === '') {
      callback(new Error('请输入资源路径'))
    } else if (isRepeat) {
      callback(new Error('该路径已存在'))
    } else if (this.menu.parentId === 0 && value.indexOf('/') !== 0) {
      callback(new Error('根路由必须以"/"开头'))
    } else if (this.menu.parentId !== 0 && value.indexOf('/') === 0) {
      callback(new Error('子路由不能以"/"开头'))
    } else {
      callback()
    }
  }

  created() {
    this.getMenuList()
  }

  get isRoot() {
    return this.dialogType === 'root'
  }

  get isEdit() {
    return this.dialogType === 'edit'
  }

  get ids() {
    return this.getAllIds(cloneDeep(this.list)).sort((a, b) => a - b).toString()
  }

  private getAllIds(list: any[]) {
    let res:any[] = []
    for (const menu of list) {
      res.push(menu.id)
      if (menu.children && menu.children.length > 0) {
        menu.children = this.getAllIds(menu.children)
        res = res.concat(menu.children)
      }
    }
    return res
  }

  @Watch('ids')
  private onIdsChange(value: string) {
    // 提交全部权限给管理员
    setRoleMenus({ roleId: 1, rolePermissions: value.split(',') })
  }

  private async getMenuList() {
    const { data: { records } } = await getMenus()
    this.list = records
  }

  private handleAddRoot() {
    this.menu = Object.assign({}, defaultMenu)
    this.dialogType = 'root'
    this.dialogVisible = true
  }

  private handleAddChildren({ row }: any) {
    this.menu = Object.assign({}, defaultMenu)
    this.menu.parentId = row.id
    this.dialogType = 'children'
    this.dialogVisible = true
  }

  private handleEdit({ row }: any) {
    this.menu = Object.assign({}, row)
    this.dialogType = 'edit'
    this.dialogVisible = true
  }

  private handleDelete({ row }: any) {
    const type = row.type === 1 ? '路由权限：' : '页内权限：'
    this.$confirm(`确定删除${type + row.name}？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async() => {
        await deleteMenu({ id: row.id })
        this.getMenuList()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
      .catch(err => err)
  }

  @throttle
  private async confirmMenu() {
    (this.$refs.menuForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.isEdit ? await editMenu(this.menu) : await addMenu(this.menu)
        this.getMenuList()

        this.dialogVisible = false
        const name = this.menu.name
        const status = this.menu.status === 1 ? '启用' : '禁用'
        const type = this.menu.type === 1 ? '路由' : '按钮'
        this.$notify({
          title: '操作成功',
          dangerouslyUseHTMLString: true,
          message: `
            <div>菜单名称：${name}</div>
            <div>类型：${type}</div>
            <div>状态：${status}</div>
          `,
          type: 'success'
        })
      }
    })
  }

  private clearValidate(formName: string) {
    this.$refs[formName] && (this.$refs[formName] as ElForm).clearValidate()
  }

  private handleIconAdd(name: string) {
    this.menu.icon = name
    this.popoverVisible = false
  }
}
</script>

<style lang="scss" scoped>
</style>

<style>
.app-container.system-menu {
  padding-bottom: 100px;
}
.app-container.system-menu .el-form-item .icon {
  margin-right: 3px;
  font-size: 20px;
  vertical-align: -5px;
}
.app-container.system-menu .el-table .icon {
  margin-right: 5px;
}
.icons-bar {
  display: flex;
  flex-wrap: wrap;
}
.icons-bar .icon-item {
  margin: 5px;
  padding: 10px;
  height: 40px;
  line-height: 20px;
  font-size: 20px;
  cursor: pointer;
}
.icons-bar .icon-item:hover {
  background-color: #F2F6FC;
}
</style>
