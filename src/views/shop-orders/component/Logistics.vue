<template>
  <el-dialog title="修改物流信息" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="商品信息" />
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
export default {
  name: 'Logistics',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {

      },
      rules: {

      }
    }
  },
  methods: {
  }
}
</script>

<style  scoped>
</style>
