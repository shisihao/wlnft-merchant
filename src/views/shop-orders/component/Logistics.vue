<template>
  <el-dialog title="修改物流信息" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="物流公司" prop="logistics_id">
        <el-select
          v-model="form.logistics_id"
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="onRemoteMethod"
          :loading="logisticsLoading"
        >
          <el-option
            v-for="item in logisticsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号" prop="logistics_no">
        <el-input
          v-model="form.logistics_no"
          clearable
          placeholder="请输入快递单号"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { logisticsList, editLogistic } from '@/api/shop-management'
export default {
  name: 'Logistics',
  data() {
    return {
      visible: false,
      btnLoading: false,
      logisticsLoading: false,
      logisticsOptions: [],
      search: {
        keywords: ''
      },
      form: {
        order_id: '',
        logistics_id: '',
        logistics_no: ''
      },
      rules: {
        logistics_id: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        logistics_no: [
          { required: true, message: '请输入', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.order_id = data.id
      }
    },
    getLogistics() {
      this.logisticsLoading = true
      logisticsList(this.search).then((response) => {
        this.logisticsOptions = response.data.map((v) => {
          return {
            label: v.name,
            value: v.id
          }
        })
        this.logisticsLoading = false
      })
    },
    onRemoteMethod(query) {
      if (query !== '') {
        this.search.keywords = query
        this.getLogistics()
      } else {
        this.logisticsOptions = []
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          editLogistic(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style  scoped>
</style>
