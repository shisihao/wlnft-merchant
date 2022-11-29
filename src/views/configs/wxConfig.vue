<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="APPID" prop="appid">
        <el-input v-model="form.appid" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="秘钥" prop="secret">
        <el-input v-model="form.secret" placeholder="请输入" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="商户号" prop="mer_num">
        <el-input v-model="form.mer_num" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="商户v3秘钥" prop="mer_key">
        <el-input v-model="form.mer_key" placeholder="请输入" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="商户api秘钥" prop="ssl_key">
        <el-input v-model="form.ssl_key" placeholder="请输入" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="商户证书序列号" prop="cert_serial">
        <el-input v-model="form.cert_serial" placeholder="请输入" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="微信支付平台证书" prop="ssl_cert">
        <el-input v-model="form.ssl_cert" placeholder="请输入" type="textarea" :rows="10" />
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
        secret: '',
        mer_num: '',
        mer_key: '',
        cert_serial: '',
        ssl_key: '',
        ssl_cert: ''
      },
      rules: {
        appid: [{ required: true, message: '请输入', trigger: 'blur' }],
        secret: [{ required: true, message: '请输入', trigger: 'blur' }],
        mer_num: [{ required: true, message: '请输入', trigger: 'blur' }],
        mer_key: [{ required: true, message: '请输入', trigger: 'blur' }],
        ssl_cert: [{ required: true, message: '请输入', trigger: 'blur' }],
        ssl_key: [{ required: true, message: '请输入', trigger: 'blur' }],
        cert_serial: [{ required: true, message: '请输入', trigger: 'blur' }]
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
        this.certList = [{ name: response.data.value.cert_path }]
        this.keyList = [{ name: response.data.value.key_path }]
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
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    beforeAvatarUpload(file, cb, refName) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    handleAvatarSuccess(response, file) {
      if (this.currentName === 'certList') {
        this.form.cert_path = response
      } else {
        this.form.key_path = response
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    handleRemove(file, fileList) {
      if (file === 'cert_path') {
        this.form.cert_path = ''
        this.certList = []
      } else {
        this.form.key_path = ''
        this.keyList = []
      }
    },
    handleError() {
      this[this.currentName] = []
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
	width: 800px;
	::v-deep .el-upload-list__item {
		transition: none;
	}
}
</style>
