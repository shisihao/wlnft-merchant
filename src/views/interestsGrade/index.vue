<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="form">
        <el-button type="primary" icon="el-icon-plus" @click="onAddName()">
          {{ $t('table.add') }}等级
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        align="center"
        width="80"
      />
      <el-table-column
        prop="name"
        label="等级"
        align="center"
        width="300"
      >
        <template slot-scope="{ row }">
          <template v-if="!row.flag">
            <el-link style="margin:2px 0 3px" type="primary" :underline="false" @click="row.flag = true">{{ row.name }}</el-link>
          </template>
          <template v-else>
            <el-input v-model="row.name" placeholder="请输入修改的内容" style="width:100px" />
            <el-button style="margin-left:10px" type="success" :loading="editBtnLoading" @click="onUpdateName(row)">确认</el-button>
            <el-button type="warning" @click="onCancelEdit(row)">取消</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        align="center"
      />
    </el-table>
  </div>

</template>

<script>
import { gradeList, addOrUpdate } from '@/api/interestsGrade'
export default {
  name: 'InterestsGrade',
  data() {
    return {
      loading: false,
      editBtnLoading: false,
      list: [],
      form: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      gradeList()
        .then(res => {
          res.data.forEach(item => {
            item.flag = false
            item.oldName = item.name
          })
          this.list = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAddName() {
      this.$prompt('请输入等级名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S+$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        addOrUpdate({ name: value }).then((res) => {
          this.$message.success(res.msg)
          this.getList()
        })
      }).catch(() => { })
    },
    onUpdateName(row) {
      this.editBtnLoading = true
      addOrUpdate(row)
        .then((res) => {
          row.flag = !row.flag
          this.$message.success(res.msg)
          this.getList()
        }).finally(() => {
          this.editBtnLoading = false
        })
    },
    onCancelEdit(row) {
      row.flag = !row.flag
      row.name = row.oldName
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  width: 800px;
}
</style>
