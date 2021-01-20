<template>
  <div class="app-container systemlog">
    <div class="searcharea">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="调用接口">
          <el-input v-model="formInline.path" placeholder="调用接口" />
        </el-form-item>
        <el-form-item label="调用时间">
          <el-date-picker
            v-model="formInline.operateTime"
            type="datetime"
            placeholder="调用时间"
            value-format="yyyy-MM-dd HH"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="logList"
      row-key="id"
      border
    >
      <el-table-column label="日志ID" align="center" prop="id" width="300" />
      <el-table-column label="传入参数" header-align="center" prop="value" />
      <el-table-column label="调用接口" header-align="center" prop="path" />
      <el-table-column label="操作者" align="center" prop="operator" />
      <el-table-column label="操作IP" align="center" prop="operateIp" />
      <el-table-column label="操作时间" align="center" prop="operateTime" />
    </el-table>
    <div>
      <el-pagination
        style="float:right;margin:20px 0"
        :current-page="currentPage"
        :page-sizes="[pageSize, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getOperatelog } from '@/api/log'

@Component({
  name: 'systemLog'
})
export default class extends Vue {
  private loading = true
  private currentPage = 1
  private pageSize=7
  private total=0
  private logList:any[] = []
  private operateTime = ''
  private path = ''
  private formInline = {
    path: '',
    operateTime: ''
  }

  created() {
    this.getLogList()
  }

  private async getLogList() {
    this.loading = true
    const { data: { records, total } } = await getOperatelog({
      page: this.currentPage,
      pageSize: this.pageSize,
      operateTime: this.operateTime,
      path: this.path
    })
    this.logList = records
    this.total = total
    this.loading = false
  }

  private handleCurrentChange(val:any) {
    console.log(`当前页: ${val}`)
    this.currentPage = val
    this.getLogList()
  }

  private handleSizeChange(val:any) {
    console.log(`每页 ${val} 条`)
    this.pageSize = val
    this.getLogList()
  }

  private onSubmit() {
    this.currentPage = 1
    this.path = this.formInline.path
    this.operateTime = this.formInline.operateTime
    console.log(this.formInline.operateTime)
    this.getLogList()
  }
}
</script>

<style scoped>

</style>
