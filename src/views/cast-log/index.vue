<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键词">
          <el-input v-model="search.keywords" placeholder="名称/创作者/发行方/手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" @change="getList(1)">
            <el-badge v-for="(item, index) in statusOptions" :key="index" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
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
        width="80"
        align="center"
      />
      <el-table-column
        label="用户信息"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar icon="el-icon-user-solid" :src="row.user.avatar && domin + row.user.avatar" />
            <div style="display: inline-block;margin-left: 10px">
              <div>
                #{{ row.user.id }}
              </div>
              <div>
                {{ row.user.name }}
              </div>
              <div>
                {{ row.user.phone || row.user.email }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="藏品信息"
        min-width="240"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div class="info-wrapper">
            <el-image
              class="image-item"
              :src="row.image && domin + row.image"
              :preview-src-list="[domin + row.image]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div style="margin-left: 10px">
              <div>
                名称：{{ row.name || '' }}
              </div>
              <div>
                发行方：{{ row.issuer || '' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="创作者"
        min-width="150"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex;align-items: center;">
            <el-avatar
              icon="el-icon-user-solid"
              style="flex-shrink: 0;"
              :src="row.author_avatar ? domin + row.author_avatar : ''"
            />
            <div style="margin-left: 4px;flex-grow: 1;">{{ row.author || '-' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="铸造说明"
        prop="desc"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-tooltip popper-class="popover-box" effect="dark" :content="row.desc" placement="top">
            <div class="ellipsis">
              {{ row.desc }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
        align="center"
      >
        <template slot-scope="{ row: { status, reason, admin } }">
          <div v-if="status === 2">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="reason"
            >
              <el-tag slot="reference" :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} <i class="el-icon-info" /></el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} </el-tag>
          </div>
          <div v-if="admin">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
            >
              <div>
                <div>
                  # {{ admin.id }}
                </div>
                <div>
                  {{ admin.name }}
                </div>
              </div>
              <div slot="reference">
                审核人<i class="el-icon-question" />
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="170"
        align="center"
      >
        <template slot-scope="{ row: { created_at, updated_at } }">
          <div>创建：{{ created_at }}</div>
          <div>审核：{{ updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="[1].includes(row.status)">
            <el-button type="success" @click="onPassOrReject(row,2)">通过</el-button>
            <el-button type="danger" @click="onPassOrReject(row,3)">驳回</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, statusPass, statusReject } from '@/api/castlogs'
import { getToken, DominKey } from '@/utils/auth'
import { whetherOptions } from '@/utils/explain'

export default {
  name: 'CastLog',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      whetherOptions,
      list: [],
      search: {
        keywords: '',
        status: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '待审核', value: 1 },
        { label: '通过', value: 2, type: 'success' },
        { label: '驳回', value: 3, type: 'danger' }
      ],
      loading: false
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
          this.pages.total = response.data.total
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onPassOrReject({ id, name, user }, type) {
      const title = type === 2 ? '通过' : '驳回'
      const confirmType = type === 2 ? this.$confirm : this.$prompt

      confirmType(`用户昵称「${user?.name}」，专属藏品「${name}」`, `确认${title}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '理由不能为空！',
        type: `${type === 2 ? 'success' : 'error'}`,
        inputPlaceholder: '请输入驳回理由',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(({ value }) => {
          const api =
            type === 2
              ? statusPass({ cast_log_id: id })
              : statusReject({ cast_log_id: id, reason: value })
          api
            .then(() => {
              this.$message.success(`${type === 2 ? '已通过' : '已驳回'}`)
              this.getList()
            })
            .catch(() => {
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .image-slot {
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
::v-deep .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .RichContent-collapsedText {
  position: relative;
  left: 0;
  top: 0;
  padding-right: 60px;
}
::v-deep .RichContent-lookText {
  position: absolute;
  right: 0;
  top: 0;
  color: #409eff;
  cursor: pointer;
  user-select: none;
}
.info-wrapper {
  display: flex;
  .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    img {
      height: auto;
    }
    ::v-deep .image-slot {
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
    }
  }
}
::v-deep .filter-container .el-input{
  width: 200px;
}

.el-radio-group {
  ::v-deep .badge-item {
    .el-badge__content {
      transform: translateY(-50%) translateX(50%);
      z-index: 1;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0;
      border-left: 0;
    }
    &:first-child .el-radio-button:first-child .el-radio-button__inner {
      border-left: 1px solid #DCDFE6;
      border-radius: 4px 0 0 4px;
    }
    &:last-child .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0 4px 4px 0;
    }
  }
}

</style>
