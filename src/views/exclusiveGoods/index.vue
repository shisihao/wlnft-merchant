<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="search">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
            {{ $t('table.add') }}
          </el-button>
        </el-form-item>
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
        width="120"
        align="center"
      />
      <el-table-column
        prop="name"
        label="模板名称"
        align="center"
      />
      <el-table-column
        prop="sort"
        label="排序"
        align="center"
      />
      <el-table-column
        prop="cny_price"
        label="价格"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="添加时间"
        align="center"
        width="180"
      />
      <el-table-column
        label="操作"
        align="center"
        width="220"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="warning" @click="onPreview3d(row)">预览</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :add-or-update-visible.sync="addOrUpdateVisible"
      @refreshList="getList()"
    />

    <preview3d
      ref="preview3d"
    />
  </div>
</template>

<script>
import { dataList, deleteData } from '@/api/exclusiveGoods'
import AddOrUpdate from './components/AddOrUpdate'
import Pagination from '@/components/Pagination'
import Preview3d from './components/Preview3d'

export default {
  name: 'ExclusiveGoods',
  components: { Pagination, AddOrUpdate, Preview3d },
  data() {
    return {
      list: [],
      loading: false,
      addOrUpdateVisible: false,
      search: {

      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onPreview3d(data) {
      this.$nextTick(() => {
        this.$refs.preview3d && this.$refs.preview3d.init(data)
      })
    },
    onDelete(row) {
      this.$confirm(
        `确定对[(#${row.id})]进行[删除]操作?`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteData(row.id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style  scoped>
.app-container{
  max-width: 1400px;
}
</style>
