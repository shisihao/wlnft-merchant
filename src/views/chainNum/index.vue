<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="时间">
          <el-date-picker
            v-model="dateRangeValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="search" placeholder="请选择" clearable @change="getList(1)">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌商">
          <el-select v-model="search" placeholder="请选择" clearable @change="getList(1)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
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
        width="120"
        align="center"
      />
      <el-table-column
        prop="id"
        label="品牌商"
        align="center"
      />
      <el-table-column
        prop="id"
        label="类型"
        align="center"
      />
      <el-table-column
        prop="id"
        label="消耗次数"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { pickerOptions } from '@/utils/explain'
import { dataList, exportOrder } from '@/api/chainNum'
import Pagination from '@/components/Pagination'
export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      downloadLoading: false,
      pickerOptions,
      search: {

      },
      list: [],
      loading: false,
      dateRangeValue: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      typeOptions: [
        { label: '全部', value: '' },
        { label: '藏品铸造', value: 1 },
        { label: '用户藏品转赠', value: 2 }
      ]
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
          this.list = response.data
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then(response => {
          location.href = this.domin + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style  scoped>
.app-container{
  max-width: 1400px;
}
</style>
