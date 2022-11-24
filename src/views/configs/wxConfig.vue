<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="APPID" prop="appid">
        <el-input v-model="form.appid" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="秘钥" prop="secret">
        <el-input v-model="form.secret" placeholder="请输入" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { wxConfig, putWxConfig } from '@/api/configs'

export default {
  name: 'WxConfig',
  data() {
    return {
      btnLoading: false,
      form: {
        appid: '',
        secret: ''
      },
      rules: {
        appid: [{ required: true, message: '请输入', trigger: 'blur' }],
        secret: [{ required: true, message: '请输入', trigger: 'blur' }]
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
    getList() {
      wxConfig().then(response => {
        this.form = response.data.value
      })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putWxConfig(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style  scoped>
.app-container{
  width: 800px;
}
</style>
